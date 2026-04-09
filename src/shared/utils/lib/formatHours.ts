export type WorkingHour = {
    day: 1 | 2 | 3 | 4 | 5 | 6 | 0;
    start: string;
    end: string;
}

const DAY_MAP = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAY_MAP1 = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const formatHours = (hours: WorkingHour[]): Record<string, string>[] => {
    return hours.map((item) => ({
        dayLabel: DAY_MAP1[item.day],
        start: item.start,
        end: item.end,
    }));
}
