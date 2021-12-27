import React from 'react';
export declare type OnEnterDataResponse<D = unknown> = (data?: D) => void;
export declare type Transition<E = unknown> = {
    id: string;
    event: string;
    onEnter?: OnEnterDataResponse<E>;
};
export declare type State<E = unknown> = {
    id: string;
    isPrivate?: boolean;
    params?: string[];
    to: Transition<E>[];
    content?: JSX.Element;
    onEnter?: (params?: Map<string, string>) => void;
};
export declare type Location = {
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
    setTransition: (sid: string, t: Transition) => void;
}
declare const MachineContext: React.Context<IMachine>;
declare class MachineProvider extends React.Component {
    state: {
        prevId: undefined;
        currentId: undefined;
        currentContent: null;
        currentPathname: undefined;
        states: State<unknown>[];
    };
    setCurrentId: (cid?: string | undefined) => void;
    hasStates: () => boolean;
    addState: (s: State) => void;
    removeState: (sid: string) => void;
    getState: (sid: string) => State | undefined;
    setTransition: (sid: string, t: Transition) => void;
    getTransition: (sid: string, tid: string) => Transition | undefined;
    setContent: (sid: string, c: JSX.Element) => void;
    getContent: (sid: string) => JSX.Element | undefined;
    getStateByEvent: (te: string) => State | undefined;
    getTransitionByEvent: (te: string) => Transition | undefined;
    isPrivate: (s: State) => boolean;
    clear: () => void;
    render(): JSX.Element;
}
declare const useMachine: () => IMachine;
export default useMachine;
export { MachineContext, MachineProvider };
