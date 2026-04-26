export const getRandomElements = <T>(array: T[], amount: number) => {
    if (array.length <= amount) return [...array];

    const result = [...array];

    for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * (result.length - i)) + i;
        [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result.slice(0, amount);
};
