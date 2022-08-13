import type { DrawerScreenProps } from '@react-navigation/drawer';
import { Heading, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { trpc } from '../../utils/trpc';
import type { RoomsNavigatorParams } from '../Router';

export const Room = ({
  route,
}: DrawerScreenProps<RoomsNavigatorParams, 'Room'>): ReactElement => {
  const roomId = route.params.roomId;

  const roomQuery = trpc.useQuery(['room.get', { id: roomId }]);

  if (roomQuery.status === 'loading' || roomQuery.status === 'idle') {
    return <Text>Loading</Text>;
  }

  if (roomQuery.status === 'error') {
    return <Text>{roomQuery.error.message}</Text>;
  }

  return (
    <VStack>
      <Heading>{roomQuery.data.title}</Heading>
      <Heading size="md">{roomQuery.data.description}</Heading>
    </VStack>
  );
};
