import { useRef, useEffect, useMemo, useCallback } from "react";
import { useMonaco } from "@monaco-editor/react";

import { useConsole } from "../context/console";
import consoleStub, { promiseStub, proxyStub } from "../libs/log";
import { Languages } from "../libs/constants";

export default function Runner() {
  const monaco = useMonaco();
  const [state, dispatch] = useConsole();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const typescriptWorker = useMemo(async () => {
    const editor = state.editor;

    if (!editor || !monaco) {
      return;
    }

    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    return worker(editor.getModel()?.uri!);
  }, [state.editor, monaco]);

  const compileCode = useCallback(async () => {
    const service = await typescriptWorker;

    if (!service || !state.editor) {
      return null;
    }

    const { outputFiles } = await service.getEmitOutput(
      state.editor.getModel()?.uri.toString()!
    );
    return outputFiles[0].text;
  }, [state.editor, typescriptWorker]);

  const runCode = useCallback(
    async (code: string | null) => {
      if (!iframeRef.current?.contentWindow || !code) {
        return;
      }

      const iframeWindow = iframeRef.current.contentWindow;

      iframeWindow.location.reload();

      return new Promise((resolve) => {
        iframeRef.current!.onload = () => {
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
          (iframeWindow as any).Promise = promiseStub(
            scope,
            (iframeWindow as any).Promise
          );
          (iframeWindow as any).Proxy = proxyStub(
            scope,
            (iframeWindow as any).Proxy
          );

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
          script.text = code;
          iframeWindow.document.body.appendChild(script);

          setTimeout(resolve, 250);
        };
      });
    },
    [iframeRef, dispatch]
  );

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    if (state.language === Languages.JS) {
      runCode(state.code)!.finally(() => dispatch({ type: "RUN_COMPLETE" }));
      return;
    }

    compileCode()
      .then((code) => runCode(code))
      .finally(() => dispatch({ type: "RUN_COMPLETE" }));
  }, [
    state.isRunning,
    state.language,
    state.code,
    compileCode,
    runCode,
    dispatch,
  ]);

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
