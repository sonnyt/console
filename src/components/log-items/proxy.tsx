import { Collapsable, PropertyList } from "./base";
import LogItem from "../log-item";
import StringLog from "./string";
import styles from "./proxy.module.css";

type Props = {
  log: Record<any, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function ProxyLog({ log, scope, isMinimized }: Props) {
  if (isMinimized) {
    return <StringLog log="Proxy" className={styles.is_proxy} />;
  }

  const meta = scope.get(log);

  return (
    <Collapsable className={styles.is_proxy}>
      <>
        Proxy {"("}
        <LogItem scope={scope} isMinimized={true} logs={[meta.target]} />
        {")"}
      </>
      <>
        <PropertyList
          scope={scope}
          list={[
            ["[[ProxyHandler]]", meta.handler],
            ["[[ProxyTarget]]", meta.target],
          ]}
        />
      </>
    </Collapsable>
  );
}
