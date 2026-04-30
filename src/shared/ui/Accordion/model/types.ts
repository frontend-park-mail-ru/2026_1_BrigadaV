export type AccordionProps = {
    title: string;
    isOpen?: boolean;
    className?: string;
    onToggle?: (isOpen: boolean) => void;
}
