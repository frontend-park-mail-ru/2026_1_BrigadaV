import { FieldProps } from '@/shared/ui';

export type AuthFormProps = {
    className?: string;
    submitEventName: string;
    title: string;
    submitText: string;
    redirectText: string;
    redirectHref: string;
    fields: FieldProps[];
};
