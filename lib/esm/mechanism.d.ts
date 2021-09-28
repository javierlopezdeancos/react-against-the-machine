/// <reference types="react" />
export declare type OnEnterDataResponse<D = unknown> = (data?: D) => void;
export declare type ToState<E = unknown> = {
    id: string;
    event: string;
    onEnter?: OnEnterDataResponse<E>;
};
export declare type State<E = unknown> = {
    id: string;
    isPrivate?: boolean;
    params?: string[];
    to: ToState<E>[];
    content?: JSX.Element;
    onEnter?: (params?: Map<string, string>) => void;
};
export declare type Location = {
    origin: string;
    path: string;
};
export interface IMechanism {
    clear: () => void;
    currentId: string | undefined;
    getContent: (sid: string) => JSX.Element | undefined;
    getState: (sid: string) => State | undefined;
    getStateByEvent: (te: string) => State | undefined;
    getTransition: (sid: string, tid: string) => ToState | undefined;
    getTransitionByEvent: (te: string) => ToState | undefined;
    isPrivate: (s: State) => boolean;
    removeState: (sid: string) => void;
    setContent: (sid: string, c: JSX.Element) => void;
    setState: (s: State) => void;
    setTransition: (sid: string, t: ToState) => void;
    states: State[];
}
declare class Mechanism implements IMechanism {
    private _states;
    private _currentId;
    constructor(initial?: string);
    get currentId(): string | undefined;
    set currentId(cid: string | undefined);
    get states(): State[];
    set states(ss: State[]);
    setState(s: State): void;
    removeState(sid: string): void;
    getState(sid: string): State | undefined;
    setTransition(sid: string, t: ToState): void;
    getTransition(sid: string, tid: string): ToState | undefined;
    setContent(sid: string, c: JSX.Element): void;
    getContent(sid: string): JSX.Element | undefined;
    getStateByEvent(te: string): State | undefined;
    getTransitionByEvent(te: string): ToState | undefined;
    isPrivate(s: State): boolean;
    clear(): void;
}
export default Mechanism;
export declare const mechanism: Mechanism;
