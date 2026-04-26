export type ToggleButtonProps<T> = {
    className?: string;
    label?: string;
    isActive: boolean;
    payload: T;
    onToggle: (isActive: boolean, payload: T) => void;
}
