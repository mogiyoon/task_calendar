import { StyleSheet } from 'react-native';
import { CalendarDateWeek } from './CalendarDateWeek';
import { runOnJS } from 'react-native-worklets';
import { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
/*
Month Component
*/
interface CalendarMonthProps {
  year: number;
  month: number;
  focusedDate: Date | null;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  focusedWeek: Date
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  year,
  month,
  focusedDate,
  setFocusedDate,
  focusedWeek
}) => {
  const [isMonthMode, setIsMonthMode] = useState(true);

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
  while(tmpDate.getTime() <= lastDate.getTime()) {
    const newTmpDate = new Date(tmpDate);
    dateToMonth.push(newTmpDate)
    tmpDate.setDate(tmpDate.getDate() + 7);
  }

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationY < -50 && isMonthMode) {
        runOnJS(setIsMonthMode)(false);
      }
      if (event.translationY > 50 && !isMonthMode) {
        runOnJS(setIsMonthMode)(true);
      }
  });

  const calendarMonthHeight = useSharedValue(1000);
  const calendarWeekHeight = useSharedValue(200);
  const animatedMonthHeight = useSharedValue(0);

  useEffect(() => {
      animatedMonthHeight.value = withTiming(
        isMonthMode ? calendarMonthHeight.value : calendarWeekHeight.value,
        {
          duration: 200,
        },
      );
  }, [isMonthMode, calendarMonthHeight.value]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedMonthHeight.value,
      overflow: 'hidden',
    };
  });

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[monthContainerStyles.container, animatedWeekContainerStyle]}>
        {dateToMonth.map((weekFirstDay) => (
          <CalendarDateWeek
            key={weekFirstDay.getTime()}
            firstDay={weekFirstDay}
            thisMonth={month}
            focusedDate={focusedDate}
            setFocusedDate={setFocusedDate}
            focusedWeek={focusedWeek}
            isMonthMode={isMonthMode}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const monthContainerStyles = StyleSheet.create({
  container: {},
});
