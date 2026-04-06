import { User } from '@/entities/User';

export type AppState = {
    currentPath: string;
    currentUser: User | null;
}

export interface IComponent {
    render(): HTMLElement;
    destroy?(): void;
}

export interface IPage {
    render(): HTMLElement;
    destroy(): void;
}

export type PageConstructor = new (appState: AppState) => IPage;
