import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { RootStackParamList } from './src/types/index';
import store from './src/store';
import Home from './src/screen/Home';
import Search from './src/screen/Search';
import Library from './src/screen/Library';
import Rank from './src/screen/Rank';
import Profile from './src/screen/Profile';
import Reading from './src/screen/Reading';
import BookInfo from './src/screen/BookInfo';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Library" component={Library} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Rank" component={Rank} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Reading" component={Reading} />
          <Stack.Screen name="BookInfo" component={BookInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
