import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { ReactElement } from 'react';
import { Account } from './Account/Account';
import { Login } from './Login/Login';

const Stack = createNativeStackNavigator();

export const Router = (): ReactElement => {
  const status = useSessionStatus();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === 'anon' && (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
        {status === 'auth' && (
          <Stack.Group>
            <Stack.Screen name="Account" component={Account} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
