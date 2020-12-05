export interface DOMAPI {
  tagName: (elm: Element) => string;
  setTextContent: (node: Node, text: string | null) => void;
  getTextContent: (node: Node) => string | null;
  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;
  parentNode: (node: Node) => Node | null;
  nextSibling: (node: Node) => Node | null;
  createElement: (tagName: any) => HTMLElement;
  createTextNode: (text: string) => Text;
  createComment: (text: string) => Comment;
}

function tagName(elm: Element): string {
  return elm.tagName;
}

function setTextContent(node: Node, text: string | null): void {
  node.textContent = text;
}

function getTextContent(node: Node): string | null {
  return node.textContent;
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

function isText(node: Node): node is Text {
  return node.nodeType === 3;
}

function isComment(node: Node): node is Comment {
  return node.nodeType === 8;
}

function parentNode(node: Node): Node | null {
  return node.parentNode;
}

function nextSibling(node: Node): Node | null {
  return node.nextSibling;
}

function createElement(tagName: any): HTMLElement {
  return document.createElement(tagName);
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function createComment(text: string): Comment {
  return document.createComment(text);
}

export const domapi: DOMAPI = {
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment,
  parentNode,
  nextSibling,
  createElement,
  createTextNode,
  createComment,
};
