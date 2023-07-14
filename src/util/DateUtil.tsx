import { format } from 'date-fns';

export const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
    return formattedTime;
  };
  
export const formatDate = (time: string): string => {
    if (!time) return '';
    
    const timezoneOffsetMillis = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(new Date(time).getTime() + timezoneOffsetMillis);
    const formattedDate = format(date, 'dd/MM/yyyy');

    return formattedDate;
};