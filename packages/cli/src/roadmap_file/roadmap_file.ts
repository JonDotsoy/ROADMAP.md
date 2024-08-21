import { type Heading, type Root, type RootContent } from "mdast";
import fs from "fs/promises";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import * as mdastUtilFromMarkdown from "mdast-util-from-markdown";
import * as mdastUtilToMarkdown from "mdast-util-to-markdown";

type LikeURL = { toString(): string };

/**
 * Converts a node to text content
 * @param node
 * @returns the text content of a node and its children
 */
const nodeToTextContent = (node: RootContent): string => {
  if (node.type === "text") {
    return node.value;
  }
  if ("children" in node) {
    return node.children.map(nodeToTextContent).join("");
  }
  return "";
};

type Content = {
  title: string;
  span: {
    start: number;
    end: number;
  };
  content: Content[];
};

const relationsChilds = new WeakMap<ContentElement, ContentElement[]>();
const relationsParents = new WeakMap<ContentElement, ContentElement[]>();
const relationsParent = new WeakMap<ContentElement, ContentElement>();

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
  columns: string[] = [];
  values: string[][] = [];
}

export class RoadmapFile {
  private constructor(
    private url: LikeURL,
    private markdown: Root,
  ) {}

  async indexListOfContent() {
    const elements: ContentElement[] = [];
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
        const columns: string[] = [];
        table.columns = columns;
        node.children.forEach((row, index) => {
          const values: string[] = [];
          row.children.forEach((cell) => {
            if (index === 0) {
              columns.push(nodeToTextContent(cell));
            } else {
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
        const _untilNextIndex = elements.findIndex(
          (elm, i) =>
            i > index &&
            elm instanceof SectionElement &&
            elm.level <= element.level,
        );
        const untilNextIndex =
          _untilNextIndex === -1 ? elements.length : _untilNextIndex;
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
    const roadmapSection = content.find(
      (elm) => elm instanceof SectionElement && /Roadmap/i.test(elm.title),
    );
    const activeSection = roadmapSection?.childs?.find(
      (elm) => elm instanceof SectionElement && /Active/i.test(elm.title),
    );
    const plannedSection = roadmapSection?.childs?.find(
      (elm) => elm instanceof SectionElement && /Planned/i.test(elm.title),
    );
    const activeDb = activeSection?.childs?.find(
      (elm) => elm instanceof DbTableElement,
    );
    const plannedDb = plannedSection?.childs?.find(
      (elm) => elm instanceof DbTableElement,
    );

    const decoTable = (dbTable: DbTableElement | undefined) => {
      if (dbTable) {
        let taskColumn: null | number = null;
        let statusColumn: null | number = null;
        let expectedCompletionDateColumn: null | number = null;
        let expectedReleaseDateColumn: null | number = null;

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
            title: val[taskColumn!],
            status: val[statusColumn!],
            expectedCompletionDate: val[expectedCompletionDateColumn!],
            expectedReleaseDate: val[expectedReleaseDateColumn!],
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
    const proposalsHeader = this.markdown.children.find(
      (n) => n.type === "heading" && /proposals/i.test(nodeToTextContent(n)),
    ) as Heading | undefined;
    if (!proposalsHeader) return [];

    const proposalsHeadersIndex = this.markdown.children.findIndex(
      (n) => n === proposalsHeader,
    );
    const nextHeader = this.markdown.children.findIndex(
      (n, i) =>
        i > proposalsHeadersIndex &&
        n.type === "heading" &&
        proposalsHeader?.depth === n.depth,
    );
    const listTasks = this.markdown.children.filter((n, i) => {
      if (i <= proposalsHeadersIndex) return false;
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
      return {
        title: nodeToTextContent(heading),
      };
    });
  }

  static async fromFile(location: LikeURL, inputBuffer?: Uint8Array) {
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
