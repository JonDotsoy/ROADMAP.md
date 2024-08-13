import { command, flags, restArgumentsAt, rule, type Rule } from "@jondotsoy/flags"
import { file } from "bun";
import { roadmapTemplate } from "./roadmap_template.js";

const run = async () => {

    type MainOptions = {
        init: string[]
    }

    const mainRules: Rule<MainOptions>[] = [
        rule(command("init"), restArgumentsAt("init")),
    ];

    const mainOptions = flags<MainOptions>(process.argv.slice(2), {}, mainRules);

    if (mainOptions.init) {
        type InitOptions = {}

        const initRules: Rule<InitOptions>[] = [];

        const initOptions = flags<InitOptions>(mainOptions.init, {}, initRules);

        const cwd = new URL(`${process.cwd()}/`, "file:");
        const roadmap = new URL("ROADMAP.md", cwd);

        const roadmapFile = file(roadmap);

        if (await roadmapFile.exists()) {
            console.log(`The ROADMAP.md was found here.`)
            return
        }

        const roadmapWriter = roadmapFile.writer();
        roadmapWriter.write(roadmapTemplate);
        await roadmapWriter.end();

        console.log(`Added ROADMAP.md file.`);

        return
    }

    throw new Error("Missing argument");
}

await run()
