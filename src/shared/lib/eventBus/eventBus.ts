// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback<T = any> = (data: T) => Promise<void> | void;

class EventBus {
    events: Record<string, Callback[]> = {};

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

    public async emit<T>(eventName: string, data?: T): Promise<void> {
        if (!this.events[eventName]) return;

        await Promise.all(
            this.events[eventName].map(callback => callback(data))
        );
    }
}

export const eventBus = new EventBus();
