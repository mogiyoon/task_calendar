import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import Calendar from '../screens/Calendar';
import Library from '../screens/Library';
import MyPage from '../screens/MyPage';

// 1. 각 탭의 파라미터 타입을 정의합니다. (파라미터가 없으면 undefined)
type RootTabParamList = {
  HOME: undefined;
  CALENDAR: undefined;
  LIBRARY: undefined;
  MYPAGE: undefined;
};

// 2. TabBarIcon 컴포넌트가 받을 props의 타입을 정의합니다.
interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  route: RouteProp<RootTabParamList, keyof RootTabParamList>;
}

// 3. 아이콘 렌더링 로직을 담당하는 별도의 컴포넌트를 생성합니다.
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
        
        tabBarActiveTintColor: 'tomato',
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