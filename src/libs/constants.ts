export enum LogTypes {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
}

export enum ValueTypes {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  FUNCTION = "function",
  UNDEFINED = "undefined",
  NULL = "null",
  PROXY = "proxy",
  PROMISE = "promise",
  SYMBOL = "symbol",
  MAP = "map",
  SET = "set",
  ERROR = "error",
  DATE = "date",
  REGEXP = "regexp",
  HTML_ELEMENT = "html_element",
}

export enum NodeTypes {
  ELEMENT_NODE = Node.ELEMENT_NODE,
  ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE,
  TEXT_NODE = Node.TEXT_NODE,
  CDATA_SECTION_NODE = Node.CDATA_SECTION_NODE,
  PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE = Node.COMMENT_NODE,
  DOCUMENT_NODE = Node.DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE,
}
