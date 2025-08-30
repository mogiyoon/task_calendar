import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { CalendarWeek } from './CalendarWeek';
import { useDateContext } from '../context/DateContext';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAnimationContext } from '../context/AnimationContext';
import { runOnJS } from 'react-native-worklets';
/*
Month Component
which involves week component
and mode change gesture
*/
interface CalendarMonthProps {
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
}) => {
  const { month, year, isMonthMode, setIsMonthMode } = useDateContext();
  const { shouldAnimateY } = useAnimationContext();
  const { width: screenWidth} = useWindowDimensions();

  //first day of month
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();

  //first day of first week
  const tmpDate = new Date(year, month, 1);
  tmpDate.setDate(firstDate.getDate() - firstDay);

  //last day of month
  const lastDate = new Date(year, month + 1, 1);
  lastDate.setDate(lastDate.getDate() - 1);
  const lastDay = lastDate.getDay();

  //first day of last week
  const finalWeekDate = new Date(year, month, 1);
  finalWeekDate.setDate(lastDate.getDate() - lastDay);

  /* 
  month array that take first day of week
  will be changed to week array in Week Component
  */
  const dateToMonth: Date[] = [];
  while (tmpDate.getTime() <= lastDate.getTime()) {
    const newTmpDate = new Date(tmpDate);
    dateToMonth.push(newTmpDate);
    tmpDate.setDate(tmpDate.getDate() + 7);
  }

  /*
  when the mode is week, user can move component left or right
  */
  const offsetX = useSharedValue(0);
  const animatedPagerStyle = useAnimatedStyle(() => {
    const xPosition = -screenWidth + offsetX.value;
    return {
      transform: [{ translateX: xPosition }],
    };
  });

  /**
   * user can change calendar mode
   * when user swipes on empty space
   */
  const panGesture = Gesture.Pan()
    .onEnd(event => {
      if (event.translationY < -50 && isMonthMode) {
        shouldAnimateY.value = true;
        runOnJS(setIsMonthMode)(false);
      } else if (event.translationY > 50 && !isMonthMode) {
        shouldAnimateY.value = true;
        runOnJS(setIsMonthMode)(true);
      }
    })

  /**
   * extend screen width for animation
   */
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
    <GestureDetector gesture={panGesture}>
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
    </GestureDetector>
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