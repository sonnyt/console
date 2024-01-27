import { LogWrapper } from "./base";
import { getType } from "../../libs/utils";
import styles from "./string.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  log: any;
};

export default function StringLog({ log, ...props }: Props) {
  const type = getType(log);

  return (
    <LogWrapper {...props} className={props.className ?? styles[type] ?? ""}>
      {log.toString()}
    </LogWrapper>
  );
}
