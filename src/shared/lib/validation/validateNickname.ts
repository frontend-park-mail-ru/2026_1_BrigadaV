export const validateNickname = (name: string): boolean => {
    return name.length >=3 && name.length <= 50;
};
