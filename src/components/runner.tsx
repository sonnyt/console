import { useRef, useEffect } from 'react';

import { useConsole } from '../context/console';
import consoleStub from '../libs/log';

export default function Runner() {
  const [state, dispatch] = useConsole();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) {
      return;
    };

    const iframeWindow = iframeRef.current.contentWindow;

    const originalConsole = (iframeWindow as any).console;

    (iframeWindow as any).console = consoleStub((type, ...args) => {
      dispatch({
        type: 'SET_LOGS',
        payload: {
          logs: [{ type, args }]
        }
      });
    });

    function errorHandle(e: ErrorEvent) {
      e.preventDefault();
      dispatch({
        type: 'SET_LOGS',
        payload: {
          logs: [{ type: 'error', args: [new Error(e.error)] }]
        }
      });
    };

    iframeWindow.addEventListener('error', errorHandle);

    return () => {
      (iframeWindow as any).console = originalConsole;
      iframeWindow.removeEventListener('error', errorHandle);
    };
  }, [iframeRef, dispatch]);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !state.isRunning) {
      return;
    };

    const iframeWindow = iframeRef.current.contentWindow;

    const script = document.createElement('script');
    script.text = state.selectedCode ?? state.code;
    iframeWindow.document.body.innerHTML = '';
    iframeWindow.document.body.appendChild(script);
    
    const timeOut = setTimeout(() => dispatch({ type: 'RUN_COMPLETE' }), 500);

    return () => {
      clearTimeout(timeOut);
      iframeWindow.document.body.innerHTML = '';
    };
  }, [iframeRef, state.isRunning, state.code, state.selectedCode, dispatch]);

  return (
    <iframe
      width={0}
      height={0}
      ref={iframeRef}
      src="about:blank"
      title="code runner"
      style={{ border: 0, zIndex: '-99999', position: 'absolute' }}
    />
  );
}