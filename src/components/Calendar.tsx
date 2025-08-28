import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { useState } from 'react';
import { ColorValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
  focusedDate: Date | null;
  nowMonth: number;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date|null>>
}

const CalendarDate: React.FC<CalendarDateProps> = ({detailDate, focusedDate, nowMonth, setFocusedDate}) => {
  return (
    <TouchableOpacity
      onPress={() => setFocusedDate(detailDate)}
      style={[
          dateContainerStyles.container, 
          detailDate.getTime() === focusedDate?.getTime() && dateContainerStyles.focusedContainer,
      ]}
    >
      <Text style={
        detailDate.getMonth() === nowMonth ? dateTextStyles.sameMonthText : dateTextStyles.diffMonthText
      }>
        {detailDate.getDate()}
      </Text>
    </TouchableOpacity>
  );
}

const dateContainerStyles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    borderWidth: 2,
    borderRadius: 13,
    borderColor: '#63a7ff'
  }
})

const dateTextStyles = StyleSheet.create({
  sameMonthText: {
    color: '#000000',
  },
  diffMonthText: {
    color: '#818181',
  }
})

/*
Week Component
*/
interface CalendarWeekProps {
  dateList: Date[]
  nowMonth: number;
  focusedDate: Date | null;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date|null>>
}

const CalendarWeek: React.FC<CalendarWeekProps> = ({dateList, focusedDate, nowMonth, setFocusedDate}) => {
  return (
    <View style={weekContainerStyles.container}>
      {dateList.map((date) => (
        <CalendarDate detailDate={date} focusedDate={focusedDate} nowMonth={nowMonth} setFocusedDate={setFocusedDate}/>
      ))}
    </View>
  );
}

const weekContainerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8
  }
})

/*
Month Component
*/
interface CalendarMonthProps {
  year: number
  month: number
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({year, month}) => {
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  //첫 번째 날짜
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  
  //마지막 날짜
  const lastDate = new Date(year, month + 1, 1);
  lastDate.setDate(lastDate.getDate() - 1);

  //첫 번째 날짜의 주
  let dayDiff = firstDay;
  const tmpDate = new Date(year, month, 1);
  tmpDate.setDate(firstDate.getDate() - dayDiff)

  let isLastWeek = false;
  const dateToMonth: Date[][] = [];

  //첫 날이 어떤 요일인지에 따라 시작일을 다르게
  while(!isLastWeek) {
    const dateToWeek: Date[] = []
    for (let i = 0; i < 7; i++) {
      dateToWeek.push(new Date(tmpDate))
      if (tmpDate.getTime() === lastDate.getTime()) {
        isLastWeek = true;
      }
      tmpDate.setDate(tmpDate.getDate() + 1);
    }
    dateToMonth.push(dateToWeek)
  }

  return (
    <View style={monthContainerStyles.container}>
      {dateToMonth.map((week) => (
        <CalendarWeek dateList={week} focusedDate={focusedDate} nowMonth={month} setFocusedDate={setFocusedDate}/>
      ))}
    </View>
  )
}

const monthContainerStyles = StyleSheet.create({
  container: {
  }
})

/*
Calendar Head
*/
interface CalendarHeadProps {
  year: number;
  setYear:  React.Dispatch<React.SetStateAction<number>>
  month: number;
  setMonth:  React.Dispatch<React.SetStateAction<number>>
}

const CalendarHead: React.FC<CalendarHeadProps> = ({year, month, setYear, setMonth}) => {
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

/*
Calendar Day
*/
interface CalendarDayProps {
  day: string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({day}) => {
  let textColor: string = '#7a7a7a';
  if (day === 'Sun') {
    textColor = '#ff0000'
  } else if (day === 'Sat') {
    textColor = '#0000ff'
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
const CalendarDayWeek: React.FC = () => {
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={dayWeekStyles.container}>
      {dayList.map((day) => (
        <CalendarDay day={day} />
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


/*
Calendar
*/
export const Calendar: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  return (
    <View>
      <CalendarHead year={year} month={month} setYear={setYear} setMonth={setMonth} />
      <CalendarDayWeek/>
      <CalendarMonth year={year} month={month} />
    </View>
  )
}
