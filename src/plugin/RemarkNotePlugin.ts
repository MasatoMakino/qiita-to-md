import { all, H } from "mdast-util-to-hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export class RemarkNotePlugin {
  private static readonly NOTE_REGEXP = /^:::\s*note[ \t]*([a-z]*)\n/m;
  private static readonly NOTE_ENDING: string = "\n:::";

  public static plugin: Plugin = () => {
    return (tree) => {
      visit(tree, this.isNote, this.visitor);
    };
  };

  /**
   * パラグラフがnote記法に準じているか否かを判定する
   * @param node
   * @private
   */
  private static isNote(node): boolean {
    if (!RemarkNotePlugin.isTextParagraph(node)) return false;
    return RemarkNotePlugin.isNoteParagraph(node);
  }

  private static isTextParagraph(node): boolean {
    return (
      node.type == "paragraph" &&
      node.children &&
      node.children[0].type === "text" &&
      node.children.at(-1).type === "text"
    );
  }

  private static getFirstIndex(node): number {
    return node.children.findIndex((child) => {
      return child.value.match(RemarkNotePlugin.NOTE_REGEXP);
    });
  }
  private static getLastIndex(node): number {
    return node.children.findIndex((child) => {
      return child.value.endsWith(RemarkNotePlugin.NOTE_ENDING);
    });
  }

  private static isNoteParagraph(node): boolean {
    const startIndex = this.getFirstIndex(node);
    if (startIndex === -1) return false;

    const endIndex = this.getLastIndex(node);
    if (endIndex === -1) return false;

    return startIndex <= endIndex;
  }

  private static visitor(node, index, parent) {
    const responseFirstBlock = RemarkNotePlugin.processFirstChild(node);
    RemarkNotePlugin.processLastChild(
      node.children,
      RemarkNotePlugin.NOTE_ENDING,
    );

    parent.children[index] = {
      type: "note",
      properties: { className: ["note", responseFirstBlock.noteType] },
      children: node.children,
    };
  }

  /**
   * noteパラグラフの先端を削除する
   * @param node
   * @private
   */
  private static processFirstChild(node): { noteType: string; index: number } {
    const index = this.getFirstIndex(node);
    const firstChild = node.children[index];
    const firstValue = firstChild.value as string;

    const noteType = RemarkNotePlugin.getNoteType(firstValue);
    node.children[index] = {
      ...firstChild,
      value: firstValue.slice(
        RemarkNotePlugin.getNoteFirstLineLength(firstValue),
      ),
    };

    return { noteType, index };
  }

  /**
   * noteパラグラフの末端を削除する
   * @param children
   * @param identifier
   * @private
   */
  private static processLastChild(children: Array<any>, identifier: string) {
    const lastIndex = children.length - 1;
    const lastChild = children[lastIndex];
    const lastValue = lastChild.value as string;
    if (lastValue === identifier) {
      children.pop();
    } else {
      children[lastIndex] = {
        ...lastChild,
        value: lastValue.slice(0, lastValue.length - identifier.length),
      };
    }
  }

  private static getNoteType(value: string): string {
    const match = value.match(RemarkNotePlugin.NOTE_REGEXP);
    return match?.[1];
  }

  private static getNoteFirstLineLength(value: string): number {
    const match = value.match(RemarkNotePlugin.NOTE_REGEXP);
    return match?.[0].length;
  }

  /**
   * note型を指定されたmdastをhastのdivに変換する
   * @param h
   * @param node
   */
  public static rehypeNoteHandler(h: H, node: any) {
    return {
      type: "element",
      tagName: "div",
      properties: {
        className: node.properties.className,
      },
      children: all(h, node),
    };
  }
}
