import { View } from 'react-native';
import { CalendarDateWeek } from './CalendarWeek';
import { runOnJS } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDate } from '../context/DateContext';
import { useAnimation } from '../context/AnimationContext';
/*
Month Component
*/
interface CalendarMonthProps {
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
}) => {
  const { month, year, isMonthMode, setIsMonthMode } = useDate();
  const { shouldAnimateY } = useAnimation();

  //첫 번째 날짜
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();

  //첫 번째 주의 첫쨰 날
  const tmpDate = new Date(year, month, 1);
  tmpDate.setDate(firstDate.getDate() - firstDay);

  //마지막 날짜
  const lastDate = new Date(year, month + 1, 1);
  lastDate.setDate(lastDate.getDate() - 1);
  const lastDay = lastDate.getDay();

  //마지막 주의 첫쨰 날
  const finalWeekDate = new Date(year, month, 1);
  finalWeekDate.setDate(lastDate.getDate() - lastDay);

  const dateToMonth: Date[] = [];

  //첫 날이 어떤 요일인지에 따라 시작일을 다르게
  while (tmpDate.getTime() <= lastDate.getTime()) {
    const newTmpDate = new Date(tmpDate);
    dateToMonth.push(newTmpDate);
    tmpDate.setDate(tmpDate.getDate() + 7);
  }

  const swipeGesture = Gesture.Pan().onEnd(event => {
    if (event.translationY < -50 && isMonthMode) {
      shouldAnimateY.value = true;
      runOnJS(setIsMonthMode)(false);
    }
    if (event.translationY > 50 && !isMonthMode) {
      shouldAnimateY.value = true;
      runOnJS(setIsMonthMode)(true);
    }
  });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View>
        {dateToMonth.map(weekFirstDay => (
          <CalendarDateWeek
            key={weekFirstDay.getTime()}
            firstDay={weekFirstDay}
          />
        ))}
      </View>
    </GestureDetector>
  );
};
