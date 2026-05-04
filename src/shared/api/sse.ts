
import { API_URL } from './api'; 

export class SSEClient {
    private eventSource: EventSource | null = null;
    private url: string;

    constructor(ticketId: number) {
        this.url = `${API_URL}/support/tickets/${ticketId}/subscribe`;
    }

    connect(onMessage: (data: any) => void, onError?: (err: Event) => void) {
        this.disconnect();

        this.eventSource = new EventSource(this.url, { withCredentials: true });

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error('SSE parse error', e);
            }
        };

        this.eventSource.onerror = (err) => {
            console.error('SSE error', err);
            if (onError) onError(err);
        };
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}