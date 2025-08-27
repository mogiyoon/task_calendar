import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import Calendar from '../screens/Calendar';
import Library from '../screens/Library';
import MyPage from '../screens/MyPage';

type RootTabParamList = {
  HOME: undefined;
  CALENDAR: undefined;
  LIBRARY: undefined;
  MYPAGE: undefined;
};

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  route: RouteProp<RootTabParamList, keyof RootTabParamList>;
}

const TabBarIcon = ({ focused, color, size, route }: TabBarIconProps) => {
  let iconName: string = 'alert-circle-outline';

  if (route.name === 'HOME') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'CALENDAR') {
    iconName = focused ? 'calendar' : 'calendar-outline';
  } else if (route.name === 'LIBRARY') {
    iconName = focused ? 'barbell' : 'barbell-outline';
  } else if (route.name === 'MYPAGE') {
    iconName = focused ? 'person-circle' : 'person-circle-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // 4. 분리된 TabBarIcon 컴포넌트를 호출하여 사용합니다.
        tabBarIcon: (props) => <TabBarIcon {...props} route={route} />,
        
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HOME" component={HomeScreen} />
      <Tab.Screen name="CALENDAR" component={Calendar} />
      <Tab.Screen name="LIBRARY" component={Library} />
      <Tab.Screen name="MYPAGE" component={MyPage} />
    </Tab.Navigator>
  );
};

export default MyTabs;