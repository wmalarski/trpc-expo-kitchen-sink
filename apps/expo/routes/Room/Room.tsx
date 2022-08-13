import type { DrawerScreenProps } from '@react-navigation/drawer';
import { VStack } from 'native-base';
import { ReactElement } from 'react';
import type { RoomsNavigatorParams } from '../Router';
import { AddQuestion } from './AddQuestion/AddQuestion';
import { Questions } from './Questions/Questions';
import { RoomHeading } from './RoomHeading/RoomHeading';

export const Room = ({
  route,
}: DrawerScreenProps<RoomsNavigatorParams, 'Room'>): ReactElement => {
  const roomId = route.params.roomId;

  return (
    <VStack p={4} space={2}>
      <RoomHeading roomId={roomId} />
      <Questions roomId={roomId} />
      <AddQuestion roomId={roomId} />
    </VStack>
  );
};
