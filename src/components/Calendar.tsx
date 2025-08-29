import { View } from 'react-native';
import { CalendarMonth } from './CalendarMonth';
import { CalendarHead } from './CalendarHead';
import { CalendarDayWeek } from './CalendarDayWeek';
import { DateProvider } from '../context/DateContext';
/*
Calendar
*/
export const Calendar: React.FC = () => {
  return (
    <DateProvider>
      <View>
        <CalendarHead/>
        <CalendarDayWeek />
        <CalendarMonth/>
      </View>
    </DateProvider>
  );
};
