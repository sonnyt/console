import { Collapsable, PropertyList } from "./base";
import styles from "./set.module.css";
import StringLog from "./string";
import LogItem from "../log-item";

type Props = {
  log: Set<any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function SetLog({ log, scope, isMinimized }: Props) {
  const setArray = Array.from(log);

  if (isMinimized) {
    return <StringLog log={`Set(${log.size})`} className={styles.is_set} />;
  }

  return (
    <Collapsable className={styles.is_set}>
      <>
        Set({`${log.size}`}) {"{"}
        {setArray.slice(0, 5).map((item, index) => {
          return (
            <>
              <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < setArray.length - 1 && ","}
            </>
          );
        })}
        {setArray.length > 5 && " …"}
        {"}"}
      </>
      <>
        <PropertyList
          scope={scope}
          list={setArray.map((value, index) => [index, value])}
          size={{ key: "size", value: log.size }}
        />
      </>
    </Collapsable>
  );
}
