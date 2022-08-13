import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { ReactElement } from 'react';
import { Account } from './Account/Account';
import { Home } from './Home/Home';
import { Login } from './Login/Login';
import { SignUp } from './SignUp/SignUp';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Protected = (): ReactElement => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Account" component={Account} />
    </Drawer.Navigator>
  );
};

export const Router = (): ReactElement => {
  const status = useSessionStatus();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === 'anon' && (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Group>
        )}
        {status === 'auth' && (
          <Stack.Screen name="Protected" component={Protected} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
