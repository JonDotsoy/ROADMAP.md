import { flags, type Rule } from "@jondotsoy/flags";
import { file } from "bun";
import { roadmapTemplate } from "../roadmap_template";

export const init = async (args: string[]) => {
  type InitOptions = {};

  const initRules: Rule<InitOptions>[] = [];

  const initOptions = flags<InitOptions>(args, {}, initRules);

  const cwd = new URL(`${process.cwd()}/`, "file:");
  const roadmap = new URL("ROADMAP.md", cwd);

  const roadmapFile = file(roadmap);

  if (await roadmapFile.exists()) {
    console.log(`The ROADMAP.md was found here.`);
    return;
  }

  const roadmapWriter = roadmapFile.writer();
  roadmapWriter.write(roadmapTemplate);
  await roadmapWriter.end();

  console.log(`Added ROADMAP.md file.`);
};
