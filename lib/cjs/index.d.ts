/// <reference types="react" />
import { OnEnterDataResponse } from './mechanism';
export declare type BusHandler = (message: string, data?: Object) => void;
export interface IBus {
    publish: (message: string, data?: Object) => void;
    subscribe: (message: string, trigger: BusHandler) => void;
    clear: () => void;
}
interface IStateMachineProps {
    initial: string;
    bus: IBus;
    logged: boolean;
    children: JSX.Element[];
}
export default function Machine(props: IStateMachineProps): JSX.Element;
interface IStateProps {
    id: string;
    private: boolean;
    children: JSX.Element[];
    params?: string[];
    onEnter?: (params?: Map<string, string>) => void;
}
export declare function State({ children }: IStateProps): JSX.Element;
interface ITransitionProps<E> {
    event: string;
    state: string;
    onEnter?: OnEnterDataResponse<E>;
}
export declare function Transition<E>(props: ITransitionProps<E>): null;
interface ContentProps {
    children: JSX.Element;
}
export declare function Content({ children }: ContentProps): JSX.Element;
export { mechanism } from './mechanism';
export { default as Mechanism } from './mechanism';
