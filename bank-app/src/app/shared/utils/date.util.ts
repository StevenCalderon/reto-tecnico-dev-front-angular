export const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export const formatDateToYYYYMMDD = (date: Date): string => {
    const padZero = (value: number): string => {
        return value < 10 ? `0${value}` : `${value}`;
    }

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
}
