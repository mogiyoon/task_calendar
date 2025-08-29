import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
  focusedDate: Date | null;
  thisMonth: number;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const CalendarDate: React.FC<CalendarDateProps> = ({
  detailDate,
  focusedDate,
  thisMonth,
  setFocusedDate,
}) => {
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
          detailDate.getMonth() === thisMonth
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
  thisMonth: number;
  focusedDate: Date | null;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  focusedWeek: Date;
  isMonthMode: boolean;
}

export const CalendarDateWeek: React.FC<CalendarWeekProps> = ({
  firstDay,
  thisMonth,
  focusedDate,
  setFocusedDate,
  focusedWeek,
  isMonthMode,
}) => {
  const thisWeek: Date[] = [];
  const tmpDate = new Date(firstDay);
  for (let i = 0; i < 7; i++) {
    thisWeek.push(new Date(tmpDate));
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const calendarWeekHeight = useSharedValue(26);
  const animatedWeekHeight = useSharedValue(26);
  const isThisWeek = firstDay.getTime() === focusedWeek.getTime()

  useEffect(() => {
    if (isThisWeek) {
      animatedWeekHeight.value = calendarWeekHeight.value;
    } 
    else {
      animatedWeekHeight.value = withTiming(
        isMonthMode ? calendarWeekHeight.value : 0,
        {
          duration: 1000,
        },
      );
    }
  }, [isMonthMode, calendarWeekHeight.value, isThisWeek]);

  const animatedWeekContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedWeekHeight.value,
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
            focusedDate={focusedDate}
            thisMonth={thisMonth}
            setFocusedDate={setFocusedDate}
          />
        ))}
      </Animated.View>
  );
};

const weekContainerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
