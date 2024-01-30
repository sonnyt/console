import { Collapsable, PropertyList } from "./base";
import StringLog from "./string";
import LogItem from "../log-item";
import styles from "./array.module.css";

type Props = {
  log: unknown[];
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function ArrayLog({ log, scope, isMinimized }: Props) {
  if (isMinimized) {
    return <StringLog log={`Array(${log.length})`} />;
  }

  return (
    <Collapsable className={styles.is_array}>
      <>
        <i>({log.length}) </i>[
        {log.slice(0, 5).map((item, index) => {
          return (
            <>
              <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < log.length - 1 && ","}
            </>
          );
        })}
        {log.length > 5 && " …"}]
      </>
      <>
        <PropertyList
          scope={scope}
          list={log.map((value, index) => [index, value])}
          size={{ key: "length", value: log.length }}
        />
      </>
    </Collapsable>
  );
}
