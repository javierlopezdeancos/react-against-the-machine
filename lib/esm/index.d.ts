/// <reference types="react" />
import { OnEnterDataResponse } from './context';
export declare type StateMachineBusHandler = (message: string, data?: Object) => void;
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
export { MachineProvider, MachineContext } from './context';
export { default as useMachine } from './context';
