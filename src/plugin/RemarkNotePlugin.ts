import { all, H } from "mdast-util-to-hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export class RemarkNotePlugin {
  private static readonly NOTE_REGEXP = /^:::\s*note\s*([a-z]*)\n/m;
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
      node.children[node.children.length - 1].type === "text"
    );
  }

  private static isNoteParagraph(node): boolean {
    if (!node.children[0].value.match(RemarkNotePlugin.NOTE_REGEXP))
      return false;
    return node.children[node.children.length - 1].value.endsWith(
      RemarkNotePlugin.NOTE_ENDING
    );
  }

  private static visitor(node, index, parent) {
    const children = [...node.children];
    const noteType = RemarkNotePlugin.processFirstChild(children);
    RemarkNotePlugin.processLastChild(children, RemarkNotePlugin.NOTE_ENDING);

    parent.children[index] = {
      type: "note",
      properties: { className: ["note", noteType] },
      children,
    };
  }

  /**
   * noteパラグラフの先端を削除する
   * @param children
   * @private
   */
  private static processFirstChild(
    children: Array<any>
  ): string | null | undefined {
    const firstChild = children[0];
    const firstValue = firstChild.value as string;

    const noteType = RemarkNotePlugin.getNoteType(children);
    children[0] = {
      ...firstChild,
      value: firstValue.slice(
        RemarkNotePlugin.getNoteFirstLineLength(children)
      ),
    };

    return noteType;
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

  private static getNoteType(children: Array<any>): string | null | undefined {
    const match = children[0].value.match(RemarkNotePlugin.NOTE_REGEXP);
    return match?.[1];
  }

  private static getNoteFirstLineLength(children: Array<any>): number {
    const match = children[0].value.match(RemarkNotePlugin.NOTE_REGEXP);
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
