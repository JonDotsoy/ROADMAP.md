import {
  command,
  flags,
  restArgumentsAt,
  rule,
  type Rule,
} from "@jondotsoy/flags";
import { init } from "./init.js";
import { describe } from "./describe.js";

export const main = async (args: string[]) => {
  type MainOptions = {
    init: string[];
    describe: string[];
  };

  const mainRules: Rule<MainOptions>[] = [
    rule(command("init"), restArgumentsAt("init")),
    rule(() => true, restArgumentsAt("describe")),
  ];

  const mainOptions = flags<MainOptions>(args, {}, mainRules);

  if (mainOptions.init) return init(mainOptions.init);

  mainOptions.describe ??= [];
  return describe(mainOptions.describe);
};
