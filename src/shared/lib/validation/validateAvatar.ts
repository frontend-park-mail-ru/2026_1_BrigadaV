const MAX_AVATAR_SIZE = 10 * 1024 * 1024;

export const validateAvatar = (avatar: File): boolean => {
    const isImage = avatar.type.startsWith('image/');
    const isUnderLimit = avatar.size <= MAX_AVATAR_SIZE;

    return isImage && isUnderLimit;
};
