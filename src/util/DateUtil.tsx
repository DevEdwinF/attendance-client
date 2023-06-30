import { format } from 'date-fns';

export const formatTime = (time: string): string => {
    if (!time) return '';
    
    const timezoneOffsetMillis = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(new Date(time).getTime() + timezoneOffsetMillis);
    const formattedTime = format(date, 'HH:mm');

    return formattedTime;
};

export const formatDate = (time: string): string => {
    if (!time) return '';
    
    const timezoneOffsetMillis = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(new Date(time).getTime() + timezoneOffsetMillis);
    const formattedDate = format(date, 'dd/MM/yyyy');

    return formattedDate;
};