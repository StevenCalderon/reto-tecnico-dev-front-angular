export const formatDateToYYYYMMDD = (date: Date): string => {
    const padZero = (value: number): string => {
        return value < 10 ? `0${value}` : `${value}`;
    }

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
}

