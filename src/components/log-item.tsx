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
  isMinimized,
}: {
  arr: any[];
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
        {arr.map((item, index) => {
          return (
            <>
              <LogItem key={index} isMinimized={true} logs={[item]} />
              {index < arr.length - 1 && ","}
            </>
          );
        })}
        ]
      </>
      <>
        <ul>
          {arr.map((item, index) => {
            return (
              <li key={index}>
                <strong>{index}</strong>:{" "}
                <LogItem key={index} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <strong>length</strong>: <NumberLog num={arr.length} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const ObjectLog = ({
  obj,
  isMinimized,
}: {
  obj: Record<string, any>;
  isMinimized: boolean;
}) => {
  const objArr = Object.entries(obj);

  if (isMinimized) {
    return <div className={`${styles.log} ${styles.is_object}`}>{`{…}`}</div>;
  }

  return (
    <Collapsable className={styles.is_object}>
      <>
        {"{"}
        {objArr.map(([key, item], index) => {
          return (
            <>
              <span>{key}</span>:{" "}
              <LogItem key={index} isMinimized={true} logs={[item]} />
              {index < objArr.length - 1 && ", "}
            </>
          );
        })}
        {"}"}
      </>
      <>
        <ul>
          {objArr.map(([key, item], index) => {
            return (
              <li key={index}>
                <strong>{key}</strong>:{" "}
                <LogItem key={index} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
        </ul>
      </>
    </Collapsable>
  );
};

const MapLog = ({
  map,
  isMinimized,
}: {
  map: Map<any, any>;
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
        {mapArray.map(([key, item], index) => {
          return (
            <>
              <span>{key}</span> {"=>"}{" "}
              <LogItem key={index} isMinimized={true} logs={[item]} />
              {index < mapArray.length - 1 && ", "}
            </>
          );
        })}
        {"}"}
      </>
      <>
        <ul>
          {mapArray.map(([key, item], index) => {
            return (
              <li key={index}>
                <strong>{key}</strong>:{" "}
                <LogItem key={index} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <strong>size</strong>: <NumberLog num={map.size} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const SetLog = ({
  set,
  isMinimized,
}: {
  set: Set<any>;
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
        {setArray.map((item, index) => {
          return (
            <>
              <LogItem key={index} isMinimized={true} logs={[item]} />
              {index < setArray.length - 1 && ","}
            </>
          );
        })}
        {"}"}
      </>
      <>
        <ul>
          {setArray.map((item, index) => {
            return (
              <li key={index}>
                <strong>{index}</strong>:{" "}
                <LogItem key={index} isMinimized={false} logs={[item]} />
              </li>
            );
          })}
          <li>
            <strong>size</strong>: <NumberLog num={set.size} />
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
  return (
    <div className={`${styles.log} ${styles.is_function}`}>
      {isMinimized ? "ƒ" : func.toString()}
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

export default function LogItem({
  logs,
  isMinimized = true,
}: {
  logs: any[];
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

        if (typeof log === "function") {
          return (
            <FunctionLog
              func={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log?.constructor?.name === "Error") {
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
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log?.constructor?.name === "Map") {
          return (
            <MapLog
              map={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log?.constructor?.name === "Set") {
          return (
            <SetLog
              set={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (log?.constructor?.name === "Date") {
          return <DateLog key={`log_item_${index}`} date={log} />;
        }

        if (typeof log === "object") {
          return (
            <ObjectLog
              obj={log}
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
