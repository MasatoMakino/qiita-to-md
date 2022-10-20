import { H } from "mdast-util-to-hast";
import MetadataScraper from "metadata-scraper";
import { Plugin } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";

export class RemarkLinkCardPlugin {
  public static readonly TYPE = "LinkCard";
  private static readonly LINK_REGEXP =
    /^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+$/g;

  public static plugin: Plugin = () => {
    return async (tree) => {
      const promises: any[] = [];

      const visitor = (node, index, parent) => {
        const children = [...node.children];

        promises.push(async () => {
          const url = children[0].value;
          const meta = await MetadataScraper(url);

          parent.children[index] = {
            type: RemarkLinkCardPlugin.TYPE,
            properties: {
              className: [],
              title: meta.title,
              image: meta.image,
              urlOrigin: new URL(meta.url).origin,
            },
            children,
          };
        });
      };

      visit(tree, this.isLink, visitor);
      await Promise.all(promises.map((t) => t()));
    };
  };

  private static isLink(node: Node): boolean {
    if (!RemarkLinkCardPlugin.isTextParagraph(node)) return false;
    return RemarkLinkCardPlugin.isLinkCardParagraph(node);
  }

  private static isTextParagraph(node: any): boolean {
    return (
      node.type == "paragraph" &&
      node.children &&
      node.children[0].type === "text" &&
      node.children.length === 1
    );
  }

  private static isLinkCardParagraph(node: any): boolean {
    return node.children[0].value.match(RemarkLinkCardPlugin.LINK_REGEXP);
  }

  /**
   * rehypeハンドラー
   * @param h
   * @param node
   */
  public static rehypeHandler(h: H, node: any): HastElement {
    const url = node.children[0].value;

    const children = [
      RemarkLinkCardPlugin.generateInfoContainer(
        node.properties.title,
        node.properties.urlOrigin
      ),
    ];
    const image = RemarkLinkCardPlugin.generateImageContainer(
      node.properties.image
    );
    if (image) {
      children.push(image);
    }

    return {
      type: "element",
      tagName: "a",
      properties: {
        className: ["rlc-container"],
        href: url,
      },
      children,
    };
  }

  private static generateInfoContainer(
    title: string,
    url: string
  ): HastElement {
    return {
      type: "element",
      tagName: "div",
      properties: {
        className: ["rlc-info"],
      },
      children: [
        {
          type: "element",
          tagName: "div",
          properties: {
            className: ["rlc-title"],
          },
          children: [
            {
              type: "text",
              value: title,
            },
          ],
        },
        {
          type: "element",
          tagName: "div",
          properties: {
            className: ["rlc-url-container"],
          },
          children: [
            {
              type: "text",
              value: url,
            },
          ],
        },
      ],
    };
  }

  private static generateImageContainer(imageURL?: string): HastElement {
    if (imageURL == null) return null;

    return {
      type: "element",
      tagName: "div",
      properties: {
        className: ["rlc-image-container"],
      },
      children: [
        {
          type: "element",
          tagName: "img",
          properties: {
            className: ["rlc-image"],
            src: imageURL,
          },
          children: [],
        },
      ],
    };
  }
}

interface HastElement {
  type: string;
  tagName: string;
  properties?: { className?: string[]; href?: string; src?: string };
  value?: string;
  children: Array<HastElement | HastTextElement | string>;
}

interface HastTextElement {
  type: "text";
  value: string;
}
