import { IBus, BusHandler } from './index';

type Subscriptions = {
  [key: string]: BusHandler[];
};

class BusMock implements IBus {
  subscriptions: Subscriptions;

  constructor() {
    this.subscriptions = {} as Subscriptions;
  }

  public publish(message: string, data?: Object): void {
    const handlers = this.subscriptions[message];

    if (handlers) {
      handlers.forEach((h: BusHandler): void => {
        h(message, data);
      });
    }
  }

  public subscribe(message: string, trigger: BusHandler) {
    if (this?.subscriptions[message] === undefined) {
      this.subscriptions[message] = [];
    }

    this.subscriptions[message].push(trigger);
  }

  public clear() {
    this.subscriptions = {} as Subscriptions;
  }
}

export default BusMock;

export const busMock = new BusMock();
