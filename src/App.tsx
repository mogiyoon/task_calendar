/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './components/MyTabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <MyTabs/>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
