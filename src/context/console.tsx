import { useReducer, createContext, useContext } from 'react';

import type { Type } from '@/libs/log';


export type State = {
  code: string;
  logs: { type: Type; args: any[] }[];
  isRunning: boolean;
}

const initialState: State = {
  logs: [],
  isRunning: false,
  code: localStorage?.getItem('code') ?? '',
};

export type ActionType = 'SET_CODE' | 'SET_LOGS' | 'CLEAR_LOGS' | 'RUN_CODE' | 'RUN_COMPLETE';

type Action = {
  payload: State;
  type: ActionType;
};

const ConsoleContext = createContext<[typeof initialState, React.Dispatch<any>]>([initialState, () => {}]);

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_CODE':
      const code = payload.code?.trim() || '';
      localStorage?.setItem('code', code);
      return { ...state, code };
    case 'SET_LOGS':
      return {
        ...state,
        logs: [...state.logs, ...payload.logs],
      };
    case 'CLEAR_LOGS':
      return {
        ...state,
        logs: [],
      };
    case 'RUN_CODE':
      return {
        ...state,
        isRunning: true,
      };
    case 'RUN_COMPLETE':
      return {
        ...state,
        isRunning: false,
      };
    default:
      return state;
  }
};

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConsoleContext.Provider value={[state, dispatch]}>
      {children}
    </ConsoleContext.Provider>
  );
}

export function useConsole() {
  const context = useContext(ConsoleContext);

  if (!context) {
    throw new Error("useConsole must be used within a ConsoleProvider");
  }

  return context;
}