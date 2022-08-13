import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { ReactElement } from 'react';
import { Account } from './Account/Account';
import { Home } from './Home/Home';
import { Login } from './Login/Login';
import { Room } from './Room/Room';
import { SignUp } from './SignUp/SignUp';

export type RoomsNavigatorParams = {
  Rooms: undefined;
  Room: { roomId: string };
};
const RoomsStack = createStackNavigator<RoomsNavigatorParams>();

const RoomsRouter = (): ReactElement => {
  return (
    <RoomsStack.Navigator>
      <RoomsStack.Screen name="Rooms" component={Home} />
      <RoomsStack.Screen name="Room" component={Room} />
    </RoomsStack.Navigator>
  );
};

export type DrawerNavigatorParams = {
  RoomsRouter: undefined;
  Account: undefined;
};

const DrawerStack = createDrawerNavigator<DrawerNavigatorParams>();

const DrawerRouter = (): ReactElement => {
  return (
    <DrawerStack.Navigator screenOptions={{ headerShown: false }}>
      <DrawerStack.Screen name="RoomsRouter" component={RoomsRouter} />
      <DrawerStack.Screen name="Account" component={Account} />
    </DrawerStack.Navigator>
  );
};

export type StackParams = {
  SignIn: undefined;
  SignUp: undefined;
  Drawer: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

export const Router = (): ReactElement => {
  const status = useSessionStatus();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'anon' && (
          <Stack.Group>
            <Stack.Screen name="SignIn" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Group>
        )}
        {status === 'auth' && (
          <Stack.Screen name="Drawer" component={DrawerRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
