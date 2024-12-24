import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  mock,
  setSystemTime,
} from "bun:test";
import { Registry } from "./registry";
import { LocalStorage } from "./provider/local-storage/local-storage";
import { rm, stat } from "fs/promises";
import { readdir } from "fs/promises";

const snapDir = async (dir: URL) => {
  for (const e of await readdir(dir)) {
    const fullPath = new URL(e, dir);
    const s = await stat(fullPath);
    if (s.isFile()) {
      expect(await Bun.file(fullPath).text()).toMatchSnapshot(e);
    }
  }
};

describe("Registry", () => {
  beforeAll(() => {
    setSystemTime(1000);
  });
  afterAll(() => {
    setSystemTime();
  });

  it("updates roadmap and snapshots correctly", async () => {
    const w = new URL("__workspace__/1/", import.meta.url);
    await rm(w, { recursive: true });
    const localStorage = await LocalStorage.create(w);
    const registry = await new Registry(localStorage);
    await registry.updateRoadmap("me", "foo", "1.0.0", "main", { foo: "bar" });
    await registry.updateRoadmap("me", "foo", "1.0.1", "main", { foo: "bar" });
    await registry.updateRoadmap("me", "foo", "1.0.2", "main", { foo: "bar" });
    await registry.updateRoadmap("cat", "foo", "1.0.2", "main", { foo: "bar" });
    await registry.updateRoadmap("cat", "taz", "1.0.2", "main", { foo: "bar" });
    await registry.updateRoadmap("cat", "tal", "1.0.2", "main", { foo: "bar" });
    await registry.updateRoadmap("cat", "tal", "1.0.3", "main", { foo: "bar" });
    await snapDir(w);
  });

  it("gets roadmap and snapshots correctly", async () => {
    const w = new URL("__workspace__/2/", import.meta.url);
    await rm(w, { recursive: true });
    const localStorage = await LocalStorage.create(w);
    const registry = await new Registry(localStorage);
    await registry.updateRoadmap("me", "foo", "1.0.0", "main", { foo: "bar" });
    await registry.updateRoadmap("me", "foo", "1.0.1", "main", { foo: "bar" });
    await registry.updateRoadmap("me", "foo", "1.0.2", "main", { foo: "bar" });
    await registry.updateRoadmap("me", "foo", "1.0.0", "feature/foo", {
      foo: "bar",
    });
    await registry.updateRoadmap("me", "foo", "1.0.0", "feature/taz", {
      foo: "bar",
    });

    const roadmap = await registry.getRoadmap("me", "foo");
    expect(roadmap).toMatchSnapshot();
  });
});
