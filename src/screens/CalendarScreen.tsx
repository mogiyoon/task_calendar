import React from 'react';
import { View } from 'react-native';
import { Calendar } from '../components/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';

function CalendarScreen() {
  const testDate = new Date(2025, 7, 1);

  return (
    <SafeAreaView>
      <View>
        <Calendar year={testDate.getFullYear()} month={testDate.getMonth()}/>
      </View>
    </SafeAreaView>
  );
}

export default CalendarScreen;