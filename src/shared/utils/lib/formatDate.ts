const DAY_MONTH = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
});

const MONTH_YEAR = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
})

const FULL_DATE = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export const formatDateRange = (start: Date, end: Date): Record<string, string> => {
    const isSameYear = start.getFullYear() === end.getFullYear();

    return {
        start: isSameYear ? DAY_MONTH.format(start) : FULL_DATE.format(start),
        end: FULL_DATE.format(end),
        isoStart: start.toISOString(),
        isoEnd: end.toISOString(),
    };
};

export const formatDate = (date: Date): Record<string, string> => {
    return {
        date: MONTH_YEAR.format(date),
        isoDate: date.toISOString(),
    };
};
