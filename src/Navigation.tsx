import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import LoginRegisterScreen from './screens/LoginRegisterScreen';
import { Header } from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName='LoginRegisterScreen'
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ title: "Ana Sayfa", headerShown: false }} />

        </Stack.Navigator>
    )
}

export default Navigation;