import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';
import { useDate } from '../context/DateContext';
import { stripTime } from '../utils/stripTime';
import { useAnimation } from '../context/AnimationContext';
import { runOnJS } from 'react-native-worklets';
import { CalendarDate } from './CalendarDate';
/*
Week Component
*/
interface CalendarWeekProps {
  firstDay: Date;
}

export const CalendarDateWeek: React.FC<CalendarWeekProps> = ({ firstDay }) => {
  const { focusedWeek, isMonthMode } = useDate();
  const { shouldAnimateY, shouldAnimateX } = useAnimation();
  const [showComponentY, setShowComponentY] = useState(false);
  const { width: screenWidth} = useWindowDimensions();

  const thisWeek: Date[] = [];
  const tmpDate = new Date(firstDay);
  for (let i = 0; i < 7; i++) {
    thisWeek.push(new Date(tmpDate));
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const prevWeek: Date[] = [];
  const tmpPrevDate = new Date(firstDay);
  tmpPrevDate.setDate(tmpPrevDate.getDate() - 7)
  for (let i = 0; i < 7; i++) {
    prevWeek.push(new Date(tmpPrevDate));
    tmpPrevDate.setDate(tmpPrevDate.getDate() + 1);
  }

  const nextWeek: Date[] = [];
  const tmpNextDate = new Date(firstDay);
  tmpNextDate.setDate(tmpPrevDate.getDate() + 7)
  for (let i = 0; i < 7; i++) {
    nextWeek.push(new Date(tmpNextDate));
    tmpNextDate.setDate(tmpNextDate.getDate() + 1);
  }

  const isThisWeek =
    stripTime(firstDay).getTime() === stripTime(focusedWeek).getTime();

  // Y Animation
  const initialHeight = isMonthMode || isThisWeek ? 56 : 0;
  const calendarWeekHeight = useSharedValue(56);
  const animatedWeekHeight = useSharedValue(initialHeight);

  const initialOpacity = isMonthMode || isThisWeek ? 1 : 0;
  const calendarWeekOpacity = useSharedValue(1);
  const animatedWeekOpacity = useSharedValue(initialOpacity);

  // X Animation
  const offsetX = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return shouldAnimateY.value;
    },
    (animate, prevAnimate) => {
      if (animate !== prevAnimate) {
        runOnJS(setShowComponentY)(animate);
      }
    }
  );

  useEffect(() => {

    // Y Animation
    if (isThisWeek) {
      animatedWeekHeight.value = calendarWeekHeight.value;
      animatedWeekOpacity.value = calendarWeekOpacity.value;
    } else {
      if (shouldAnimateY.value) {
        animatedWeekHeight.value = withTiming(
          isMonthMode ? calendarWeekHeight.value : 0,
          {
            duration: 1000,
          },

          finished => {
            if (finished) {
              shouldAnimateY.value = false;
            }
          },
        );
        animatedWeekOpacity.value = withTiming(
          isMonthMode ? calendarWeekOpacity.value : 0,
          {
            duration: 800,
          },
        );
      } else {
        animatedWeekHeight.value = isMonthMode ? calendarWeekHeight.value : 0;
        animatedWeekOpacity.value = isMonthMode ? calendarWeekOpacity.value : 0;
      }
    }
  }, [
    isMonthMode,
    isThisWeek,
    animatedWeekHeight,
    animatedWeekOpacity,
    calendarWeekHeight,
    calendarWeekOpacity,
    shouldAnimateY,
    focusedWeek,
  ]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedWeekHeight.value,
      opacity: animatedWeekOpacity.value,
      overflow: 'hidden',
    };
  });
  
  const animatedPagerStyle = useAnimatedStyle(() => {
    const xPosition = -screenWidth + offsetX.value;
    return {
      transform: [{ translateX: isMonthMode ? 0 : xPosition }],
    };
  });

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        pagerContainer: {
          width: screenWidth * 3,
        },
        weekPage: {
          width: screenWidth,
        },
      }),
    [screenWidth]
  );

  return (
  <>
    {(isMonthMode || isThisWeek || showComponentY) && (
    <Animated.View style={animatedWeekContainerStyle} >
      <Animated.View style={[weekContainerStyles.pagerContainer, dynamicStyles.pagerContainer, animatedPagerStyle]}>
        {!isMonthMode && <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
          {prevWeek.map(date => (
            <CalendarDate key={date.getTime()} detailDate={date} />
          ))}
        </View>}
        <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
          {thisWeek.map(date => (
            <CalendarDate key={date.getTime()} detailDate={date} />
          ))}
        </View>
        {!isMonthMode && <View style={[weekContainerStyles.weekPageBase, dynamicStyles.weekPage]}>
          {nextWeek.map(date => (
            <CalendarDate key={date.getTime()} detailDate={date} />
          ))}
        </View>}
      </Animated.View>
    </Animated.View>)}
  </>
  );
};

const weekContainerStyles = StyleSheet.create({
  pagerContainer: {
    flexDirection: 'row',
  },
  weekPageBase: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
