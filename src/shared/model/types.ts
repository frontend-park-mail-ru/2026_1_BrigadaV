export type User = {
    id: number;
    login: string;
    nickname: string;
    avatar: string;
}

export type AppState = {
    currentPath: string;
    currentUser: User | null;
}

export interface IPage {
    render(): HTMLElement;
    destroy(): void;
}

export type PageConstructor = new (appState: AppState) => IPage;
