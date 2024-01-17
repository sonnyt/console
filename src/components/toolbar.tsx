import { useConsole } from "../context/console";
import styles from "./toolbar.module.css";
import Icons from "./icons";

export default function Toolbar() {
  const [state, dispatch] = useConsole();
  const errors = state.logs.filter((log) => log.type === "error");
  const warnings = state.logs.filter((log) => log.type === "warn");

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
            title="Run Code (⌘Enter)"
            onClick={() => dispatch({ type: "RUN_CODE" })}
          >
            <Icons.Run
              width={14}
              height={14}
              className={`${styles.icon} ${styles.run}`}
            />
          </button>
        )}
      </div>
      <div>
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
          title="Clear Console (⌘K)"
          onClick={() => dispatch({ type: "CLEAR_LOGS" })}
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
