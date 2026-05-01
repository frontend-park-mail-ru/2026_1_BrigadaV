import { UserAuth } from '@/entities/User';

export type AppState = {
    currentPath: string;
    currentUser: UserAuth | null;
}

export interface IComponent {
    render(): HTMLElement;
    finalize(): void;
    destroy(): void;
}

export interface IPage extends IComponent {}

export interface IPageConstructor {
    create(appState: AppState, parameters?: Record<string, string | number>): Promise<IPage>;
}

export type FormSubmitPayload<TInstance, TData> = {
    instance: TInstance;
    data: TData;
};
