import { Collapsable, PropertyList } from "./base";
import styles from "./map.module.css";
import StringLog from "./string";
import LogItem from "../log-item";

type Props = {
  log: Map<any, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function MapLog({ log, scope, isMinimized }: Props) {
  const mapArray = Array.from(log);

  if (isMinimized) {
    return <StringLog log={`Map(${log.size})`} className={styles.is_map} />;
  }

  return (
    <Collapsable className={styles.is_map}>
      <>
        Map({`${log.size}`}) {"{"}
        {mapArray.slice(0, 5).map(([key, item], index) => {
          return (
            <>
              <span className={styles.key}>{key}</span>
              {" =>"} <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < mapArray.length - 1 && ", "}
            </>
          );
        })}
        {mapArray.length > 5 && "…"}
        {"}"}
      </>
      <>
        <PropertyList
          scope={scope}
          list={mapArray}
          size={{ key: "size", value: log.size }}
        />
      </>
    </Collapsable>
  );
}
