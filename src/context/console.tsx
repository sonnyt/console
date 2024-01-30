import { useReducer, createContext, useContext } from "react";
import { editor as monacoEditor, languages } from "monaco-editor";

import type { Type } from "../libs/log";
import { Languages } from "../libs/constants";

export type IStandaloneCodeEditor = monacoEditor.IStandaloneCodeEditor;
export type TypeScriptWorker = languages.typescript.TypeScriptWorker;

export type State = {
  code: string;
  isRunning: boolean;
  editor: IStandaloneCodeEditor | null;
  language: Languages.TS | Languages.JS;
  logs: { type: Type; args: any[]; scope: WeakMap<any, any> }[];
};

export type ActionType =
  | "SET_EDITOR"
  | "SET_CODE"
  | "SET_LOGS"
  | "SET_LANGUAGE"
  | "CLEAR_LOGS"
  | "RUN_CODE"
  | "RUN_COMPLETE";

type Action = {
  payload: State;
  type: ActionType;
};

const ConsoleContext = createContext<[State, React.Dispatch<any>]>([
  {} as any,
  () => {},
]);

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_EDITOR":
      return { ...state, editor: payload.editor };
    case "SET_CODE":
      const code = payload.code?.trim() || "";
      return { ...state, code };
    case "SET_LANGUAGE":
      return { ...state, language: payload.language };
    case "SET_LOGS":
      return {
        ...state,
        logs: [...state.logs, ...payload.logs],
      };
    case "CLEAR_LOGS":
      return {
        ...state,
        logs: [],
      };
    case "RUN_CODE":
      return {
        ...state,
        isRunning: true,
      };
    case "RUN_COMPLETE":
      return {
        ...state,
        isRunning: false,
      };
    default:
      return state;
  }
};

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    logs: [],
    code: "",
    editor: null,
    isRunning: false,
    language: Languages.TS,
  });

  return (
    <ConsoleContext.Provider value={[state, dispatch]}>
      {children}
    </ConsoleContext.Provider>
  );
}

export function useConsole() {
  const context = useContext(ConsoleContext);

  if (!context) {
    throw new Error("useConsole must be used within a ConsoleProvider");
  }

  return context;
}
