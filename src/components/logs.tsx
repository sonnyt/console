'use client';

import { useRef, useEffect } from 'react';

import { Type } from '@/libs/log';
import { useConsole } from '@/context/console';
import Icons from './icons';
import styles from './logs.module.css';

const LogItem = ({ type, args }: { type: Type, args: any[] }) => {
  return (
    <li className={styles[type]}>
      {type === 'error' && <Icons.error className={styles.icon} width={14} height={14} />}
      {type === 'warn' && <Icons.warning className={styles.icon} width={14} height={14} />}
      {args.join(' ')}
    </li>
  )
};

export default function Logs() {
  const [state] = useConsole();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    };

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [containerRef, state.logs]);

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={styles.logs}>
        {state.logs.map((log, index) => (
          <LogItem key={index} type={log.type} args={log.args} />
        ))}
      </ul>
    </div>
  );
}