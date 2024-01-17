import { useEffect } from 'react';
import { Editor as CodeEditor, useMonaco } from '@monaco-editor/react';

import { useConsole } from '../context/console';
import { darkTheme, options } from '../libs/editor';
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
        contextMenuOrder: 0,
        run: (editor) => {
          const selectedCode = editor.getModel()?.getValueInRange(editor?.getSelection()!);

          if (selectedCode?.trim()) {
            dispatch({ type: 'RUN_CODE', payload: { selectedCode } });
          } else {
            dispatch({ type: 'RUN_CODE' });
          }
        }
      });

      monaco.editor.addEditorAction({
        id: 'clear_console',
        label: 'Clear Console',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1,
        run: () => dispatch({ type: 'CLEAR_LOGS' })
      });
    }
  }, [monaco, dispatch]);

  return (
    <div className={styles.container}>
      <CodeEditor
        language="javascript"
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