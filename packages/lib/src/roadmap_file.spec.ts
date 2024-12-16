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

test("should correctly parse and extract roadmap tasks from a Markdown file", async () => {
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

test.only("should parse roadmap", async () => {
  const roadmap = await RoadmapFile.fromFile(
    await demoFile(
      "" +
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
        "| [Task 1](#task-1) | In Progress | September 2024 |\n" +
        "\n" +
        "## Proposals\n" +
        "\n" +
        "### Task 1\n" +
        "\n" +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu purus pretium, dictum lectus nec, auctor augue. Donec nec dapibus enim, et viverra arcu. Nulla finibus massa dui, non sodales nisi sagittis non. Vivamus dictum diam at mi scelerisque dapibus. Pellentesque commodo molestie nibh nec pellentesque. Praesent posuere sodales sapien, et tincidunt turpis accumsan eu. Cras at lorem sapien. Vestibulum vulputate hendrerit tortor at bibendum.\n" +
        "\n" +
        "### Task 2\n" +
        "\n" +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue ante eu suscipit porta. Sed faucibus pharetra urna, ut accumsan dolor imperdiet et. Proin nunc turpis, sollicitudin ac ipsum ac, eleifend interdum lectus. In accumsan venenatis orci, pretium sodales justo pulvinar vel. Cras sed semper ipsum, nec posuere sapien. Vivamus finibus laoreet nulla a sagittis. Proin eleifend aliquet enim, nec vulputate sem. Quisque mattis ultrices sem, et porttitor massa pulvinar vitae. Pellentesque luctus leo vitae sagittis congue. Nullam id elit a augue vestibulum porta. Quisque mi nisl, placerat vitae lacinia sed, congue nec neque. Vivamus ut molestie enim. Donec sed sem consequat, gravida ex id, varius mauris. Donec massa velit, placerat eu aliquet at, lacinia eu mauris. Fusce sed aliquet nisl. Etiam tincidunt elit gravida odio euismod, ut tempor diam egestas.\n" +
        "",
    ),
  );

  const tasks = await roadmap.listTasks();

  expect(tasks).toMatchObject([
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
