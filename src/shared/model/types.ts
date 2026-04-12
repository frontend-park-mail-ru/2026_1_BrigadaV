import { UserAuth } from '@/entities/User';

export type AppState = {
    currentPath: string;
    currentUser: UserAuth | null;
}

export interface IComponent {
    render(): HTMLElement;
    destroy?(): void;
}

export interface IPage {
    render(): HTMLElement;
    destroy(): void;
}

export interface IPageConstructor {
    create(appState: AppState, parameters?: Record<string, string | number>): Promise<IPage>;
}
