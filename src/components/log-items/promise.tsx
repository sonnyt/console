import { Collapsable, PropertyList } from "./base";
import StringLog from "./string";
import LogItem from "../log-item";
import styles from "./promise.module.css";

type Props = {
  log: Promise<any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function PromiseLog({ log, scope, isMinimized }: Props) {
  if (isMinimized) {
    return <StringLog log="Promise" className={styles.is_promise} />;
  }

  const meta = scope.get(log);

  return (
    <Collapsable className={styles.is_promise}>
      <>
        Promise {"{"}
        <i className={styles.state}>
          {"<"}
          {meta.state}
          {">"}
        </i>
        {meta.value && (
          <>
            : <LogItem scope={scope} isMinimized={true} logs={[meta.value]} />
          </>
        )}
        {"}"}
      </>
      <>
        <PropertyList
          scope={scope}
          list={[
            ["[[PromiseState]]", meta.state],
            ["[[PromiseResult]]", meta.value],
          ]}
        />
      </>
    </Collapsable>
  );
}
