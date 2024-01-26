import { useState } from "react";

import styles from "./log-item.module.css";
import Icons from "./icons";

const Collapsable = ({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      {...props}
      className={`${styles.log} ${props.className} ${styles.collapse}`}
      onClick={onToggle}
    >
      {isCollapsed ? (
        <Icons.Right width={14} height={14} />
      ) : (
        <Icons.Down width={14} height={14} />
      )}
      {(children as any)[0]}
      {!isCollapsed && (children as any)[1]}
    </div>
  );
};

const ArrayLog = ({
  arr,
  scope,
  isMinimized,
}: {
  arr: any[];
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_array}`}>
        Array({arr.length})
      </div>
    );
  }

  return (
    <Collapsable className={styles.is_array}>
      <>
        <i>({arr.length}) </i>[
        {arr.slice(0, 5).map((item, index) => {
          return (
            <>
              <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < arr.length - 1 && ","}
            </>
          );
        })}
        {arr.length > 5 && "…"}]
      </>
      <>
        <ul>
          {arr.map((item, index) => {
            return (
              <li key={`arr_log_list_${index}`}>
                <span className={styles.index}>
                  <strong>{index}</strong>:{" "}
                </span>
                <LogItem scope={scope} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <span className={styles.index}>
              <strong>length</strong>:
            </span>{" "}
            <NumberLog num={arr.length} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const ObjectLog = ({
  obj,
  scope,
  isMinimized,
}: {
  prefix?: string;
  obj: Record<string, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  let prefix = obj[Symbol.toStringTag as any];

  if (!prefix) {
    prefix =
      obj.constructor.name === "Object" ? undefined : obj.constructor.name;
  }

  const objKeys = Object.getOwnPropertyNames(obj);

  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_object}`}>
        {prefix ?? `{…}`}
      </div>
    );
  }

  return (
    <Collapsable className={styles.is_object}>
      <>
        {prefix ? `${prefix} {` : "{"}
        {objKeys.slice(0, 5).map((key, index) => {
          return (
            <>
              <span>{key}</span>:{" "}
              <LogItem scope={scope} isMinimized={true} logs={[obj[key]]} />
              {index < objKeys.length - 1 && ", "}
            </>
          );
        })}
        {objKeys.length > 5 && "…"}
        {"}"}
      </>
      <>
        <ul>
          {objKeys.map((key, index) => {
            return (
              <li key={`obj_log_list_${index}`}>
                <span className={styles.index}>
                  <strong>{key}</strong>:{" "}
                </span>
                <LogItem scope={scope} isMinimized={false} logs={[obj[key]]} />
              </li>
            );
          })}
          {objKeys.length === 0 && (
            <li>
              <i className={styles.no_props}>No properties</i>
            </li>
          )}
        </ul>
      </>
    </Collapsable>
  );
};

const MapLog = ({
  map,
  scope,
  isMinimized,
}: {
  map: Map<any, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const mapArray = Array.from(map);

  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_map}`}>Map({map.size})</div>
    );
  }

  return (
    <Collapsable className={styles.is_map}>
      <>
        Map({`${map.size}`}) {"{"}
        {mapArray.slice(0, 5).map(([key, item], index) => {
          return (
            <>
              <span>{key}</span> {"=>"}{" "}
              <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < mapArray.length - 1 && ", "}
            </>
          );
        })}
        {mapArray.length > 5 && "…"}
        {"}"}
      </>
      <>
        <ul>
          {mapArray.map(([key, item], index) => {
            return (
              <li key={`map_log_list_${index}`}>
                <span className={styles.index}>
                  <strong>{key}</strong>:{" "}
                </span>
                <LogItem scope={scope} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <span className={styles.index}>
              <strong>size</strong>:
            </span>{" "}
            <NumberLog num={map.size} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const SetLog = ({
  set,
  scope,
  isMinimized,
}: {
  set: Set<any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const setArray = Array.from(set);

  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_set}`}>Set({set.size})</div>
    );
  }

  return (
    <Collapsable className={styles.is_set}>
      <>
        Set({`${set.size}`}) {"{"}
        {setArray.slice(0, 5).map((item, index) => {
          return (
            <>
              <LogItem scope={scope} isMinimized={true} logs={[item]} />
              {index < setArray.length - 1 && ","}
            </>
          );
        })}
        {setArray.length > 5 && "…"}
        {"}"}
      </>
      <>
        <ul>
          {setArray.map((item, index) => {
            return (
              <li key={`set_log_list_${index}`}>
                <span className={styles.index}>
                  <strong>{index}</strong>:{" "}
                </span>
                <LogItem scope={scope} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <span className={styles.index}>
              <strong>size</strong>:
            </span>{" "}
            <NumberLog num={set.size} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const NullLog = () => {
  return <div className={`${styles.log} ${styles.is_null}`}>null</div>;
};

const UndefinedLog = () => {
  return (
    <div className={`${styles.log} ${styles.is_undefined}`}>undefined</div>
  );
};

const NumberLog = ({ num }: { num: number }) => {
  return <div className={`${styles.log} ${styles.is_number}`}>{num}</div>;
};

const StringLog = ({ str }: { str: string }) => {
  return (
    <div className={`${styles.log} ${styles.is_string}`}>&apos;{str}&apos;</div>
  );
};

const RegExpLog = ({ regex }: { regex: RegExp }) => {
  return (
    <div className={`${styles.log} ${styles.is_string}`}>
      {regex.toString()}
    </div>
  );
};

const BooleanLog = ({ bool }: { bool: boolean }) => {
  return (
    <div className={`${styles.log} ${styles.is_boolean}`}>
      {bool.toString()}
    </div>
  );
};

const FunctionLog = ({
  func,
  isMinimized,
}: {
  func: Function;
  isMinimized: boolean;
}) => {
  const funcStr = func.toString();
  const isClass = funcStr.startsWith("class");
  const body = func.toString().replace(/^(function|class)\s*/g, "");
  const symbol = isClass ? "class" : "ƒ";

  return (
    <div className={`${styles.log} ${styles.is_function}`}>
      {isMinimized ? (
        symbol
      ) : (
        <>
          <span>{symbol}</span> {body}
        </>
      )}
    </div>
  );
};

const ErrorLog = ({
  err,
  isMinimized,
}: {
  err: Error;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_error}`}>{err.message}</div>
    );
  }

  return (
    <Collapsable className={styles.is_error}>
      <>{err.message}</>
      <>
        <br />
        {err.stack}
      </>
    </Collapsable>
  );
};

const DateLog = ({ date }: { date: Date }) => {
  return (
    <div className={`${styles.log} ${styles.is_date}`}>{date.toString()}</div>
  );
};

const SymbolLog = ({ symbol }: { symbol: symbol }) => {
  return (
    <div className={`${styles.log} ${styles.is_symbol}`}>
      {symbol.toString()}
    </div>
  );
};

const PromiseLog = ({
  scope,
  meta,
  isMinimized,
}: {
  scope: WeakMap<any, any>;
  meta: Record<any, any>;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return <div className={`${styles.log} ${styles.is_promise}`}>Promise</div>;
  }

  return (
    <Collapsable className={styles.is_promise}>
      <>
        Promise {"{"}
        <span>
          {"<"}
          {meta.state}
          {">"}
        </span>
        : <LogItem scope={scope} isMinimized={true} logs={[meta.value]} />
        {"}"}
      </>
      <>
        <ul>
          <li>
            <span className={styles.index_internal}>[[PromiseState]]: </span>
            <StringLog str={meta.state} />
          </li>
          <li>
            <span className={styles.index_internal}>[[PromiseResult]]: </span>
            <LogItem scope={scope} isMinimized={false} logs={[meta.value]} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const ProxyLog = ({
  scope,
  meta,
  isMinimized,
}: {
  scope: WeakMap<any, any>;
  meta: Record<any, any>;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return <div className={`${styles.log} ${styles.is_proxy}`}>Proxy</div>;
  }

  return (
    <Collapsable className={styles.is_promise}>
      <>
        Proxy {"("}
        <LogItem scope={scope} isMinimized={true} logs={[meta.target]} />
        {")"}
      </>
      <>
        <ul>
          <li>
            <span className={styles.index_internal}>[[Handler]]: </span>
            <LogItem scope={scope} isMinimized={false} logs={[meta.handler]} />
          </li>
          <li>
            <span className={styles.index_internal}>[[Target]]: </span>
            <LogItem scope={scope} isMinimized={false} logs={[meta.target]} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

export default function LogItem({
  logs,
  scope,
  isMinimized = true,
}: {
  logs: any[];
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) {
  return (
    <>
      {logs.map((log, index) => {
        if (log === null) {
          return <NullLog key={`log_item_${index}`} />;
        }

        if (log === undefined) {
          return <UndefinedLog key={`log_item_${index}`} />;
        }

        if (typeof log === "number") {
          return <NumberLog key={`log_item_${index}`} num={log} />;
        }

        if (typeof log === "string") {
          return <StringLog key={`log_item_${index}`} str={log} />;
        }

        if (typeof log === "boolean") {
          return <BooleanLog key={`log_item_${index}`} bool={log} />;
        }

        if (scope.get(log)?.isProxy) {
          return (
            <ProxyLog
              scope={scope}
              meta={scope.get(log)}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log.constructor?.name === "Promise") {
          return (
            <PromiseLog
              scope={scope}
              meta={scope.get(log)}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (typeof log === "function") {
          return (
            <FunctionLog
              func={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log.constructor?.name === "Error") {
          return (
            <ErrorLog
              err={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (Array.isArray(log)) {
          return (
            <ArrayLog
              arr={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log.constructor?.name === "Map") {
          return (
            <MapLog
              map={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log.constructor?.name === "Set") {
          return (
            <SetLog
              set={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log.constructor?.name === "Date") {
          return <DateLog key={`log_item_${index}`} date={log} />;
        }

        if (log.constructor?.name === "RegExp") {
          return <RegExpLog key={`log_item_${index}`} regex={log} />;
        }

        if (typeof log === "object") {
          return (
            <ObjectLog
              obj={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (typeof log === "symbol") {
          return <SymbolLog key={`log_item_${index}`} symbol={log} />;
        }

        return (
          <div className={styles.log} key={`log_item_${index}`}>
            {Object.prototype.hasOwnProperty.call(log, "toString")
              ? log.toString()
              : JSON.stringify(log)}
          </div>
        );
      })}
    </>
  );
}
