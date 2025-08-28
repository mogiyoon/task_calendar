import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/*
Calendar Head
*/
interface CalendarHeadProps {
  year: number;
  setYear:  React.Dispatch<React.SetStateAction<number>>
  month: number;
  setMonth:  React.Dispatch<React.SetStateAction<number>>
}

export const CalendarHead: React.FC<CalendarHeadProps> = ({year, month, setYear, setMonth}) => {
  const tmpDate = new Date(year, month);
  const iconColor = '#3aa0ff';
  const iconSize = 20;

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear((state) => state - 1);
      setMonth(11);
    } else {
      setMonth((state) => state - 1);
    }
  }
  const handleNextMonth = () => {
    if (month === 11) {
      setYear((state) => state + 1);
      setMonth(0);
    } else {
      setMonth((state) => state + 1);
    }
  }

  return (
    <View style={headStyles.container}>
      <TouchableOpacity onPress={handlePrevMonth}>
        <Ionicons name="chevron-back" color={iconColor} size={iconSize}/>
      </TouchableOpacity>
      <Text style={headStyles.fontStyle}>
        {tmpDate.toLocaleString('en-US', { month: 'long' })} {tmpDate.getFullYear()}
      </Text>
      <TouchableOpacity onPress={handleNextMonth}>
        <Ionicons name="chevron-forward" color={iconColor} size={iconSize}/>
      </TouchableOpacity>
    </View>
  )
}

const headStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  fontStyle: {
    fontSize: 16
  },
})
