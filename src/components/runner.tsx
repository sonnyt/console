import { useRef, useEffect } from "react";

import { useConsole } from "../context/console";
import consoleStub, { promiseStub, proxyStub } from "../libs/log";

export default function Runner() {
  const [state, dispatch] = useConsole();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !state.isRunning) {
      return;
    }

    const iframeWindow = iframeRef.current.contentWindow;

    // reload the iframe to reset the window object
    iframeWindow.location.reload();

    const scope = new WeakMap();

    // stub the iframe console
    (iframeWindow as any).console = consoleStub((type, ...args) => {
      dispatch({
        type: "SET_LOGS",
        payload: {
          logs: [{ type, args, scope }],
        },
      });
    });

    // stub the iframe Promise and Proxy
    (iframeWindow as any).Promise = promiseStub(scope, (iframeWindow as any).Promise);
    (iframeWindow as any).Proxy = proxyStub(scope, (iframeWindow as any).Proxy);

    // listen for errors in the iframe
    iframeWindow.addEventListener("error", (e: ErrorEvent) => {
      e.preventDefault();
      dispatch({
        type: "SET_LOGS",
        payload: {
          logs: [{ type: "error", args: [new Error(e.error)], scope }],
        },
      });
    });

    // create a script tag and append it to the iframe body
    const script = document.createElement("script");
    script.text = state.selectedCode ?? state.code;
    iframeWindow.document.body.appendChild(script);

    setTimeout(() => dispatch({ type: "RUN_COMPLETE" }), 250);
  }, [iframeRef, state.isRunning, state.code, state.selectedCode, dispatch]);

  return (
    <iframe
      width={0}
      height={0}
      ref={iframeRef}
      src="about:blank"
      title="code runner"
      style={{ border: 0, zIndex: "-99999", position: "absolute" }}
    />
  );
}
