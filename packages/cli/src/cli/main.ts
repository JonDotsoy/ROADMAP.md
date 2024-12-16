import {
  command,
  flags,
  flag,
  isBooleanAt,
  restArgumentsAt,
  rule,
  type Rule,
} from "@jondotsoy/flags";
import { renderMainHelp } from "./main-help.js";
import { init } from "./init.js";
import { describe } from "./describe.js";

export const main = async (args: string[]) => {
  type MainOptions = {
    init: string[];
    describe: string[];
    help: boolean | string[];
  };

  const mainRules: Rule<MainOptions>[] = [
    rule(command("init"), restArgumentsAt("init")),
    rule(command("help"), restArgumentsAt("help")),
    rule(flag("-h", "--help"), isBooleanAt("help")),
    rule(() => true, restArgumentsAt("describe")),
  ];

  const mainOptions = flags<MainOptions>(args, {}, mainRules);

  if (mainOptions.help) return console.log(renderMainHelp());
  if (mainOptions.init) return init(mainOptions.init);

  mainOptions.describe ??= [];
  return describe(mainOptions.describe);
};
