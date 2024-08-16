import {
  flag,
  flags,
  isStringAt,
  rule,
  type Rule,
} from "@jondotsoy/flags";
import { RoadmapFile } from "../roadmap_file/roadmap_file.js";
import * as path from "node:path";
import { styleText } from "../common/style-text.js";

async function* findFiles(cwd: string, pattern: string) {
  for await (const fileLocation of new Bun.Glob(pattern).scan({
    cwd: cwd,
    absolute: true,
  })) {
    yield fileLocation;
  }
}

const arrayFirstFromAsync = async <T>(iterable: AsyncIterable<T>) => {
  for await (const item of iterable) {
    return item;
  }
};

export const describe = async (args: string[]) => {
  type DescribeOptions = {
    cwd: string;
    pattern: string;
    // noDepth: boolean;
  };

  const rules: Rule<DescribeOptions>[] = [
    rule(flag("--cwd"), isStringAt("cwd")),
    rule((arg, ctx) => {
      if (ctx.flags.pattern) return false;
      ctx.argValue = arg;
      return true;
    }, isStringAt("pattern")),
  ];

  const options = flags<DescribeOptions>(args, {}, rules);

  const cwdBase = new URL(`${process.cwd()}/`, "file://");
  const cwd = new URL(options.cwd ?? `${process.cwd()}/`, cwdBase);

  const pattern = options.pattern ?? `**/{ROADMAP,roadmap}{,.md}`;

  const filePathFound = await arrayFirstFromAsync(
    findFiles(cwd.pathname, pattern),
  );

  if (!filePathFound) {
    console.error(`Cannot found`);
    return;
  }

  const fileRelativePathFound = path.relative(process.cwd(), filePathFound);

  const roadmap = await RoadmapFile.fromFile(filePathFound);
  const tasks = await roadmap.listTasks();

  console.log(
    `${styleText("bold", "Tasks")} available in ${styleText("green", fileRelativePathFound)}:\n` +
      tasks.map((t) => `  ${t.title}\n`).join(""),
  );
};
