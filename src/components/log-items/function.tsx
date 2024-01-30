import { LogWrapper } from "./base";
import { parseFunction } from "../../libs/utils";
import styles from "./function.module.css";

type Props = {
  log: Function;
  isMinimized: boolean;
};

export default function FunctionLog({ log, isMinimized }: Props) {
  const func = parseFunction(log);

  return (
    <LogWrapper>
      {isMinimized ? (
        func.symbol
      ) : (
        <>
          <span className={styles.symbol}>{func.symbol}</span> {func.body}
        </>
      )}
    </LogWrapper>
  );
}
