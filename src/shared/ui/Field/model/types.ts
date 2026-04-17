import { Field } from '../ui/Field';

export type FieldProps = {
    className?: string;
    id?: string
    label?: string;
    type: string;
    rightIcon?: string;
    leftIcon?: string;
    note?: string;
    attributes: Record<string, string | number | boolean>;
    onLeftIconClick?: (instance: Field) => void;
    onRightIconClick?: (instance: Field) => void;
}
