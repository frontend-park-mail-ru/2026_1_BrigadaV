export type CategorySummary = {
    id: number;
    name: string;
    description: string;
};

export type Category = {
    id: number;
    name: string;
    description: string;
    applicableTypes: string[];
};
