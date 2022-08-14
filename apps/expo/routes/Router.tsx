import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { ReactElement } from 'react';
import { Account } from './Account/Account';
import { Room } from './Room/Room';
import { Rooms } from './Rooms/Rooms';
import { RoomSettings } from './RoomSettings/RoomSettings';
import { SendLink } from './SendLink/SendLink';
import { SignIn } from './SignIn/SignIn';
import { SignUp } from './SignUp/SignUp';

export type RoomsNavigatorParams = {
  Rooms: undefined;
  Room: { roomId: string };
  RoomSettings: { roomId: string };
};
const RoomsStack = createStackNavigator<RoomsNavigatorParams>();

const RoomsRouter = (): ReactElement => {
  return (
    <RoomsStack.Navigator>
      <RoomsStack.Screen name="Rooms" component={Rooms} />
      <RoomsStack.Screen name="Room" component={Room} />
      <RoomsStack.Screen name="RoomSettings" component={RoomSettings} />
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
  SendLink: undefined;
  SignIn: undefined;
  SignUp: undefined;
  DrawerRouter: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

export const Router = (): ReactElement => {
  const status = useSessionStatus();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'anon' && (
          <Stack.Group>
            <Stack.Screen name="SendLink" component={SendLink} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Group>
        )}
        {status === 'auth' && (
          <Stack.Screen name="DrawerRouter" component={DrawerRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
