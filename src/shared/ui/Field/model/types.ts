import { Field } from "../ui/Field";

export type FieldProps = {
    className?: string;
    id?: string
    label?: string;
    type: string;
    iconPath?: string;
    note?: string;
    attributes: Record<string, string | number>;
    onIconClick?: (instance: Field) => void;
}
