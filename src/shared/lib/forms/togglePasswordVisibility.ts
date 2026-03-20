import { Field } from "@/shared/ui";

export const togglePasswordVisibility = (instance: Field) => {
    const isPassword = instance.getType() === 'password';
    instance.setType(isPassword ? 'text' : 'password');
    instance.setIcon(isPassword ? '/icons/eye-off.svg' : '/icons/eye.svg');
}
