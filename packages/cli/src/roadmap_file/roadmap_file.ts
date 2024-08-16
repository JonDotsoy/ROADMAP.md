import { type Heading, type Root, type RootContent } from "mdast";
import fs from "fs/promises";
import * as mdastUtilFromMarkdown from "mdast-util-from-markdown";
import * as mdastUtilToMarkdown from "mdast-util-to-markdown";

type LikeURL = { toString(): string };

export class RoadmapFile {
  private constructor(
    private url: LikeURL,
    private markdown: Root,
  ) {}

  async listTasks() {
    const plain = (n: RootContent): string => {
      if (n.type === "text") {
        return n.value;
      }
      if ("children" in n) {
        return n.children.map(plain).join("");
      }
      return "";
    };

    const proposalsHeader = this.markdown.children.find(
      (n) => n.type === "heading" && /proposals/i.test(plain(n)),
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
        title: plain(heading),
      };
    });
  }

  static async fromFile(location: LikeURL) {
    const locationUrl = new URL(location.toString(), "file://");
    const payload = await fs.readFile(locationUrl, "utf-8");
    const markdown = mdastUtilFromMarkdown.fromMarkdown(payload, "utf-8");
    return new RoadmapFile(locationUrl, markdown);
  }
}
