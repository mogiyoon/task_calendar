import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import Calendar from '../screens/Calendar';
import Library from '../screens/Library';
import MyPage from '../screens/MyPage';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  let iconName = '';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Calendar':
              iconName = 'calendar';
              break;
            case 'Library':
              iconName = 'barbell';
              break;
            case 'MyPage':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={25} color={color}/>
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'HOME' }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{ tabBarLabel: 'CALENDAR' }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{ tabBarLabel: 'LIBRARY' }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{ tabBarLabel: 'MY PAGE' }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
