import { describe, expect, it } from "bun:test";
import { GitDirectoryTools } from "./git_directory_tools";
import { $ } from "bun";

describe("GitDirectoryTools", () => {
  it("GitDirectoryTools.getHistory", async () => {
    await GitDirectoryTools.getHistory();
  });
  it("GitDirectoryTools.getBranches", async () => {
    await GitDirectoryTools.getBranches();
  });
  it("GitDirectoryTools.fromWorkspace", async () => {
    await GitDirectoryTools.fromWorkspace();
  });

  it("gitDirectoryTools.showHistoryRelativePath", async () => {
    const gitDirectoryTools = await GitDirectoryTools.fromWorkspace();

    await gitDirectoryTools.showHistoryRelativePath("README.md");
  });

  it("gitDirectoryTools.isChildOf", async () => {
    const gitDirectoryTools = new GitDirectoryTools(
      "file://app",
      [
        {
          author: { name: "foo", email: "foo" },
          hash: "a",
          parent: [],
          timestamp: new Date(),
        },
        {
          author: { name: "foo", email: "foo" },
          hash: "b",
          parent: ["a"],
          timestamp: new Date(),
        },
        {
          author: { name: "foo", email: "foo" },
          hash: "c",
          parent: ["b"],
          timestamp: new Date(),
        },
      ],
      [],
    );

    expect(gitDirectoryTools.isChildOf("c", "a")).toBeTrue();
    expect(gitDirectoryTools.isChildOf("h", "a")).toBeFalse();
  });

  it("gitDirectoryTools.listParents", () => {
    const gitDirectoryTools = new GitDirectoryTools(
      "file://app",
      [
        {
          author: { name: "foo", email: "foo" },
          hash: "a",
          parent: [],
          timestamp: new Date(),
        },
        {
          author: { name: "foo", email: "foo" },
          hash: "b",
          parent: ["a"],
          timestamp: new Date(),
        },
        {
          author: { name: "foo", email: "foo" },
          hash: "c",
          parent: ["b"],
          timestamp: new Date(),
        },
      ],
      [],
    );

    expect(Array.from(gitDirectoryTools.listParents("c"))).toEqual(["b", "a"]);
  });
});
