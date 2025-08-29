import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useDate } from '../context/DateContext';
import { stripTime } from '../utils/stripTime';
/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
}

const CalendarDate: React.FC<CalendarDateProps> = ({
  detailDate,
}) => {

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

export const CalendarDateWeek: React.FC<CalendarWeekProps> = ({
  firstDay,
}) => {
  const { focusedWeek, isMonthMode } = useDate();

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

  const isThisWeek = (stripTime(firstDay).getTime() === stripTime(focusedWeek).getTime());

  useEffect(() => {
    if (isThisWeek) {
      animatedWeekHeight.value = calendarWeekHeight.value;
      animatedWeekOpacity.value = calendarWeekOpacity.value;
    } else {
      animatedWeekHeight.value = withTiming(
        isMonthMode ? calendarWeekHeight.value : 0,
        {
          duration: 1000,
        },
      );
      animatedWeekOpacity.value = withTiming(
        isMonthMode ? calendarWeekOpacity.value : 0,
        {
          duration: 800,
        },
      );
    }
  }, [isMonthMode, isThisWeek]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedWeekHeight.value,
      opacity: animatedWeekOpacity.value,
      overflow: 'hidden',
    };
  });

  return (
    <Animated.View
      style={[weekContainerStyles.container, animatedWeekContainerStyle]}
    >
      {thisWeek.map(date => (
        <CalendarDate
          key={date.getTime()}
          detailDate={date}
        />
      ))}
    </Animated.View>
  );
};

const weekContainerStyles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
