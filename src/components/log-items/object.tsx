import { Collapsable, PropertyList } from "./base";
import styles from "./object.module.css";
import StringLog from "./string";
import LogItem from "../log-item";
import { getObjectName } from "../../libs/utils";

type Props = {
  log: Record<string, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function ObjectLog({ log, scope, isMinimized }: Props) {
  let prefix: string | null = getObjectName(log);
  prefix = prefix === "Object" ? null : prefix;

  const objKeys = Object.getOwnPropertyNames(log);

  if (isMinimized) {
    return <StringLog log={prefix ?? `{…}`} className={styles.is_object} />;
  }

  return (
    <Collapsable className={styles.is_object}>
      <>
        {prefix ? `${prefix} {` : "{"}
        {objKeys.slice(0, 5).map((key, index) => {
          return (
            <>
              <span className={styles.key}>{key}</span>:{" "}
              <LogItem scope={scope} isMinimized={true} logs={[log[key]]} />
              {index < objKeys.length - 1 && ", "}
            </>
          );
        })}
        {objKeys.length > 5 && "…"}
        {"}"}
      </>
      <>
        <PropertyList
          scope={scope}
          list={objKeys.map((key) => [key, log[key]])}
        />
      </>
    </Collapsable>
  );
}
