import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDateContext } from '../context/DateContext';

/*
Calendar Head
*/
export const CalendarHead: React.FC = () => {
  const { year, month, handlePrev, handleNext } = useDateContext()
  const tmpDate = new Date(year, month);
  const iconColor = '#3aa0ff';
  const iconSize = 20;

  return (
    <View style={headStyles.container}>
      <TouchableOpacity onPress={handlePrev}>
        <Ionicons name="chevron-back" color={iconColor} size={iconSize} />
      </TouchableOpacity>
      <Text style={headStyles.fontStyle}>
        {/* change date information to month and year */}
        {tmpDate.toLocaleString('en-US', { month: 'long' })}{' '}
        {tmpDate.getFullYear()}
      </Text>
      <TouchableOpacity onPress={handleNext}>
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
