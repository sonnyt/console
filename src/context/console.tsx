'use client';

import { useReducer, createContext, useContext } from 'react';

import type { Type } from '@/libs/log';


export type State = {
  code: string;
  selectedCode: string | null;
  logs: { type: Type; args: any[] }[];
  isRunning: boolean;
}

export type ActionType = 'SET_CODE' | 'SET_LOGS' | 'CLEAR_LOGS' | 'RUN_CODE' | 'RUN_COMPLETE';

type Action = {
  payload: State;
  type: ActionType;
};

const ConsoleContext = createContext<[State, React.Dispatch<any>]>([{} as any, () => {}]);

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
        selectedCode: payload?.selectedCode,
      };
    case 'RUN_COMPLETE':
      return {
        ...state,
        isRunning: false,
        selectedCode: null,
      };
    default:
      return state;
  }
};

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const code = typeof window !== 'undefined' ? localStorage?.getItem('code') : '';
  const [state, dispatch] = useReducer(reducer, {
    logs: [],
    code: code ?? '',
    isRunning: false,
    selectedCode: null,
  });

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