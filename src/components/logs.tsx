import { useRef, useEffect, useState } from 'react';

import { useConsole } from '../context/console';
import Icons from './icons';
import styles from './logs.module.css';

const ArrayLog = ({ args, mini }: { args: any[], mini: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.log_item} ${styles.is_array} ${styles.collapse}`} onClick={onToggle}>
      {mini ? `Array(${args.length})` : (
        <>
          {isCollapsed ? <Icons.right width={14} height={14} /> : <Icons.down width={14} height={14} />}
          <i>({args.length}) </i>
          [{args.map((arg, index) => {
            return (
              <>
                <LogItem key={index} mini={true} args={[arg]} />{index < args.length - 1 && ','}
              </>
            )
          })}]

          {!isCollapsed && (
            <ul>
              {args.map((arg, index) => {
                return (
                  <li key={index}>
                    <span>{index}</span>: <LogItem key={index} mini={false} args={[arg]} />
                  </li>
                )
              })}
              <li>
                <span>length</span>: <span className={styles.is_number}>{args.length}</span>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const ObjectLog = ({ args, mini }: { args: Record<string, any>, mini: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const objArr = Object.entries(args);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.log_item} ${styles.is_object} ${styles.collapse}`} onClick={onToggle}>
      {mini ? '{…}' : (
        <>
          {isCollapsed ? <Icons.right width={14} height={14} /> : <Icons.down width={14} height={14} />}{'{'}
          {objArr.map(([key, arg], index) => {
            return (
              <>
                <span>{key}</span>: <LogItem key={index} mini={true} args={[arg]} />{index < objArr.length - 1 && ', '}
              </>
            )
          })}
          {'}'}
          {!isCollapsed && (
            <ul>
              {objArr.map(([key, arg], index) => {
                return (
                  <li key={index}>
                    <span>{key}</span>: <LogItem key={index} mini={false} args={[arg]} />
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const MapLog = ({ args, mini }: { args: Map<any, any>, mini: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const mapArray = Array.from(args);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.log_item} ${styles.is_map} ${styles.collapse}`} onClick={onToggle}>
      {mini ? `Map(${args.size})` : (
        <>
          {isCollapsed ? <Icons.right width={14} height={14} /> : <Icons.down width={14} height={14} />}Map({`${args.size}`}){' '}{'{'}
          {mapArray.map(([key, arg], index) => {
            return (
              <>
                <span>{key}</span> {'=>'} <LogItem key={index} mini={true} args={[arg]} />{index < mapArray.length - 1 && ', '}
              </>
            )
          })}
          {'}'}
          {!isCollapsed && (
            <ul>
              {mapArray.map(([key, arg], index) => {
                return (
                  <li key={index}>
                    <span>{key}</span>: <LogItem key={index} mini={false} args={[arg]} />
                  </li>
                )
              })}
              <li>
                <span>size</span>: <span className={styles.is_number}>{args.size}</span>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const SetLog = ({ args, mini }: { args: Map<any, any>, mini: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const setArray = Array.from(args);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.log_item} ${styles.is_set} ${styles.collapse}`} onClick={onToggle}>
      {mini ? `Set(${args.size})` : (
        <>
          {isCollapsed ? <Icons.right width={14} height={14} /> : <Icons.down width={14} height={14} />}Set({`${args.size}`}){' '}{'{'}
          {setArray.map((arg, index) => {
            return (
              <>
                <LogItem key={index} mini={true} args={[arg]} />{index < setArray.length - 1 && ', '}
              </>
            )
          })}
          {'}'}
          {!isCollapsed && (
            <ul>
              {setArray.map((arg, index) => {
                return (
                  <li key={index}>
                    <span>{index}</span>: <LogItem key={index} mini={false} args={[arg]} />
                  </li>
                )
              })}
              <li>
                <span>size</span>: <span className={styles.is_number}>{args.size}</span>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const LogItem = ({ args, mini = true }: { args: any[], mini: boolean }) => {
  return args.map((arg, index) => {
    if (arg === null) {
      return <div className={`${styles.log_item} ${styles.is_null}`} key={index}>null</div>
    }

    if (arg === undefined) {
      return <div className={`${styles.log_item} ${styles.is_undefined}`} key={index}>undefined</div>
    }

    if (typeof arg === 'number') {
      return <div className={`${styles.log_item} ${styles.is_number}`} key={index}>{arg}</div>
    }

    if (typeof arg === 'string') {
      return <div className={`${styles.log_item} ${styles.is_string}`} key={index}>&apos;{arg}&apos;</div>
    }

    if (typeof arg === 'boolean') {
      return <div className={`${styles.log_item} ${styles.is_boolean}`} key={index}>{arg.toString()}</div>
    }

    if (typeof arg === 'function') {
      return <div className={`${styles.log_item} ${styles.is_function}`} key={index}>{mini ? 'ƒ' : arg.toString()}</div>
    }

    if (arg?.constructor?.name === 'Error') {
      return <div className={`${styles.log_item} ${styles.is_error}`} key={index}>{arg.stack}</div>
    }

    if (Array.isArray(arg)) {
      return <ArrayLog mini={mini} key={index} args={arg} />
    }

    if (arg?.constructor?.name === 'Map') {
      return <MapLog mini={mini} key={index} args={arg} />
    }

    if (arg?.constructor?.name === 'Set') {
      return <SetLog mini={mini} key={index} args={arg} />
    }

    if (arg?.constructor?.name === 'Date') {
      return <div className={`${styles.log_item} ${styles.is_date}`} key={index}>{arg.toString()}</div>
    }

    if (typeof arg === 'object') {
      return <ObjectLog mini={mini} key={index} args={arg} />
    }

    if (typeof arg === 'symbol') {
      return <div className={`${styles.log_item} ${styles.is_symbol}`} key={index}>{arg.toString()}</div>
    }

    return <div className={styles.log} key={index}>{Object.prototype.hasOwnProperty.call(arg, 'toString') ? arg.toString() : JSON.stringify(arg)}</div>
  });
};

export default function Logs() {
  const [state] = useConsole();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    };

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [containerRef, state.logs]);

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={styles.logs}>
        {state.logs.map((log, index) => (
          <li key={`log_${index}`} className={styles[log.type]}>
            {log.type === 'error' && <Icons.error className={styles.icon} width={14} height={14} />}
            {log.type === 'warn' && <Icons.warning className={styles.icon} width={14} height={14} />}
            <LogItem args={log.args} mini={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}