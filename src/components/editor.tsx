import { useEffect } from "react";
import {
  Editor as CodeEditor,
  useMonaco,
  type OnMount,
  type OnChange,
} from "@monaco-editor/react";

import { useConsole } from "../context/console";
import { darkTheme, options } from "../libs/editor";

export type EditorProps = {
  defaultValue?: string;
  onChange: (code?: string) => void;
};

export default function Editor({ defaultValue, onChange }: EditorProps) {
  const monaco = useMonaco();
  const [state, dispatch] = useConsole();

  useEffect(() => {
    if (!monaco) {
      return;
    }

    monaco.editor.defineTheme("onedark-pro", darkTheme as any);
    monaco.editor.setTheme("onedark-pro");

    monaco.editor.addEditorAction({
      id: "execute_code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0,
      run: () => dispatch({ type: "RUN_CODE" }),
    });

    monaco.editor.addEditorAction({
      id: "clear_console",
      label: "Clear Console",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1,
      run: () => dispatch({ type: "CLEAR_LOGS" }),
    });
  }, [monaco, dispatch]);

  const handleEditorDidMount: OnMount = (editor) => {
    editor.focus();
    dispatch({ type: "SET_EDITOR", payload: { editor } });
  };

  const handleOnChange: OnChange = (code?: string) => {
    dispatch({ type: "SET_CODE", payload: { code } });
    onChange(code);
  };

  return (
    <CodeEditor
      height="100%"
      theme="vs-dark"
      options={options}
      value={defaultValue}
      language={state.language}
      onChange={handleOnChange}
      onMount={handleEditorDidMount}
    />
  );
}
