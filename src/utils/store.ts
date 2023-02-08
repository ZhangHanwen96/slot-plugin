type Callback = (...args: any[]) => void;
export default class Pubsub {
    protected _subscriptions = {} as Record<string, Callback[]>;
  
    constructor() {}
  
    subscribe(event: string, callback: Callback) {
      if (!this._subscriptions[event]) {
        this._subscriptions[event] = [];
      }
  
      this._subscriptions[event].push(callback);
  
      return () => {
        this._subscriptions[event].splice(this._subscriptions[event].indexOf(callback), 1);
      };
    }
  
    unsubscribe(event: string, callback: Callback) {
      if (this._subscriptions[event]) {
        this._subscriptions[event].splice(this._subscriptions[event].indexOf(callback), 1);
      }
    }
  
    notify(event: string, data = {}) {
      if (this._subscriptions[event]) {
        this._subscriptions[event].forEach((callback) => callback(data));
      }
    }
  }
  