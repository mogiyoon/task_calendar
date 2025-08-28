import React from 'react';
import { View } from 'react-native';
import { Calendar } from '../components/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';

function CalendarScreen() {
  return (
    <SafeAreaView>
      <View>
        <Calendar/>
      </View>
    </SafeAreaView>
  );
}

export default CalendarScreen;