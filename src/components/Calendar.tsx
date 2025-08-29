import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CalendarMonth } from './CalendarMonth';
import { CalendarHead } from './CalendarHead';
import { CalendarDayWeek } from './CalendarDayWeek';
/*
Calendar
*/
export const Calendar: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  let initialDayDiff = today.getDay();
  const weekFirstDate = new Date(year, month, 1);
  weekFirstDate.setDate(today.getDate() - initialDayDiff);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [focusedWeek, setFocusedWeek] = useState<Date>(weekFirstDate);

  useEffect(() => {
    let baseDate = focusedDate || today;
    let dayDiff = baseDate.getDay();
    weekFirstDate.setDate(baseDate.getDate() - dayDiff);
    setFocusedWeek(weekFirstDate);
  }, [focusedDate]);

  return (
    <View>
      <CalendarHead
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
      />
      <CalendarDayWeek />
      <CalendarMonth
        year={year}
        month={month}
        focusedDate={focusedDate}
        setFocusedDate={setFocusedDate}
        focusedWeek={focusedWeek}
      />
    </View>
  );
};
