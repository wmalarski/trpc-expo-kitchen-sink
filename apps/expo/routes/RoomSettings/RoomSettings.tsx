import { StackScreenProps } from '@react-navigation/stack';
import { trpc } from '@tens/expo/utils/trpc';
import { Heading, Skeleton, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
import type { RoomsNavigatorParams } from '../Router';
import { EditRoom } from './EditRoom/EditRoom';

export const RoomSettings = ({
  route,
}: StackScreenProps<RoomsNavigatorParams, 'Room'>): ReactElement => {
  const roomId = route.params.roomId;

  const query = trpc.useQuery(['room.get', { id: roomId }]);

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      <SafeAreaView>
        <VStack p={4} space={2}>
          <Skeleton.Text lines={1} _line={{ height: '8' }} />
          <Skeleton.Text lines={2} pb={4} pt={2} />
          <Skeleton.Text lines={1} _line={{ height: '8' }} />
          <Skeleton.Text lines={4} pb={4} pt={2} />
        </VStack>
      </SafeAreaView>
    );
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <VStack p={4} space={2}>
        <Heading>{query.data.title}</Heading>
        <Text pb={4}>{query.data.description}</Text>
        <EditRoom room={query.data} />
      </VStack>
    </SafeAreaView>
  );
};
