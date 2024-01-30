import { useEffect, useState } from "react";
import { Panel, PanelResizeHandle, PanelGroup } from "react-resizable-panels";
import { compress, decompress } from "lz-string";

import { ConsoleProvider } from "./context/console";
import Editor, { type EditorProps } from "./components/editor";
import Logs from "./components/logs";
import Toolbar from "./components/toolbar";
import Runner from "./components/runner";
import styles from "./app.module.css";

export type ConsoleProps = EditorProps & {};

export const Console = (props: ConsoleProps) => {
  return (
    <ConsoleProvider>
      <div className={styles.container}>
        <PanelGroup direction="horizontal" autoSaveId="panel_size">
          <Panel>
            <Editor {...props} />
          </Panel>
          <PanelResizeHandle className={styles.resize} />
          <Panel>
            <Logs />
          </Panel>
        </PanelGroup>
      </div>
      <Toolbar />
      <Runner />
    </ConsoleProvider>
  );
};

export default function App() {
  const [code, setCode] = useState("");

  const handleOnChange = (code?: string) => {
    setCode(code || "");
    const compressed = compress(code || "");
    localStorage.setItem("console:code", compressed);
  };

  useEffect(() => {
    const compressed = localStorage.getItem("console:code");
    if (compressed) {
      const code = decompress(compressed);
      setCode(code || "");
    }
  }, []);

  return <Console defaultValue={code} onChange={handleOnChange} />;
}
