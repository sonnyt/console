import React, { useState } from "react";

import styles from "./log-item.module.css";
import Icons from "./icons";
import { getObjectName, getType, parseFunction } from "../libs/utils";
import { NodeTypes, ValueTypes } from "../libs/constants";

const StringLog = ({ log, ...props }: React.HTMLAttributes<HTMLDivElement> & { log: any }) => {
  return (
    <div {...props} className={`${styles.log} ${props.className ?? ''}`}>{log.toString()}</div>
  );
};

const ArrayLog = ({
  log,
  scope,
  isMinimized,
}: {
  log: unknown[];
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_array}`}>
        Array({log.length})
      </div>
    );
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
        {log.length > 5 && "…"}]
      </>
      <>
        <ul>
          {log.map((item, index) => {
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
            <StringLog className={styles.is_number} log={log.length} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const ObjectLog = ({
  log,
  scope,
  isMinimized,
}: {
  log: Record<string, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  let prefix: string | null = getObjectName(log);
  prefix = prefix === "Object" ? null : prefix;

  const objKeys = Object.getOwnPropertyNames(log);

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
              <LogItem scope={scope} isMinimized={true} logs={[log[key]]} />
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
                <LogItem scope={scope} isMinimized={false} logs={[log[key]]} />
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
  log,
  scope,
  isMinimized,
}: {
  log: Map<any, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const mapArray = Array.from(log);

  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_map}`}>Map({log.size})</div>
    );
  }

  return (
    <Collapsable className={styles.is_map}>
      <>
        Map({`${log.size}`}) {"{"}
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
            <StringLog className={styles.is_number} log={log.size} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const SetLog = ({
  log,
  scope,
  isMinimized,
}: {
  log: Set<any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const setArray = Array.from(log);

  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_set}`}>Set({log.size})</div>
    );
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
            <StringLog className={styles.is_number} log={log.size} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const FunctionLog = ({
  log,
  isMinimized,
}: {
  log: Function;
  isMinimized: boolean;
}) => {
  const func = parseFunction(log);

  return (
    <div className={`${styles.log} ${styles.is_function}`}>
      {isMinimized ? func.symbol : (
        <>
          <span>{func.symbol}</span> {func.body}
        </>
      )}
    </div>
  );
};

const ErrorLog = ({
  log,
  isMinimized,
}: {
  log: Error;
  isMinimized: boolean;
}) => {
  if (isMinimized) {
    return (
      <div className={`${styles.log} ${styles.is_error}`}>{log.message}</div>
    );
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
};

const PromiseLog = ({
  log,
  scope,
  isMinimized,
}: {
  log: Promise<any>,
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const meta = scope.get(log);

  if (isMinimized) {
    return <div className={`${styles.log} ${styles.is_promise}`}>Promise</div>;
  }

  return (
    <Collapsable className={styles.is_promise}>
      <>
        Promise {"{"}
        <span>{"<"}{meta.state}{">"}</span>:{" "}
        <LogItem scope={scope} isMinimized={true} logs={[meta.value]} />
        {"}"}
      </>
      <>
        <ul>
          <li>
            <span className={styles.index_internal}>[[PromiseState]]:</span>{" "}
            <StringLog log={`'${meta.state}'`} className={styles.is_string} />
          </li>
          <li>
            <span className={styles.index_internal}>[[PromiseResult]]:</span>{" "}
            <LogItem scope={scope} isMinimized={false} logs={[meta.value]} />
          </li>
        </ul>
      </>
    </Collapsable>
  );
};

const ProxyLog = ({
  log,
  scope,
  isMinimized,
}: {
  log: Record<any, any>;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  const meta = scope.get(log);

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

const HTMLTag = ({ elm, scope, children }: React.PropsWithChildren<{elm: Element, scope: WeakMap<any, any> }>) => {
  return (
    <>
      {'<'}
        {elm.tagName.toLowerCase()}
        {Array.from(elm.attributes).map((attr, index) => 
          <LogItem scope={scope} key={`html_attr_${index}`} isMinimized={false} logs={[attr]} />
        )}
      {'>'}
      {children}
      {`</${elm.tagName.toLowerCase()}>`}
    </>
  )
};

const HTMLLog = ({
  log,
  scope,
  isMinimized,
}: {
  log:  Element | Attr | Text | Comment | ProcessingInstruction | Document | DocumentFragment;
  scope: WeakMap<any, any>;
  isMinimized: boolean;
}) => {
  if (log.nodeType === NodeTypes.DOCUMENT_NODE) {
    const doc = log as Document;
    const href = doc.location?.href ?? 'about:blank';

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>document</span>
        </div>
      );
    }

    return (
      <Collapsable className={`${styles.log} ${styles.is_html}`}>
        <>
          <StringLog log={`#document (${href})`} />
        </>
        <>
        <ul>
            {Array.from(doc.childNodes).map((child, index) => (
              <li key={`html_doc_child_${index}`}>
                <LogItem scope={scope} isMinimized={false} logs={[child]} />
              </li>
            ))}
          </ul>
        </>
      </Collapsable>
    )
  }

  const node = log.cloneNode(true);

  if (node.nodeType === NodeTypes.DOCUMENT_FRAGMENT_NODE) {
    const fragment = log as DocumentFragment;

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>document-fragment</span>
        </div>
      );
    }

    return (
      <Collapsable className={`${styles.log} ${styles.is_html}`}>
        <>
          <StringLog log="#document-fragment" />
        </>
        <>
        <ul>
            {Array.from(fragment.childNodes).map((child, index) => (
              <li key={`html_doc-fragment_child_${index}`}>
                <LogItem scope={scope} isMinimized={false} logs={[child]} />
              </li>
            ))}
          </ul>
        </>
      </Collapsable>
    )
  }
  
  if (node.nodeType === NodeTypes.TEXT_NODE) {
    const text = node as Text;

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>text</span>
        </div>
      );
    }

    return <StringLog className={`${styles.is_html} ${styles.is_text}`} log={`"${text.wholeText}"`} />;
  }

  if (node.nodeType === NodeTypes.ATTRIBUTE_NODE) {
    const attr = node as Attr;

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>{attr.name}</span>
        </div>
      );
    }
    
    return (
      <div className={`${styles.log} ${styles.is_html} ${styles.is_attribute}`}>
        <span>{attr.name}</span>="<span>{attr.value}</span>"
      </div>
    );
  }

  if (node.nodeType === NodeTypes.ELEMENT_NODE) {
    const elm = node as Element;

    if (isMinimized) {
      const tagName = elm.tagName.toLowerCase();
      const classNames = elm.classList.value.replaceAll(' ', '.');

      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>{tagName}</span>
          <span>{elm.id && `#${elm.id}`}</span>
          <span>{elm.classList.length > 0 && `.${classNames}`}</span>
        </div>
      );
    }

    if (elm.childNodes.length === 0) {
      return (
        <div className={`${styles.log} ${styles.is_html} ${styles.is_element}`}>
          <HTMLTag elm={elm} scope={scope} />
        </div>
      )
    }

    return (
      <Collapsable className={`${styles.is_html} ${styles.is_element}`} toggle={true}>
        <>
          <HTMLTag elm={elm} scope={scope}>{"{…}"}</HTMLTag>
        </>
        <>
          {'<'}{elm.tagName.toLowerCase()}
              {Array.from(elm.attributes).map((attr, index) => 
                <LogItem scope={scope} key={`html_attr_${index}`} isMinimized={false} logs={[attr]} />
              )}
          {'>'}
          <ul>
            {Array.from(elm.childNodes).map((child, index) => (
              <li key={`html_elm_child_${index}`}>
                <LogItem scope={scope} isMinimized={false} logs={[child]} />
              </li>
            ))}
            <li>
              {`</${elm.tagName.toLowerCase()}>`}
            </li>
          </ul>
        </>
      </Collapsable>
    );
  }

  if (node.nodeType === NodeTypes.COMMENT_NODE) {
    const comment = node as Comment;

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>comment</span>
        </div>
      );
    }

    return (
      <div className={`${styles.log} ${styles.is_html} ${styles.is_comment}`}>
        {'<!--'}{comment.data}{'-->'}
      </div>
    );
  }

  if (node.nodeType === NodeTypes.PROCESSING_INSTRUCTION_NODE) {
    const text = node as ProcessingInstruction;

    if (isMinimized) {
      return (
        <div className={`${styles.log} ${styles.is_element} ${styles.is_minimized}`}>
          <span>{text.target}</span>
        </div>
      );
    }

    return <StringLog className={styles.is_html} log={text.target} />;
  }

  return (
    <div className={`${styles.log} ${styles.is_html}`}>
      {/* {log.outerHTML} */}
    </div>
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
        const type = scope.get(log)?.isProxy ? ValueTypes.PROXY : getType(log);

        if (type === ValueTypes.PROXY) {
          return (
            <ProxyLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.NULL) {
          return <StringLog key={`log_item_${index}`} className={styles.is_null} log="null" />;
        }

        if (type === ValueTypes.UNDEFINED) {
          return <StringLog key={`log_item_${index}`} className={styles.is_undefined} log="undefined" />;
        }

        if (type === ValueTypes.NUMBER) {
          return <StringLog key={`log_item_${index}`} className={styles.is_number} log={log} />;
        }

        if (type === ValueTypes.STRING) {
          return <StringLog key={`log_item_${index}`} className={styles.is_string} log={`'${log}'`} />;
        }

        if (type === ValueTypes.BOOLEAN) {
          return <StringLog key={`log_item_${index}`} className={styles.is_boolean} log={log} />;
        }

        if (type === ValueTypes.DATE) {
          return <StringLog key={`log_item_${index}`} log={log} />;
        }

        if (type === ValueTypes.REGEXP) {
          return <StringLog key={`log_item_${index}`} className={styles.is_string} log={log} />;
        }

        if (type === ValueTypes.SYMBOL) {
          return <StringLog key={`log_item_${index}`} className={styles.is_symbol} log={log} />;
        }

        if (type === ValueTypes.PROMISE) {
          return (
            <PromiseLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.FUNCTION) {
          return (
            <FunctionLog
              log={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.ERROR) {
          return (
            <ErrorLog
              log={log}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.ARRAY) {
          return (
            <ArrayLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.MAP) {
          return (
            <MapLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.SET) {
          return (
            <SetLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        if (type === ValueTypes.HTML_ELEMENT) {
          return (
            <HTMLLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          )
        }

        if (type === ValueTypes.OBJECT) {
          return (
            <ObjectLog
              log={log}
              scope={scope}
              isMinimized={isMinimized}
              key={`log_item_${index}`}
            />
          );
        }

        return <StringLog key={`log_item_${index}`} log={log?.toString() ?? JSON.stringify(log)} />;
      })}
    </>
  );
}
