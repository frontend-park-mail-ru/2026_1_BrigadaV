const DAY_MONTH = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
});

const FULL_DATE = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export const formatDate = (start: Date, end: Date): Record<string, string> => {
    const isSameYear = start.getFullYear() === end.getFullYear();

    return {
        start: isSameYear ? DAY_MONTH.format(start) : FULL_DATE.format(start),
        end: FULL_DATE.format(end),
        isoStart: start.toISOString().split('T')[0],
        isoEnd: end.toISOString().split('T')[0],
    };
};
