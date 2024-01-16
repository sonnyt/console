import { useEffect } from 'react';
import { Editor as CodeEditor, useMonaco } from '@monaco-editor/react';

import { useConsole } from '@/context/console';
import { darkTheme, options } from '@/libs/editor';
import styles from './editor.module.css';

export default function Editor() {
  const monaco = useMonaco();
  const [state, dispatch] = useConsole();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('onedark-pro', darkTheme as any);
      monaco.editor.setTheme('onedark-pro');

      monaco.editor.addEditorAction({
        id: 'execute_code',
        label: 'Execute Code',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: () => dispatch({ type: 'RUN_CODE' })
      });
    }
  }, [monaco, dispatch]);

  return (
    <div className={styles.container}>
      <CodeEditor
        language="typescript"
        height="100vh"
        theme="vs-dark"
        options={options}
        value={state.code}
        onMount={(editor) => editor.focus()}
        onChange={(code) => dispatch({ type: 'SET_CODE', payload: { code } })}
      />
    </div>
  )
}