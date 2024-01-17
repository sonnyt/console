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

    (iframeWindow as any).console = consoleStub((type, ...args) => {
      dispatch({
        type: 'SET_LOGS',
        payload: {
          logs: [{ type, args }]
        }
      });
    });

    iframeWindow.addEventListener('error', (e) => {
      e.preventDefault();
      dispatch({
        type: 'SET_LOGS',
        payload: {
          logs: [{ type: 'error', args: [new Error(e.error)] }]
        }
      });
    });
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
    
    setTimeout(() => dispatch({ type: 'RUN_COMPLETE' }), 500);
  }, [iframeRef, state.isRunning, state.code, state.selectedCode, dispatch]);

  return (
    <iframe
      width={0}
      height={0}
      ref={iframeRef}
      src="about:blank"
      style={{ border: 0, zIndex: '-99999', position: 'absolute' }}
    />
  );
}