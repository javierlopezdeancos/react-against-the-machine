import { IBus, BusHandler } from './index';
declare type Subscriptions = {
    [key: string]: BusHandler[];
};
declare class BusMock implements IBus {
    subscriptions: Subscriptions;
    constructor();
    publish(message: string, data?: Object): void;
    subscribe(message: string, trigger: BusHandler): void;
    clear(): void;
}
export default BusMock;
export declare const busMock: BusMock;
