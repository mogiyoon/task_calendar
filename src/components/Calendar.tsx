import { useState } from 'react';
import { View } from 'react-native'
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
  const [isMonthMode, setMonthMode] = useState<boolean>(true);

  return (
    <View>
      <CalendarHead year={year} month={month} setYear={setYear} setMonth={setMonth} />
      <CalendarDayWeek/>
      <CalendarMonth year={year} month={month} />
    </View>
  )
}
