import { FieldProps } from '@/shared/ui';

import { AuthForm } from '../ui/AuthForm';

export type AuthFormProps = {
    className?: string;
    title: string;
    submitText: string;
    redirectText: string;
    redirectHref: string;
    fields: FieldProps[];
    onSubmit: (instance: AuthForm, formData: FormData) => Promise<void>;
};
