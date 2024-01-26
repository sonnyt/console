import { NodeTypes, ValueTypes } from "./constants";

export function getType(val: any)  {
  switch (true) {
    case val === null:
      return ValueTypes.NULL;
    case val === undefined:
      return ValueTypes.UNDEFINED;
    case typeof val === "string":
      return ValueTypes.STRING;
    case typeof val === "number":
      return ValueTypes.NUMBER;
    case typeof val === "boolean":
      return ValueTypes.BOOLEAN;
    case typeof val === "function":
      return ValueTypes.FUNCTION;
    case Array.isArray(val):
      return ValueTypes.ARRAY;
    case val?.constructor?.name === "Proxy":
      return ValueTypes.PROXY;
    case val?.constructor?.name === "Promise":
      return ValueTypes.PROMISE;
    case val?.constructor?.name === "Symbol":
      return ValueTypes.SYMBOL;
    case val?.constructor?.name === "Map":
      return ValueTypes.MAP;
    case val?.constructor?.name === "Set":
      return ValueTypes.SET;
    case val?.constructor?.name === "Error":
      return ValueTypes.ERROR;
    case val?.constructor?.name === "Date":
      return ValueTypes.DATE;
    case val?.constructor?.name === "RegExp":
      return ValueTypes.REGEXP;
    case Object.values(NodeTypes).includes(val?.nodeType):
      return ValueTypes.HTML_ELEMENT;
    default:
      return ValueTypes.OBJECT;
  }
}

export function parseFunction(func: Function) {
  const funcStr = func.toString();
  const body = funcStr.replace(/^(function|class)\s*/g, "");
  const symbol = funcStr.startsWith("class") ? "class" : "ƒ";

  return { body, symbol };
}

export function getObjectName(obj: Record<string, any>): string {
  if (obj[Symbol.toStringTag as any]) {
    return obj[Symbol.toStringTag as any];
  }

  return obj.constructor.name;
}
