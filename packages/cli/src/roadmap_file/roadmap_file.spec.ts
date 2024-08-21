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

test.only("should correctly parse and extract roadmap tasks from a Markdown file", async () => {
  const roadmap = await RoadmapFile.fromFile(
    await demoFile(
      "## Roadmap\n" +
        "\n" +
        "### 🚧 Active\n" +
        "\n" +
        "| Feature | Expected Release Date |\n" +
        "| --- | --- |\n" +
        "| [Task 2](#task-2) | August 2024 |\n" +
        "\n" +
        "### ⏳ Planned\n" +
        "\n" +
        "| Feature | Status | Expected Completion Date |\n" +
        "| --- | --- | --- |\n" +
        "| [Task 1](#task-1) | In Progress | September 2024 |\n",
    ),
  );

  expect(await roadmap.infoTasks()).toMatchObject([
    {
      title: "Task 1",
      status: "In Progress",
      expectedCompletionDate: "September 2024",
      expectedReleaseDate: undefined,
    },
    {
      title: "Task 2",
      status: "Done",
      expectedReleaseDate: "August 2024",
      expectedCompletionDate: undefined,
    },
  ]);
});
