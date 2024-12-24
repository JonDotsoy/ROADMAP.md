import type { ManifestData } from "./dtos/data.dto";
import type { StorageProviderDTO } from "./dtos/storage-provider-dto";

export class Registry {
  constructor(private storage: StorageProviderDTO) {}

  private async getMainManifest(
    owner: string,
    project_id: string,
    default_branch?: string,
  ): Promise<ManifestData> {
    const key = `${owner}/${project_id}/main`.toLowerCase();
    return (
      JSON.parse((await this.storage.get(key)) ?? "null") ?? {
        owner,
        project_id,
        default_branch: default_branch,
        branches: {},
      }
    );
  }

  private async updateManifest(
    owner: string,
    project_id: string,
    manifest: ManifestData,
  ) {
    const key = `${owner}/${project_id}/main`.toLowerCase();
    await this.storage.set(key, JSON.stringify(manifest));
  }

  async getRoadmap(owner: string, project_id: string) {
    const manifest = await this.getMainManifest(owner, project_id);

    const data = {
      manifest,
      branches: Object.fromEntries(
        await Array.fromAsync(
          Object.entries(manifest.branches),
          async ([branch, { latest }]) => {
            return [
              branch,
              await this.getRoadmapBranch(owner, project_id, latest, branch),
            ];
          },
        ),
      ),
    };

    return data;
  }

  async getRoadmapBranch(
    owner: string,
    project_id: string,
    version: string,
    branch: string,
  ) {
    const roadmapKey =
      `${owner}/${project_id}/versions/${version}/${branch}`.toLowerCase();
    return JSON.parse((await this.storage.get(roadmapKey)) ?? "null");
  }

  async updateRoadmap(
    owner: string,
    project_id: string,
    version: string,
    branch: string,
    roadmap: any,
  ) {
    const roadmapKey =
      `${owner}/${project_id}/versions/${version}/${branch}`.toLowerCase();
    const createdAt = Date.now();
    if (await this.storage.has(roadmapKey))
      throw new Error("Roadmap already exists");

    const manifest = await this.getMainManifest(owner, project_id, branch);

    manifest.branches[branch] ??= {
      latest: "-",
      versions: [],
    };

    manifest.branches[branch].versions.push(version);
    manifest.branches[branch].latest = version;

    await this.storage.set(
      roadmapKey,
      JSON.stringify({
        owner,
        project_id,
        version,
        branch,
        created_at: createdAt,
        roadmap_data: roadmap,
      }),
    );

    await this.updateManifest(owner, project_id, manifest);
  }
}
