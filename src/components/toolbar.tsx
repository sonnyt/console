import { useConsole } from '@/context/console';

import styles from './toolbar.module.css';
import Icons from './icons';

export default function Toolbar() {
  const [state, dispatch] = useConsole();
  const errors = state.logs.filter((log) => log.type === 'error');
  const warnings = state.logs.filter((log) => log.type === 'warn');

  return (
    <div className={styles.container}>
      <div>
        {state.isRunning && <Icons.loading className={`${styles.icon} ${styles.loading}`} width={14} height={14} />}
        {!state.isRunning && (
          <button type="button" onClick={() => dispatch({ type: 'RUN_CODE' }) }>
            <Icons.run className={`${styles.icon} ${styles.run}`} width={14} height={14} />
          </button>
        )}
      </div>
      <div>
        <Icons.error className={`${styles.icon} ${styles.error}`} width={14} height={14} />
        {errors.length}
        <Icons.warning className={`${styles.icon} ${styles.warning}`} width={14} height={14} />
        {warnings.length}
      </div>
    </div>
  );
}