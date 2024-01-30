import React, { useState } from "react";
import Icons from "../icons";
import styles from "./base.module.css";
import LogItem from "../log-item";
import StringLog from "./string";

type LogWrapperProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

export function LogWrapper({ children, className, ...props }: LogWrapperProps) {
  return (
    <div {...props} className={`${styles.log} ${className ?? ""}`}>
      {children}
    </div>
  );
}

type CollapsableProps = React.HTMLAttributes<HTMLDivElement> & {
  toggle?: boolean;
};

export function Collapsable({
  toggle = false,
  children,
  ...props
}: React.PropsWithChildren<CollapsableProps>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const components = React.Children.toArray(children);

  return (
    <LogWrapper
      {...props}
      onClick={onToggle}
      className={`${props.className} ${styles.collapse}`}
    >
      {isCollapsed ? (
        <Icons.Right className={styles.icon} width={14} height={14} />
      ) : (
        <Icons.Down className={styles.icon} width={14} height={14} />
      )}
      {toggle ? (
        isCollapsed ? (
          components[0]
        ) : (
          components[1]
        )
      ) : (
        <>
          {components[0]}
          {!isCollapsed && components[1]}
        </>
      )}
    </LogWrapper>
  );
}

type PropertyListProps = {
  scope: WeakMap<any, any>;
  list: [string | number, any][];
  size?: {
    key: string;
    value: number;
  };
};

export function PropertyList({ scope, list, size }: PropertyListProps) {
  return (
    <ul className={styles.properties}>
      {list.map(([key, value], index) => {
        return (
          <li key={`property_list_${key}_${index}`}>
            <strong className={styles.key}>{key}:</strong>{" "}
            <LogItem scope={scope} isMinimized={false} logs={[value]} />
          </li>
        );
      })}

      {size && (
        <li className={styles.length}>
          <strong className={styles.key}>{size.key}:</strong>{" "}
          <StringLog log={size.value} />
        </li>
      )}

      {list.length === 0 && !size && (
        <li>
          <i className={styles.no_props}>No properties</i>
        </li>
      )}
    </ul>
  );
}
