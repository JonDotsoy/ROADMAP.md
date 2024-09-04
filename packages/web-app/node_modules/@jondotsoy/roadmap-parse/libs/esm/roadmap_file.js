import fs from "fs/promises";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import * as mdastUtilFromMarkdown from "mdast-util-from-markdown";
import * as mdastUtilToMarkdown from "mdast-util-to-markdown";
const toRef = (str) => str.toLocaleLowerCase().replace(/\W/g, "-");
/**
 * Converts a node to text content
 * @param node
 * @returns the text content of a node and its children
 */
const nodeToTextContent = (node) => {
    if (node.type === "text") {
        return node.value;
    }
    if ("children" in node) {
        return node.children.map(nodeToTextContent).join("");
    }
    return "";
};
const relationsChilds = new WeakMap();
const relationsParents = new WeakMap();
const relationsParent = new WeakMap();
class ContentElement {
    get parent() {
        return relationsParent.get(this);
    }
    get childs() {
        return relationsChilds.get(this);
    }
}
class SectionElement extends ContentElement {
    title = "";
    level = 0;
}
class DbTableElement extends ContentElement {
    columns = [];
    values = [];
}
export class RoadmapFile {
    url;
    markdown;
    constructor(url, markdown) {
        this.url = url;
        this.markdown = markdown;
    }
    async indexListOfContent() {
        const elements = [];
        this.markdown.children.forEach((node) => {
            if (node.type === "heading") {
                const section = new SectionElement();
                elements.push(section);
                section.level = node.depth;
                section.title = nodeToTextContent(node);
            }
            if (node.type === "table") {
                const table = new DbTableElement();
                elements.push(table);
                const columns = [];
                table.columns = columns;
                node.children.forEach((row, index) => {
                    const values = [];
                    row.children.forEach((cell) => {
                        if (index === 0) {
                            columns.push(nodeToTextContent(cell));
                        }
                        else {
                            values.push(nodeToTextContent(cell));
                        }
                    });
                    if (index > 0) {
                        table.values.push(values);
                    }
                });
            }
        });
        elements.forEach((element, index, elements) => {
            if (element instanceof SectionElement) {
                const _untilNextIndex = elements.findIndex((elm, i) => i > index &&
                    elm instanceof SectionElement &&
                    elm.level <= element.level);
                const untilNextIndex = _untilNextIndex === -1 ? elements.length : _untilNextIndex;
                const childs = elements.slice(index + 1, untilNextIndex);
                relationsChilds.set(element, childs);
                childs.forEach((child) => {
                    relationsParents.set(child, [
                        ...(relationsParents.get(child) ?? []),
                        element,
                    ]);
                    relationsParent.set(child, element);
                });
            }
        });
        return elements;
    }
    async infoTasks() {
        const content = await this.indexListOfContent();
        const roadmapSection = content.find((elm) => elm instanceof SectionElement && /Roadmap/i.test(elm.title));
        const activeSection = roadmapSection?.childs?.find((elm) => elm instanceof SectionElement && /Active/i.test(elm.title));
        const plannedSection = roadmapSection?.childs?.find((elm) => elm instanceof SectionElement && /Planned/i.test(elm.title));
        const activeDb = activeSection?.childs?.find((elm) => elm instanceof DbTableElement);
        const plannedDb = plannedSection?.childs?.find((elm) => elm instanceof DbTableElement);
        const decoTable = (dbTable) => {
            if (dbTable) {
                let taskColumn = null;
                let statusColumn = null;
                let expectedCompletionDateColumn = null;
                let expectedReleaseDateColumn = null;
                dbTable.columns.forEach((column, index) => {
                    if (/Feature|Task/i.test(column)) {
                        taskColumn = index;
                    }
                    if (/Status/i.test(column)) {
                        statusColumn = index;
                    }
                    if (/Expected Completion Date/i.test(column)) {
                        expectedCompletionDateColumn = index;
                    }
                    if (/Expected Release Date/i.test(column)) {
                        expectedReleaseDateColumn = index;
                    }
                });
                if (taskColumn !== null) {
                    return dbTable.values.map((val) => ({
                        ref: toRef(val[taskColumn]),
                        title: val[taskColumn],
                        status: val[statusColumn],
                        expectedCompletionDate: val[expectedCompletionDateColumn],
                        expectedReleaseDate: val[expectedReleaseDateColumn],
                    }));
                }
            }
            return [];
        };
        return [
            ...decoTable(plannedDb),
            ...decoTable(activeDb).map((e) => {
                e.status = "Done";
                return e;
            }),
        ];
    }
    async listTasks() {
        const infoTasks = await this.infoTasks();
        const proposalsHeader = this.markdown.children.find((n) => n.type === "heading" && /proposals/i.test(nodeToTextContent(n)));
        if (!proposalsHeader)
            return [];
        const proposalsHeadersIndex = this.markdown.children.findIndex((n) => n === proposalsHeader);
        const nextHeader = this.markdown.children.findIndex((n, i) => i > proposalsHeadersIndex &&
            n.type === "heading" &&
            proposalsHeader?.depth === n.depth);
        const listTasks = this.markdown.children.filter((n, i) => {
            if (i <= proposalsHeadersIndex)
                return false;
            if (nextHeader !== -1) {
                if (i >= nextHeader) {
                    return false;
                }
            }
            if (n.type === "heading" && n.depth === proposalsHeader.depth + 1) {
                return true;
            }
            return false;
        });
        return listTasks.map((heading) => {
            const title = nodeToTextContent(heading);
            const ref = toRef(title);
            return {
                title: title,
                ...infoTasks.find((t) => t.ref === ref),
            };
        });
    }
    static async fromFile(location, inputBuffer) {
        const locationUrl = new URL(location.toString(), "file://");
        const payloadBuffer = inputBuffer ?? (await fs.readFile(locationUrl));
        const payload = new TextDecoder().decode(payloadBuffer);
        const markdown = mdastUtilFromMarkdown.fromMarkdown(payload, "utf-8", {
            extensions: [gfmTable()],
            mdastExtensions: [gfmTableFromMarkdown()],
        });
        return new RoadmapFile(locationUrl, markdown);
    }
}
//# sourceMappingURL=roadmap_file.js.map