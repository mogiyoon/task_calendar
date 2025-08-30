import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { CalendarWeek } from './CalendarWeek';
import { useDate } from '../context/DateContext';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
/*
Month Component
*/
interface CalendarMonthProps {
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
}) => {
  const { month, year, isMonthMode } = useDate();
  const { width: screenWidth} = useWindowDimensions();

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

  //첫 날이 어떤 요일인지에 따라 시작일을 다르게
  const dateToMonth: Date[] = [];
  while (tmpDate.getTime() <= lastDate.getTime()) {
    const newTmpDate = new Date(tmpDate);
    dateToMonth.push(newTmpDate);
    tmpDate.setDate(tmpDate.getDate() + 7);
  }

  const offsetX = useSharedValue(0);
  const animatedPagerStyle = useAnimatedStyle(() => {
    const xPosition = -screenWidth + offsetX.value;
    return {
      transform: [{ translateX: xPosition }],
    };
  });

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        pagerContainer: {
          width: screenWidth * 3,
        },
        monthPage: {
          width: screenWidth,
        },
      }),
    [screenWidth]
  );
  
  return (
    <Animated.View style={[monthContainerStyles.pagerContainer, dynamicStyles.pagerContainer, animatedPagerStyle]}>
      { isMonthMode && <View style={[dynamicStyles.monthPage, monthContainerStyles.monthPageBase]} /> 
      }
      <View>
        {dateToMonth.map(weekFirstDay => (
          <CalendarWeek
            key={weekFirstDay.getTime()}
            firstDay={weekFirstDay}
          />
        ))}
      </View>
      { isMonthMode && <View style={[dynamicStyles.monthPage, monthContainerStyles.monthPageBase]} /> }
    </Animated.View>
  );
};

const monthContainerStyles = StyleSheet.create({
  pagerContainer: {
    flexDirection: 'row',
  },
  monthPageBase: {
    flexDirection: 'column',
  },
});