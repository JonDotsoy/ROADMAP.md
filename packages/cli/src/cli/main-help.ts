import { render, componentModules } from "@jondotsoy/console-draw";
import { intld } from "../common/intl-dictionary";
const h = componentModules.createElement.bind(componentModules);

const envColumns = parseInt(process.env.COLUMNS ?? "80");
const columns = isNaN(envColumns) ? 80 : envColumns;

export const renderMainHelp = () => {
  const usage = [
    "roadmap",
    "roadmap ROADMAP.md",
    "roadmap --cwd ..",
    "roadmap init",
  ];

  const usageKeyWord = intld`Usage`;

  const commands = [
    ["init", intld`Initialize the ROADMAP.md file if not exists`],
  ];

  return render(
    h("div", [
      h(
        "columns",
        {
          columns: 2,
          gap: 1,
          columnsTemplate: [{ width: usageKeyWord.length + 1 }],
        },
        [
          h("text", `${usageKeyWord}:`),
          h(
            "div",
            usage.map((usage) => h("text", usage)),
          ),
        ],
      ),
      h("text"),
      h("text", `${intld`Commands`}:`),
      ...commands.map(([command, description]) =>
        h(
          "columns",
          {
            columns: 3,
            gap: 3,
            columnsTemplate: [{ width: 0 }, { width: 12 }],
          },
          [h("text"), h("text", command), h("div", description)],
        ),
      ),
    ]),
    { width: columns },
  );
};
