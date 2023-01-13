import React, { PropsWithChildren, createContext, useContext } from 'react';

export type OnEnterDataResponse<D = unknown> = (data?: D) => void;

export type Transition<E = unknown> = {
  id: string;
  event: string;
  onEnter?: OnEnterDataResponse<E>;
};

export type State<E = unknown> = {
  id: string;
  isPrivate?: boolean;
  params?: Map<string, string>;
  to: Transition<E>[];
  content?: JSX.Element;
  onEnter?: (params?: Map<string, string>) => void;
};

export type Location = {
  origin: string;
  path: string;
};

export interface IMachine {
  clear: () => void;
  prevId: string | undefined;
  currentId: string | undefined;
  currentContent: JSX.Element | null;
  currentPathname: string | undefined;
  states: State[] | [];
  hasStates: () => void;
  getContent: (sid: string) => JSX.Element | undefined;
  getState: (sid: string) => State | undefined;
  getStateByEvent: (te: string) => State | undefined;
  getTransition: (sid: string, tid: string) => Transition | undefined;
  getTransitionByEvent: (te: string) => Transition | undefined;
  isPrivate: (s: State) => boolean;
  removeState: (sid: string) => void;
  setCurrentId: (sid: string) => void;
  setContent: (sid: string, c: JSX.Element) => void;
  addState: (s: State) => void;
  updateState: (s: State) => void;
  setTransition: (sid: string, t: Transition) => void;
  setStateParamValue: (stateId: string, paramName: string, paramValue: string) => void;
}

const defaultState: IMachine = {
  clear: (): void => {},
  prevId: undefined,
  currentId: undefined,
  currentContent: null,
  currentPathname: undefined,
  states: [] as State[],
  hasStates: (): void => {},
  getContent: () => undefined,
  getState: () => undefined,
  getStateByEvent: () => undefined,
  getTransition: () => undefined,
  getTransitionByEvent: () => undefined,
  isPrivate: () => false,
  removeState: (): void => {},
  setCurrentId: (): void => {},
  setContent: (): void => {},
  addState: (): void => {},
  updateState: (): void => {},
  setTransition: (): void => {},
  setStateParamValue: (): void => {},
};

const MachineContext = createContext(defaultState);

class MachineProvider extends React.Component<PropsWithChildren> {
  state = {
    prevId: undefined,
    currentId: undefined,
    currentContent: null,
    currentPathname: undefined,
    states: [] as State[],
  };

  setCurrentId = (cid?: string): void => {
    if (cid) {
      const currentContent = this.getContent(cid);
      const prevId = this.state.currentId;

      this.setState({
        ...this.state,
        currentId: cid,
        currentContent,
        prevId,
      });
    }
  };

  hasStates = (): boolean => {
    if (this?.state?.states?.length === 0) {
      return false;
    }

    return true;
  };

  addState = (s: State): void => {
    const hasStates = this.hasStates();

    if (!hasStates) {
      this.state.states.push(s);
      return;
    }

    const stateIsStored = this.getState(s.id);

    if (stateIsStored) {
      return;
    }

    this.state.states.push(s);
  };

  updateState = (s: State): void => {
    this.state.states.map((st): State => {
      if (s.id === st.id) {
        st = s;
      }

      return st;
    });
  };

  removeState = (sid: string): void => {
    const statesFiltered = this.state?.states?.filter((s) => s.id !== sid);

    this.setState({
      ...this.state,
      states: statesFiltered,
    });
  };

  getState = (sid: string): State | undefined => {
    const hasStates = this.hasStates();

    if (!hasStates) {
      return undefined;
    }

    const statesCopy = [...this.state.states];
    return statesCopy.find((s) => s.id === sid);
  };

  setTransition = (sid: string, t: Transition): void => {
    this.state.states.map((s): State => {
      if (s.id === sid) {
        s?.to?.push(t);
      }

      return s;
    });
  };

  getTransition = (sid: string, tid: string): Transition | undefined => {
    const state = this.getState(sid);

    if (state && state?.to && state?.to?.length > 0) {
      return state.to.find((t: Transition) => t.id === tid);
    }

    return;
  };

  setContent = (sid: string, c: JSX.Element) => {
    this.state.states.map((s): State => {
      if (s.id === sid && c) {
        s.content = c;
      }

      return s;
    });
  };

  getContent = (sid: string): JSX.Element | undefined => {
    const state = this.getState(sid);

    if (state && state?.content) {
      return state.content;
    }

    return;
  };

  getStateByEvent = (te: string): State | undefined => {
    let state;

    if (this.state.states && this.state.states.length > 0) {
      this.state.states.forEach((s: State): void => {
        if (s?.to && s?.to?.length > 0) {
          s.to.forEach((t: Transition): void => {
            if (t?.event === te) {
              if (t?.id) {
                state = this.getState(t.id);
              }
            }
          });
        }
      });
    }

    return state;
  };

  getTransitionByEvent = (te: string): Transition | undefined => {
    let transition;

    if (this.state.states && this.state.states.length > 0) {
      this.state.states.forEach((s: State): void => {
        if (s?.to && s?.to?.length > 0) {
          s.to.forEach((t: Transition): void => {
            if (t?.event === te) {
              transition = { ...t };
            }
          });
        }
      });
    }

    return transition;
  };

  isPrivate = (s: State): boolean => {
    return s?.isPrivate || false;
  };

  setStateParamValue = (stateId: string, paramName: string, paramValue: string): void => {
    const state = this.getState(stateId);

    if (!state) {
      return;
    }

    if (!state?.params) {
      return;
    }

    // @ts-expect-error
    state.params.forEach(function (value, key) {
      if (key === paramName && state?.params?.set) {
        state.params.set(key, paramValue);
      }
    });

    this.updateState(state);
  };

  clear = (): void => {
    this.setState({
      ...this.state,
      states: undefined,
      currentId: undefined,
      prevId: undefined,
    });
  };

  render() {
    const { children } = this.props;
    const { prevId, currentId, currentContent, currentPathname, states } = this.state;

    return (
      <MachineContext.Provider
        value={{
          prevId,
          currentId,
          currentContent,
          currentPathname,
          states,
          hasStates: this.hasStates,
          getContent: this.getContent,
          getState: this.getState,
          getStateByEvent: this.getStateByEvent,
          getTransition: this.getTransition,
          getTransitionByEvent: this.getTransitionByEvent,
          isPrivate: this.isPrivate,
          removeState: this.removeState,
          setCurrentId: this.setCurrentId,
          setContent: this.setContent,
          addState: this.addState,
          updateState: this.updateState,
          setTransition: this.setTransition,
          setStateParamValue: this.setStateParamValue,
          clear: this.clear,
        }}
      >
        {children}
      </MachineContext.Provider>
    );
  }
}

const useMachine = () => useContext(MachineContext);

export default useMachine;

export { MachineContext, MachineProvider };
