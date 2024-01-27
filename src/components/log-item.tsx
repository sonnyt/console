import { ValueTypes } from "../libs/constants";
import ProxyLog from "./log-items/proxy";
import StringLog from "./log-items/string";
import PromiseLog from "./log-items/promise";
import FunctionLog from "./log-items/function";
import ErrorLog from "./log-items/error";
import ArrayLog from "./log-items/array";
import MapLog from "./log-items/map";
import SetLog from "./log-items/set";
import HTMLLog from "./log-items/html";
import ObjectLog from "./log-items/object";
import { getType } from "../libs/utils";

type Props = {
  logs: any[];
  scope: WeakMap<any, any>;
  isMinimized: boolean;
};

export default function LogItem({ logs, scope, isMinimized = true }: Props) {
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
          return <StringLog key={`log_item_${index}`} log="null" />;
        }

        if (type === ValueTypes.UNDEFINED) {
          return <StringLog key={`log_item_${index}`} log="undefined" />;
        }

        if (type === ValueTypes.NUMBER) {
          return <StringLog key={`log_item_${index}`} log={log} />;
        }

        if (type === ValueTypes.STRING) {
          return <StringLog key={`log_item_${index}`} log={`'${log}'`} />;
        }

        if (type === ValueTypes.BOOLEAN) {
          return <StringLog key={`log_item_${index}`} log={log} />;
        }

        if (type === ValueTypes.DATE) {
          return <StringLog key={`log_item_${index}`} log={log} />;
        }

        if (type === ValueTypes.REGEXP) {
          return <StringLog key={`log_item_${index}`} log={log} />;
        }

        if (type === ValueTypes.SYMBOL) {
          return <StringLog key={`log_item_${index}`} log={log} />;
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
          );
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

        return (
          <StringLog
            className=""
            key={`log_item_${index}`}
            log={log?.toString() ?? JSON.stringify(log)}
          />
        );
      })}
    </>
  );
}
