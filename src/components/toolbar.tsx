import { useConsole } from "../context/console";
import styles from "./toolbar.module.css";
import Icons from "./icons";
import { Languages } from "../libs/constants";

export default function Toolbar() {
  const [state, dispatch] = useConsole();
  const errors = state.logs.filter((log) => log.type === "error");
  const warnings = state.logs.filter((log) => log.type === "warn");

  const handleRunCode = () => dispatch({ type: "RUN_CODE" });

  const handleClearLogs = () => dispatch({ type: "CLEAR_LOGS" });

  const handleSetLanguage = ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_LANGUAGE", payload: { language: target.value } });
  };

  return (
    <div className={styles.container}>
      <div>
        {state.isRunning && (
          <Icons.Loading
            width={14}
            height={14}
            className={`${styles.icon} ${styles.loading}`}
          />
        )}
        {!state.isRunning && (
          <button
            type="button"
            onClick={handleRunCode}
            title="Run Code (⌘Enter)"
          >
            <Icons.Run
              width={14}
              height={14}
              className={`${styles.icon} ${styles.run}`}
            />
          </button>
        )}
        <select
          className={styles.dropdown}
          value={state.language}
          onChange={handleSetLanguage}
        >
          <option value={Languages.TS}>TypeScript</option>
          <option value={Languages.JS}>JavaScript</option>
        </select>
      </div>
      <div>
        <a
          target="_blank"
          rel="noreferrer"
          title="View on GitHub"
          href="https://github.com/sonnyt/console"
        >
          <Icons.Github width={14} height={14} className={styles.icon} />
        </a>
        <Icons.Error
          width={14}
          height={14}
          className={`${styles.icon} ${styles.error}`}
        />
        {errors.length}
        <Icons.Warning
          width={14}
          height={14}
          className={`${styles.icon} ${styles.warning}`}
        />
        {warnings.length}
        <button
          type="button"
          onClick={handleClearLogs}
          title="Clear Console (⌘K)"
        >
          <Icons.Clear
            width={14}
            height={14}
            className={`${styles.icon} ${styles.clear}`}
          />
        </button>
      </div>
    </div>
  );
}
