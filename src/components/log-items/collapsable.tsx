import React, { useState } from "react";
import styles from "./collapsable.module.css";
import Icons from "../icons";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  toggle?: boolean;
};

export default function Collapsable({ toggle = false, children, ...props }: React.PropsWithChildren<Props>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const components = React.Children.toArray(children);

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
      {toggle ? (isCollapsed ? components[0] : components[1]) : (
        <>
          {components[0]}
          {!isCollapsed && components[1]}
        </>
      )}
    </div>
  );
}