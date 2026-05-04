import { Field } from '../ui/Field';

export type FieldProps = {
    className?: string;
    id?: string
    label?: string;
    type: string;
    rightIcon?: string;
    leftIcon?: string;
    note?: string;
    attributes?: Record<string, string | number>;
    onLeftIconClick?: (instance: Field) => void;
    onRightIconClick?: (instance: Field) => void;

    onFocus?: (inputValue: string, event?: Event) => void;
    onBlur?: (inputValue: string, event?: Event) => void;
    onInput?: (inputValue: string, event?: InputEvent) => void;
}
