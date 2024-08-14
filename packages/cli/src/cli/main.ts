import {
  command,
  flags,
  restArgumentsAt,
  rule,
  type Rule,
} from "@jondotsoy/flags";
import { init } from "./init.js";

export const main = async (args: string[]) => {
  type MainOptions = {
    init: string[];
  };

  const mainRules: Rule<MainOptions>[] = [
    rule(command("init"), restArgumentsAt("init")),
  ];

  const mainOptions = flags<MainOptions>(args, {}, mainRules);

  if (mainOptions.init) return init(mainOptions.init);

  throw new Error("Missing argument");
};
