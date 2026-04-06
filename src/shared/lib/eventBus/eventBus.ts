type Callback = (data?: unknown) => void;

class EventBus {
    events: Record<string, Callback[]> = {};

    constructor() { }

    public on(eventName: string, callback: Callback): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    public off(eventName: string, callback: Callback): void {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(item => item !== callback);
    }

    public emit(eventName: string, data?: unknown): void {
        this.events[eventName]?.forEach(callback => callback(data));
    }
}

export const eventBus = new EventBus();
