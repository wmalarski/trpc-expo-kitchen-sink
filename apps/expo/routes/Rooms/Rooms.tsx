import { trpc } from '@tens/expo/utils/trpc';
import { VStack } from 'native-base';
import { ReactElement } from 'react';
import { FlatList, SafeAreaView, Text } from 'react-native';
import { AddRoom } from './AddRoom/AddRoom';
import { RoomsItem } from './RoomsItem/RoomsItem';

export const Rooms = (): ReactElement => {
  const queryClient = trpc.useContext();

  const query = trpc.useQuery(['room.list', { skip: 0, take: 10 }], {
    // refetchInterval: 3000,
    onSuccess(data) {
      data.forEach((room) => {
        queryClient.setQueryData(['room.get', { id: room.id }], room);
      });
    },
  });

  if (query.status === 'loading' || query.status === 'idle') {
    return <Text>Loading</Text>;
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <VStack p={4} space={2}>
        <VStack>
          <FlatList
            renderItem={({ item }) => <RoomsItem room={item} />}
            data={query.data}
            keyExtractor={(item) => item.id}
          />
        </VStack>
      </VStack>
      <AddRoom />
    </SafeAreaView>
  );
};
