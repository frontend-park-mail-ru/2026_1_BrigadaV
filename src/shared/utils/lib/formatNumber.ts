const NUMBER_FORMATTER = new Intl.NumberFormat('ru-RU');

export const formatNumber = (number: number) => {
    return NUMBER_FORMATTER.format(number);
};
