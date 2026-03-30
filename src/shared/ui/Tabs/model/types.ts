export type TabsProps = {
    className: string;
    tabs: Record<string, string>;
    activeId: string;
    onTabChange: (tabName: string) => void;
}
