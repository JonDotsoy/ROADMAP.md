import { test, expect } from "bun:test";
import { RoadmapFile } from "./roadmap_file.js";
import fs from "fs/promises";

const demoFile = async (body: string) => {
  const tmp = new URL(".tmp/", import.meta.url);
  await fs.mkdir(tmp, { recursive: true });
  await fs.writeFile(new URL(".gitignore", tmp), "*");
  const f = new URL("demo", tmp);
  await fs.writeFile(f, body);
  return f;
};

test("should create a new instance of RoadmapFile", async () => {
  expect(
    await RoadmapFile.fromFile(
      await demoFile(
        "## Proposals\n\n" + "### First task\n\n" + "### Second task\n\n",
      ),
    ),
  ).toBeInstanceOf(RoadmapFile);
});

test("should return a list of tasks", async () => {
  const roadmap = await RoadmapFile.fromFile(
    await demoFile(
      "## Proposals\n\n" +
        "### First task\n\n" +
        "### Second task\n\n" +
        "## Other section\n\n",
    ),
  );
  expect(await roadmap.listTasks()).toHaveLength(2);
});

test("should return the title of the first task", async () => {
  const roadmap = await RoadmapFile.fromFile(
    await demoFile(
      "## Proposals\n\n" + "### First task\n\n" + "### Second task\n\n",
    ),
  );
  expect(await roadmap.listTasks()).toContainEqual({ title: "First task" });
});
