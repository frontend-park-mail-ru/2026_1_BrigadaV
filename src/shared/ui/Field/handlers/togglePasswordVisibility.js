export const togglePasswordVisibility = (instance) => {
    const input = instance.element.querySelector('.field__input');
    const iconImg = instance.element.querySelector('.field__icon img');

    if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        if (iconImg) {
            iconImg.src = isPassword ? '/icons/eye-off.svg' : '/icons/eye.svg';
        }
    }
};
