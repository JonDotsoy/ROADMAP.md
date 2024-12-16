import { flag, flags, isBooleanAt, isStringAt, rule, type Rule } from "@jondotsoy/flags";
import { RoadmapFile } from "@jondotsoy/roadmap-parse";
import * as path from "node:path";
import { styleText } from "@jondotsoy/style-text";
import { render, c } from "@jondotsoy/console-draw";
import { intld } from "../common/intl-dictionary.js";
import * as YAML from "yaml";

async function* findFiles(cwd: string, pattern: string) {
  const mainFile = new URL(pattern, new URL(`${cwd}/`, `file://`));

  if (await Bun.file(mainFile).exists()) {
    yield mainFile.pathname;
  }

  for await (const fileLocation of new Bun.Glob(pattern).scan({
    cwd: cwd,
    absolute: true,
    onlyFiles: true,
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
    json: boolean
    yaml: boolean
    // noDepth: boolean;
  };

  const rules: Rule<DescribeOptions>[] = [
    rule(flag("-j", "--json"), isBooleanAt("json")),
    rule(flag("-y", "--yaml"), isBooleanAt("yaml")),
    rule(flag("-c", "--cwd"), isStringAt("cwd")),
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
    console.error(`Cannot found ${pattern}`);
    return;
  }

  const fileRelativePathFound = path.relative(process.cwd(), filePathFound);

  const roadmap = await RoadmapFile.fromFile(filePathFound);
  const tasks = await roadmap.listTasks();

  const columns = process.stdout.columns ?? 80;
  if (options.json) return console.log(JSON.stringify(tasks, null, 2));
  if (options.yaml) return console.log(YAML.stringify(tasks));

  console.log(
    render(
      c("div", [
        c(
          "text",
          intld`${styleText("bold", "Tasks")} available in ${styleText("green", fileRelativePathFound)}:`,
        ),
        ...tasks.map((task) => {
          return c(
            "columns",
            {
              gap: 2,
              columns: 3,
              columnsTemplate: [{ width: 1 }, { width: 15 }],
            },
            [
              c("text", ""),
              c("text", intld`${task.status}`),
              c("text", task.title),
            ],
          );
        }),
      ]),
      { width: columns },
    ),
  );
};
