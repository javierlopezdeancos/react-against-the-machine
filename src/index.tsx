import React, { useEffect, useCallback, useMemo, useRef } from 'react';

import rl from 'erre-ele';
import useMachine, { State as MachineState, Transition as MachineTransition, OnEnterDataResponse } from './context';

export type StateMachineBusHandler = (message: string, data?: Object) => void;

export interface IStateMachineBus {
  publish: (message: string, data?: Object) => void;
  subscribe: (message: string, trigger: StateMachineBusHandler) => void;
  clear: () => void;
}

interface IStateMachineProps {
  initial: string;
  bus: IStateMachineBus;
  logged: boolean;
  children: JSX.Element[];
}

export default function Machine(props: IStateMachineProps): JSX.Element {
  const { initial, bus, children, logged } = props;

  const mounted = useRef(false);
  const machine = useMachine();

  const isPathNameHostRoot = useCallback((): boolean => {
    const pathname = rl.getPathnameFromURL();
    return pathname === '' || pathname === '/';
  }, [rl.getPathnameFromURL]);

  const isPathNameInitialState = useCallback((): boolean => {
    const pathname = rl.getPathnameFromURL();
    return pathname === '/' + initial;
  }, [rl.getPathnameFromURL, initial]);

  const getStateIdFromURL = useCallback((): string => {
    const pathname = rl.getPathnameFromURL();
    const pathsSegments = pathname.split('/');
    return pathsSegments[1];
  }, []);

  const setCurrentStateFromURL = useCallback(() => {
    const pathNameIsHostRoot = isPathNameHostRoot();
    const pathNameIsInitialState = isPathNameInitialState();
    const nextStateId = getStateIdFromURL() === '' ? initial : getStateIdFromURL();
    const currentStateId = machine.currentId;

    if (currentStateId === nextStateId && nextStateId !== undefined) {
      return;
    } else if (pathNameIsHostRoot || pathNameIsInitialState) {
      if (mounted.current === null) {
        return;
      }

      machine.setCurrentId(initial);
    } else {
      if (mounted.current === null) {
        return;
      }

      machine.setCurrentId(nextStateId);

      const nextState = machine.getState(nextStateId);

      if (nextState?.params) {
        nextState?.params.forEach(function (value, key) {
          const paramValue = rl.getParamFromURL(key);

          if (paramValue) {
            machine.setStateParamValue(nextState.id, key, paramValue);
          }
        });

        machine.updateState(nextState);
      }

      if (nextState?.onEnter) {
        nextState?.onEnter(nextState?.params);
      }
    }
  }, [
    initial,
    machine.currentId,
    machine.setCurrentId,
    machine.getState,
    getStateIdFromURL,
    isPathNameHostRoot,
    isPathNameInitialState,
  ]);

  const storeStateAndTransition = useCallback(
    (
      stateId: string,
      isPrivate: boolean,
      params: string[],
      onEnter: (params?: Map<string, string>) => void,
      event: string,
      toStateId: string,
      toOnEnter?: (data?: unknown) => void
    ): MachineState | undefined => {
      if (stateId && event && toStateId) {
        const paramsMap = new Map();

        if (params && params.length > 0) {
          params?.map((paramName: string) => {
            paramsMap.set(paramName, undefined);
          });
        }

        machine.addState({
          id: stateId,
          isPrivate,
          params: paramsMap,
          onEnter,
          to: [] as MachineTransition[],
        });

        const t = {
          id: toStateId,
          event,
          onEnter: toOnEnter,
        } as MachineTransition;

        machine.setTransition(stateId, t);
      }

      return;
    },
    [machine]
  );

  const storeStateAndContent = useCallback(
    (
      stateId: string,
      isPrivate: boolean,
      params: string[],
      onEnter: (params?: Map<string, string>) => void,
      content: JSX.Element
    ) => {
      if (stateId) {
        const paramsMap = new Map();

        if (params && params.length > 0) {
          params?.map((paramName: string) => {
            paramsMap.set(paramName, undefined);
          });
        }

        machine.addState({
          id: stateId,
          isPrivate,
          params: paramsMap,
          onEnter,
          to: [] as MachineTransition[],
        });

        machine.setContent(stateId, content);
      }
    },
    [machine]
  );

  const clearBus = useCallback(() => {
    bus.clear();
  }, [bus]);

  const runMachineOnPopBrowserHistory = useCallback(
    (browserHistoryPopEvent?) => {
      const isABrowserHistoryEventWithAValidPathname =
        browserHistoryPopEvent && browserHistoryPopEvent?.currentTarget?.document?.location?.pathname;

      if (isABrowserHistoryEventWithAValidPathname) {
        rl.pathname = browserHistoryPopEvent?.currentTarget.document?.location?.pathname;
        setCurrentStateFromURL();
        return;
      }
    },
    [setCurrentStateFromURL]
  );

  const subscribeToBrowserHistoryEvents = useCallback(() => {
    rl.setOnPopState(runMachineOnPopBrowserHistory);
  }, [rl, runMachineOnPopBrowserHistory]);

  const unSubscribeToBrowserHistoryEvents = useCallback(() => {
    rl.unSubscribeOnPopState();
  }, [rl]);

  const messageHandler = useCallback(
    (message: string, data?: unknown): void => {
      const transition = machine.getTransitionByEvent(message);
      const stateToTransition = machine.getStateByEvent(message);
      const currentStateId = getStateIdFromURL() === '' ? initial : getStateIdFromURL();
      const stateToTransitionIsTheInitialState = stateToTransition?.id === initial;

      if (stateToTransition?.id === currentStateId) {
        return;
      }

      if (stateToTransition && transition) {
        const isStateToTransitionPrivate = machine.isPrivate(stateToTransition);

        if ((isStateToTransitionPrivate && logged) || !isStateToTransitionPrivate) {
          if (stateToTransitionIsTheInitialState) {
            rl.go('/');
          } else {
            rl.go('/' + stateToTransition.id);
          }

          if (transition?.onEnter) {
            transition.onEnter(data);
          }
        } else {
          rl.go('/');
        }
      }

      setCurrentStateFromURL();
    },
    [machine, rl, logged, initial]
  );

  const storeStates = useCallback(() => {
    const stateComponents = children;

    stateComponents.map((stateComponent: JSX.Element): JSX.Element | void => {
      const componentIsAStateComponent = stateComponent?.type?.name === 'State';

      if (componentIsAStateComponent) {
        stateComponent?.props?.children.forEach((stateComponentChild: JSX.Element): void | JSX.Element => {
          const componentIsATransitionComponent = stateComponentChild?.type?.name === 'Transition';
          const componentIsAContentComponent = stateComponentChild?.type?.name === 'Content';

          if (componentIsATransitionComponent && !componentIsAContentComponent) {
            const transitionComponent = stateComponentChild;

            storeStateAndTransition(
              stateComponent?.props?.id,
              stateComponent?.props?.private,
              stateComponent?.props?.params,
              stateComponent?.props?.onEnter,
              transitionComponent?.props?.event,
              transitionComponent?.props?.state,
              transitionComponent?.props?.onEnter
            );

            if (transitionComponent?.props?.event) {
              bus.subscribe(transitionComponent?.props?.event, messageHandler as StateMachineBusHandler);
            }
          } else if (!componentIsATransitionComponent && componentIsAContentComponent) {
            storeStateAndContent(
              stateComponent?.props?.id,
              stateComponent?.props?.private,
              stateComponent?.props?.params,
              stateComponent?.props?.onEnter,
              stateComponentChild.props.children
            );
          }
        });
      }
    });
  }, [storeStateAndContent, storeStateAndTransition, bus, children, messageHandler]);

  const startMachine = useCallback(() => {
    clearBus();

    const stateComponents = children;
    const thereAreStatesComponents = stateComponents?.length > 0;

    if (thereAreStatesComponents) {
      storeStates();
      setCurrentStateFromURL();
      subscribeToBrowserHistoryEvents();
    }

    return;
  }, [children, storeStates, setCurrentStateFromURL, subscribeToBrowserHistoryEvents]);

  useEffect(() => {
    const prevCurrentId = machine.prevId;
    const currentId = machine.currentId;
    const stateToTransitionIsTheInitialLoad =
      machine.currentContent === null && prevCurrentId === undefined && currentId === undefined;

    if (stateToTransitionIsTheInitialLoad || prevCurrentId !== currentId) {
      if (stateToTransitionIsTheInitialLoad) {
        startMachine();
      }
    }

    return () => {
      unSubscribeToBrowserHistoryEvents();
    };
  }, [machine.prevId, machine.currentId, machine.currentContent, unSubscribeToBrowserHistoryEvents, startMachine]);

  const content = useMemo(() => machine.currentContent, [machine.currentContent]);

  // @ts-expect-error
  return <div ref={mounted}>{content}</div>;
}

interface IStateProps {
  id: string;
  private: boolean;
  children: JSX.Element[];
  params?: string[];
  onEnter?: (params?: Map<string, string>) => void;
}

export function State({ children }: IStateProps): JSX.Element {
  return <>{children}</>;
}

interface ITransitionProps<E> {
  event: string;
  state: string;
  onEnter?: OnEnterDataResponse<E>;
}

// @ts-expect-error
export function Transition<E>(props: ITransitionProps<E>): null {
  return null;
}

interface ContentProps {
  children: JSX.Element;
}

export function Content({ children }: ContentProps): JSX.Element {
  return <>{children}</>;
}

export { MachineProvider, MachineContext } from './context';

export { default as useMachine } from './context';
