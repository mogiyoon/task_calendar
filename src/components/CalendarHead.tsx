import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDate } from '../context/DateContext';

/*
Calendar Head
*/

export const CalendarHead: React.FC = () => {
  const { year, month, handlePrevMonth, handleNextMonth } = useDate()
  const tmpDate = new Date(year, month);
  const iconColor = '#3aa0ff';
  const iconSize = 20;

  return (
    <View style={headStyles.container}>
      <TouchableOpacity onPress={handlePrevMonth}>
        <Ionicons name="chevron-back" color={iconColor} size={iconSize} />
      </TouchableOpacity>
      <Text style={headStyles.fontStyle}>
        {tmpDate.toLocaleString('en-US', { month: 'long' })}{' '}
        {tmpDate.getFullYear()}
      </Text>
      <TouchableOpacity onPress={handleNextMonth}>
        <Ionicons name="chevron-forward" color={iconColor} size={iconSize} />
      </TouchableOpacity>
    </View>
  );
};

const headStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  fontStyle: {
    fontSize: 16,
  },
});
