import { LoginFields } from '@/pages/LoginPage/model/types';
import { SignUpFields } from '@/pages/SignupPage/model/types';
import { ValidationRule } from '@/shared/model';
import { FieldProps } from '@/shared/ui';

export type AuthFormProps<T extends LoginFields | SignUpFields> = {
    className?: string;
    submitEventName: string;
    title: string;
    submitText: string;
    redirectText: string;
    redirectHref: string;
    fields: FieldProps[];
    validationRules?: ValidationRule<T>[];
};
