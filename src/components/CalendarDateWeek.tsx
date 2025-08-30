import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useDate } from '../context/DateContext';
import { stripTime } from '../utils/stripTime';
import { useAnimation } from '../context/AnimationContext';
import { runOnJS } from 'react-native-worklets';
/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
}

const CalendarDate: React.FC<CalendarDateProps> = ({ detailDate }) => {
  const { month, focusedDate, setFocusedDate } = useDate();

  return (
    <TouchableOpacity
      onPress={() => setFocusedDate(detailDate)}
      style={[
        dateContainerStyles.container,
        detailDate.getTime() === focusedDate?.getTime() &&
          dateContainerStyles.focusedContainer,
      ]}
    >
      <Text
        style={
          detailDate.getMonth() === month
            ? dateTextStyles.sameMonthText
            : dateTextStyles.diffMonthText
        }
      >
        {detailDate.getDate()}
      </Text>
    </TouchableOpacity>
  );
};

const dateContainerStyles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#63a7ff',
  },
});

const dateTextStyles = StyleSheet.create({
  sameMonthText: {
    color: '#000000',
  },
  diffMonthText: {
    color: '#b6b6b6',
  },
});

/*
Week Component
*/
interface CalendarWeekProps {
  firstDay: Date;
}

export const CalendarDateWeek: React.FC<CalendarWeekProps> = ({ firstDay }) => {
  const { focusedWeek, isMonthMode } = useDate();
  const { shouldAnimate } = useAnimation();
  const [showComponent, setShowComponent] = useState(false); // <-- New state variable

  const thisWeek: Date[] = [];
  const tmpDate = new Date(firstDay);
  for (let i = 0; i < 7; i++) {
    thisWeek.push(new Date(tmpDate));
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const calendarWeekHeight = useSharedValue(56);
  const animatedWeekHeight = useSharedValue(56);
  const calendarWeekOpacity = useSharedValue(1);
  const animatedWeekOpacity = useSharedValue(1);

  const isThisWeek =
    stripTime(firstDay).getTime() === stripTime(focusedWeek).getTime();

  useAnimatedReaction(
    () => {
      return shouldAnimate.value;
    },
    (animate, prevAnimate) => {
      if (animate !== prevAnimate) {
        runOnJS(setShowComponent)(animate);
      }
    }
  );

  useEffect(() => {
    if (isThisWeek) {
      animatedWeekHeight.value = calendarWeekHeight.value;
      animatedWeekOpacity.value = calendarWeekOpacity.value;
    } else {
      if (shouldAnimate.value) {
        animatedWeekHeight.value = withTiming(
          isMonthMode ? calendarWeekHeight.value : 0,
          {
            duration: 1000,
          },

          finished => {
            if (finished) {
              shouldAnimate.value = false;
            }
          },
        );
        animatedWeekOpacity.value = withTiming(
          isMonthMode ? calendarWeekOpacity.value : 0,
          {
            duration: 800,
          },
        );
      }
    }
  }, [
    isMonthMode,
    isThisWeek,
    animatedWeekHeight,
    animatedWeekOpacity,
    calendarWeekHeight,
    calendarWeekOpacity,
    shouldAnimate,
  ]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedWeekHeight.value,
      opacity: animatedWeekOpacity.value,
      overflow: 'hidden',
    };
  });

  return (
  <>
    {(isMonthMode || isThisWeek || showComponent) && <Animated.View
      style={[weekContainerStyles.container, animatedWeekContainerStyle]}
    >
      {thisWeek.map(date => (
        <CalendarDate key={date.getTime()} detailDate={date} />
      ))}
    </Animated.View>}
  </>
  );
};

const weekContainerStyles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
