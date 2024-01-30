import { Collapsable } from "./base";
import StringLog from "./string";
import styles from "./error.module.css";

type Props = {
  log: Error;
  isMinimized: boolean;
};

export default function ErrorLog({ log, isMinimized }: Props) {
  if (isMinimized) {
    return <StringLog log={log.message} className={styles.is_error} />;
  }

  return (
    <Collapsable className={styles.is_error}>
      <>{log.message}</>
      <>
        <br />
        {log.stack}
      </>
    </Collapsable>
  );
}
