'use client';

import { Panel, PanelResizeHandle, PanelGroup } from 'react-resizable-panels';

import { ConsoleProvider } from '@/context/console';
import Editor from '@/components/editor';
import Logs from '@/components/logs';
import Toolbar from '@/components/toolbar';
import styles from './page.module.css'
import Runner from '@/components/runner';

export default function Home() {
  return (
    <ConsoleProvider>
      <PanelGroup autoSaveId="panel_size" className={styles.container} direction="horizontal">
        <Panel>
          <Editor />
        </Panel>
        <PanelResizeHandle className={styles.resize} />
        <Panel>
          <Logs />
        </Panel>
      </PanelGroup>
      <Toolbar />
      <Runner />
    </ConsoleProvider>
  )
}
