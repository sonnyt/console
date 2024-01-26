import { useRef, useEffect } from "react";

import { useConsole } from "../context/console";
import Icons from "./icons";
import styles from "./logs.module.css";
import LogItem from "./log-item";

export default function Logs() {
  const [state, dispatch] = useConsole();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [containerRef, state.logs]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "CLEAR_LOGS" });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={styles.logs}>
        {state.logs.map((log, index) => (
          <li key={`log_${index}`} className={styles[log.type]}>
            {log.type === "error" && (
              <Icons.Error className={styles.icon} width={14} height={14} />
            )}
            {log.type === "warn" && (
              <Icons.Warning className={styles.icon} width={14} height={14} />
            )}
            <LogItem scope={log.scope} logs={log.args} isMinimized={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}
