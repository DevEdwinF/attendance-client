import { format } from 'date-fns';

export const formatTime = (timeString: string) => {
  const referenceDate = new Date(`2000-01-01T${timeString}Z`);
  
  // Obtener la zona horaria del navegador en minutos
  const userTimezoneOffset = new Date().getTimezoneOffset();
  const timeInUserTimezone = new Date(referenceDate.getTime() + userTimezoneOffset * 60000);

  let hours = timeInUserTimezone.getHours();
  let minutes = timeInUserTimezone.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
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