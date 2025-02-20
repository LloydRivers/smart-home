export interface TimeOfDayPeriod {
  start: TimeOfDay;
  end: TimeOfDay;
}
interface TimeOfDay {
  hour: number;
  minute: number;
}

export const isWithinAnyPeriod = (periods: TimeOfDayPeriod[]) => {
  const now = new Date();
  for (const period of periods) {
    const start = new Date();
    const end = new Date();

    start.setHours(period.start.hour, period.start.minute, 0, 0);
    end.setHours(period.end.hour, period.end.minute, 0, 0);

    // If the end time is earlier than the start time, the period spans midnight
    if (end <= start) {
      if (now >= start || now <= end) {
        return true;
      }
    } else {
      if (now >= start && now <= end) {
        return true;
      }
    }
  }
  return false;
};
