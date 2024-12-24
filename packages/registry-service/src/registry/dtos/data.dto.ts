export type ManifestData = {
  owner: string;
  project_id: string;
  default_branch: string;

  branches: Record<
    string,
    {
      latest: string;
      versions: string[];
    }
  >;
};
