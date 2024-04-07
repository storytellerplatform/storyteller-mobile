import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { RootStackParamList } from './types/index';
import store from './store';
import Home from './screen/Home';
import Search from './screen/Search';
import Library from './screen/Library';
import Rank from './screen/Rank';
import Profile from './screen/Profile';
import Reading from './screen/Reading';
import Tests from './screen/Test';

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
          <Stack.Screen name="Tests" component={Tests} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
