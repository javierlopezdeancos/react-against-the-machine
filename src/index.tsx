import React, { useEffect, useCallback, useState } from 'react';

import rl from 'erre-ele';
import { ILaGuaGua, Handler } from 'laguagua';
import { mechanism, State as MechanismState, ToState as MechanismToState, OnEnterDataResponse } from './mechanism';

interface IStateMachineProps {
  initial: string;
  bus: ILaGuaGua;
  logged: boolean;
  children: JSX.Element[];
}

export default function Machine(props: IStateMachineProps): JSX.Element {
  const { initial, bus, children, logged: userIsLogged } = props;
  const [content, setContent] = useState<JSX.Element>();

  const getStateIdFromURL = useCallback((): string => {
    const pathname = rl.getPathnameFromURL();
    const pathsSegments = pathname.split('/');
    return pathsSegments[1];
  }, []);

  const setCurrentPath = useCallback(() => {
    const stateId = getStateIdFromURL();

    if (stateId) {
      rl.pathname = '/' + stateId;
    } else {
      rl.pathname = '/';
    }
  }, [getStateIdFromURL]);

  const onHistoryChange = useCallback(() => {
    setCurrentPath();
  }, [setCurrentPath]);

  rl.setOnPopState(onHistoryChange);

  const setCurrentState = useCallback(() => {
    const initialState = mechanism.getState(initial);

    if (rl.pathname === '/' || rl.pathname === '/' + initialState?.id) {
      mechanism.currentId = initialState?.id;
    } else {
      const stateId = getStateIdFromURL();
      mechanism.currentId = stateId;
    }
  }, [initial, mechanism, getStateIdFromURL]);

  const getCurrentStateParamsFromURL = useCallback((): Map<string, string> | undefined => {
    const stateId = mechanism.currentId;

    if (!stateId) {
      return;
    }

    const state = mechanism.getState(stateId);
    const params = new Map();

    if (!state?.params) {
      return;
    }

    state?.params?.forEach((paramName: string) => {
      const paramValue = rl.getParamFromURL(paramName);

      if (paramName && paramValue) {
        params?.set(paramName, paramValue);
      }
    });

    if (params.size === 0) {
      return;
    }

    return params;
  }, [mechanism]);

  const setConfigurationToCurrentState = useCallback(() => {
    setCurrentPath();
    setCurrentState();

    const currentId = mechanism.currentId;

    if (!currentId) {
      return;
    }

    const currentState = mechanism.getState(currentId);

    if (currentState?.content) {
      setContent(currentState.content);
    }

    if (currentState?.onEnter) {
      const params = getCurrentStateParamsFromURL();
      currentState?.onEnter(params);
    }
  }, [setCurrentPath, setCurrentState, getCurrentStateParamsFromURL, mechanism]);

  const messageHandler = useCallback(
    (message: string, data?: unknown): void => {
      const transition = mechanism.getTransitionByEvent(message);
      const stateToTransitionTo = mechanism.getStateByEvent(message);

      if (stateToTransitionTo && transition) {
        const isStateToTransitionPrivate = mechanism.isPrivate(stateToTransitionTo);

        if ((isStateToTransitionPrivate && userIsLogged) || !isStateToTransitionPrivate) {
          rl.go('/' + stateToTransitionTo.id);
          mechanism.currentId = stateToTransitionTo?.id;

          if (transition?.onEnter) {
            transition.onEnter(data);
          }
        } else {
          rl.go('/');
        }
      }

      setConfigurationToCurrentState();
    },
    [mechanism, setConfigurationToCurrentState, userIsLogged]
  );

  const addStateAndTransitionToMechanism = useCallback(
    (
      stateId: string,
      isPrivate: boolean,
      params: string[],
      onEnter: (params?: Map<string, string>) => void,
      event: string,
      toStateId: string,
      toOnEnter?: (data?: unknown) => void
    ): MechanismState | undefined => {
      if (stateId && event && toStateId) {
        mechanism.setState({
          id: stateId,
          isPrivate,
          params,
          onEnter,
          to: [] as MechanismToState[],
        });

        const t = {
          id: toStateId,
          event,
          onEnter: toOnEnter,
        } as MechanismToState;

        mechanism.setTransition(stateId, t);
      }

      return;
    },
    [mechanism]
  );

  const addContentToStateInMechanism = useCallback(
    (stateId: string, content: JSX.Element) => {
      mechanism.setContent(stateId, content);
    },
    [mechanism]
  );

  const startUpMechanism = useCallback(() => {
    const stateComponents = children;
    const thereAreStatesComponents = stateComponents?.length > 0;

    if (thereAreStatesComponents) {
      // eslint-disable-next-line
      stateComponents.map((stateComponent: JSX.Element): JSX.Element | void => {
        const componentIsAStateComponent = stateComponent?.type?.name === 'State';

        if (componentIsAStateComponent) {
          stateComponent?.props?.children.forEach((stateComponentChild: JSX.Element): void | JSX.Element => {
            const componentIsATransitionComponent = stateComponentChild?.type?.name === 'Transition';

            if (componentIsATransitionComponent) {
              const transitionComponent = stateComponentChild;

              addStateAndTransitionToMechanism(
                stateComponent?.props?.id,
                stateComponent?.props?.private,
                stateComponent?.props?.params,
                stateComponent?.props?.onEnter,
                transitionComponent?.props?.event,
                transitionComponent?.props?.state,
                transitionComponent?.props?.onEnter
              );

              if (transitionComponent?.props?.event) {
                bus.subscribe(transitionComponent?.props?.event, messageHandler as Handler);
              }
            }

            const componentIsAContentComponent = stateComponentChild?.type?.name === 'Content';

            if (componentIsAContentComponent) {
              addContentToStateInMechanism(stateComponent?.props?.id, stateComponentChild.props.children);
            }
          });
        }
      });
    }

    setConfigurationToCurrentState();
  }, [
    addContentToStateInMechanism,
    addStateAndTransitionToMechanism,
    bus,
    children,
    messageHandler,
    setConfigurationToCurrentState,
  ]);

  useEffect(() => {
    bus.clear();
    startUpMechanism();
  }, [startUpMechanism, bus]);

  return <>{content ? content : null}</>;
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

export function Transition<E>(props: ITransitionProps<E>): null {
  return null;
}

interface ContentProps {
  children: JSX.Element;
}

export function Content({ children }: ContentProps): JSX.Element {
  return <>{children}</>;
}

export { mechanism } from './mechanism';

export { default as Mechanism } from './mechanism';
