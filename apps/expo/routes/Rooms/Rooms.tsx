import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
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
    return (
      <VStack space={2} pt={2}>
        {[1, 2, 3, 4].map((entry) => (
          <Skeleton height="24" key={entry} />
        ))}
      </VStack>
    );
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  const handleRefresh = () => {
    query.refetch();
  };

  return (
    <SafeAreaView>
      <VStack p={4} space={2}>
        <VStack>
          <FlatList
            data={query.data}
            keyExtractor={(item) => item.id}
            onRefresh={handleRefresh}
            refreshing={query.isFetching}
            height="full"
            renderItem={({ item }) => <RoomsItem room={item} />}
          />
        </VStack>
      </VStack>
      <AddRoom />
    </SafeAreaView>
  );
};
