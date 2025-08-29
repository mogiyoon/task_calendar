import { View } from 'react-native';
import { CalendarMonth } from './CalendarMonth';
import { CalendarHead } from './CalendarHead';
import { CalendarDayWeek } from './CalendarDayWeek';
import { DateProvider } from '../context/DateContext';
import { AnimationProvider } from '../context/AnimationContext';
/*
Calendar
*/
export const Calendar: React.FC = () => {
  return (
    <AnimationProvider>
      <DateProvider>
        <View>
          <CalendarHead/>
          <CalendarDayWeek />
          <CalendarMonth/>
        </View>
      </DateProvider>
    </AnimationProvider>
  );
};
