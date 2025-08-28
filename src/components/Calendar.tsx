import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

/*
Date Component
*/
interface CalendarDateProps {
  detailDate: Date;
  focusedDate: Date | null;
  nowMonth: number;
  setFocusedDate: React.Dispatch<React.SetStateAction<Date|null>>
}

export const CalendarDate: React.FC<CalendarDateProps> = ({detailDate, focusedDate, nowMonth, setFocusedDate}) => {
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

export const CalendarWeek: React.FC<CalendarWeekProps> = ({dateList, focusedDate, nowMonth, setFocusedDate}) => {
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
    paddingVertical: 8
  }
})

/*
Month Component
*/

/*
Calendar
*/
interface CalendarProps {
  year: number
  month: number
}

export const Calendar: React.FC<CalendarProps> = ({year, month}) => {
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