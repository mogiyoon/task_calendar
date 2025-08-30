import { StyleSheet, Text, View } from 'react-native';

/*
Calendar Day
Just render day
*/
interface CalendarDayProps {
  day: string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({day}) => {
  let textColor: string = '#6d6d6d';
  if (day === 'Sun') {
    textColor = '#ff0000'
  } else if (day === 'Sat') {
    textColor = '#00b3ff'
  }

  return (
    <View style={dayStyles.container}>
      <Text style={[dayStyles.text, {color: textColor}]}>
        {day}
      </Text>
    </View>
  )
}

const dayStyles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  }
})

/*
Calendar Day Week
*/
export const CalendarDayWeek: React.FC = () => {
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={dayWeekStyles.container}>
      {dayList.map((day) => (
        <CalendarDay key={day} day={day} />
      ))}
    </View>
  )
}

const dayWeekStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8
  },
})
