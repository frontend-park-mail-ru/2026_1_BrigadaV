export type Callback<T = any> = (data: T) => void;

class EventBus {
    events: Record<string, Callback<any>[]> = {};

    constructor() { }

    public on<T>(eventName: string, callback: Callback<T>): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    public off<T>(eventName: string, callback: Callback<T>): void {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(item => item !== callback);
    }

    public emit<T>(eventName: string, data?: T): void {
        this.events[eventName]?.forEach(callback => callback(data));
    }
}

export const eventBus = new EventBus();
