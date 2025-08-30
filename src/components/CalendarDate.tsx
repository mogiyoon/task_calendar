import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDate } from '../context/DateContext';

/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
}

export const CalendarDate: React.FC<CalendarDateProps> = ({ detailDate }) => {
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
