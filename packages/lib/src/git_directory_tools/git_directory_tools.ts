import { execa } from "execa";
import type { CommitHistoryDTO } from "./dtos/commit-history-dto";
import type { BranchDTO } from "./dtos/branch-dto";
import type { PathCommitHistoryDTO } from "./dtos/path-commit-history-dto";

const toUrl = (value?: URL | string | undefined) =>
  value && URL.canParse(value) ? new URL(value, "file:///") : undefined;

const createCommitIndexByHash = (commitHistories: CommitHistoryDTO[]) => {
  const indexByHash = new Map<string, CommitHistoryDTO>();

  for (const commitHistory of commitHistories) {
    indexByHash.set(commitHistory.hash, commitHistory);
  }

  return (hash: string) => indexByHash.get(hash) ?? null;
};

const createBranchIndexByHash = (branches: BranchDTO[]) => {
  const indexByHash = new Map<string, BranchDTO>();

  for (const branch of branches) {
    indexByHash.set(branch.hash, branch);
  }

  return (hash: string) => indexByHash.get(hash) ?? null;
};

export class GitDirectoryTools {
  #workspace: URL;
  #history: CommitHistoryDTO[];
  #branches: BranchDTO[];
  #commitIndexByHash: (hash: string) => CommitHistoryDTO | null;
  #branchIndexByHash: (hash: string) => BranchDTO | null;

  constructor(
    workspace: string,
    history: CommitHistoryDTO[],
    branches: BranchDTO[],
  ) {
    this.#workspace = new URL(workspace);
    this.#history = history;
    this.#branches = branches;
    this.#commitIndexByHash = createCommitIndexByHash(this.#history);
    this.#branchIndexByHash = createBranchIndexByHash(this.#branches);
  }

  async showHistoryRelativePath(relativeName: string) {
    const { stdout } = await execa({
      cwd: toUrl(this.#workspace),
    })`git ${"--no-pager"} ${"log"} ${"--all"} ${"--pretty=format:%cI --> %aN --> %aE --> %P --> %H"} ${"--"} ${relativeName}`;

    return stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line) => line.split("-->").map((part) => part.trim()))
      .map((parts) => {
        const [timestamp, authorName, authorEmail, parent, hash] = parts;

        const commitHistory: CommitHistoryDTO = {
          timestamp: new Date(timestamp),
          author: {
            name: authorName,
            email: authorEmail,
          },
          parent: parent === "" ? [] : parent.split(" "),
          hash,
        };
        return commitHistory;
      })
      .map((commitHistory) => {
        const pathCommitHistory: Partial<PathCommitHistoryDTO> = {
          commitHistory,
          hash: commitHistory.hash,
        };

        return pathCommitHistory;
      });
  }

  *listParents(commitHash: string): Generator<string> {
    const historyCommit = this.#commitIndexByHash(commitHash);
    if (historyCommit)
      for (const historyCommitParentHash of historyCommit.parent) {
        yield historyCommitParentHash;
        yield* this.listParents(historyCommitParentHash);
      }
  }

  isChildOf(commitHash: string, parentHash: string): boolean {
    for (const historyCommitParentHash of this.listParents(commitHash)) {
      if (historyCommitParentHash === parentHash) return true;
    }
    return false;
  }

  static async getBranches(workspace?: string): Promise<BranchDTO[]> {
    const { stdout } = await execa({
      cwd: toUrl(workspace),
    })`git ${"--no-pager"} ${"branch"} ${"-vv"} ${"--format=%(refname) --> %(upstream) --> %(objectname) --> %(objecttype) --> %(parent)"}`;

    const branches = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line): BranchDTO => {
        const [refname, upstream, objectname, objecttype, parent] = line
          .split("-->")
          .map((part) => part.trim());

        return {
          type: objecttype,
          refname,
          upstream: upstream === "" ? null : upstream,
          parent: parent === "" ? [] : parent.split(" "),
          hash: objectname,
        };
      });

    return branches;
  }

  static async getHistory(workspace?: string): Promise<CommitHistoryDTO[]> {
    const { stdout } = await execa({
      cwd: toUrl(workspace),
    })`git ${"--no-pager"} ${"log"} ${"--all"} ${"--pretty=format:%cI --> %aN --> %aE --> %P --> %H"}`;

    const history: CommitHistoryDTO[] = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line): CommitHistoryDTO => {
        const [timestamp, authorName, authorEmail, parent, hash] = line
          .split("-->")
          .map((part) => part.trim());
        return {
          timestamp: new Date(timestamp),
          author: {
            name: authorName,
            email: authorEmail,
          },
          parent: parent === "" ? [] : parent.split(" "),
          hash,
        };
      });

    return history;
  }

  static async fromWorkspace(
    workspace: string = new URL(`${process.cwd()}/`, `file:///`).toString(),
  ): Promise<GitDirectoryTools> {
    return new GitDirectoryTools(
      workspace,
      await GitDirectoryTools.getHistory(workspace),
      await GitDirectoryTools.getBranches(workspace),
    );
  }
}
