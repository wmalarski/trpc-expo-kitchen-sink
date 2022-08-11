import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js';
import { ReactElement } from 'react';
import { Account } from './Account/Account';
import { Login } from './Login/Login';

const Stack = createNativeStackNavigator();

type Props = {
  session: Session | null;
};

export const Router = ({ session }: Props): ReactElement => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <Stack.Screen name="Account" component={Account} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
