import { ErrorMessage } from '@tens/expo/components/ErrorMessage/ErrorMessage';
import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, VStack } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
import { AddRoom } from './AddRoom/AddRoom';
import { RoomsItem } from './RoomsItem/RoomsItem';

export const Rooms = (): ReactElement => {
  const queryClient = trpc.useContext();

  const query = trpc.useInfiniteQuery(['room.list', { take: 10 }], {
    getNextPageParam: (data) => {
      return data[data.length - 1]?.id;
    },
    onSuccess: (data) => {
      data.pages
        .flatMap((page) => page)
        .forEach((room) => {
          queryClient.setQueryData(['room.get', { id: room.id }], room);
        });
    },
  });

  console.log({ params: query.data?.pageParams });

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
    return (
      <ErrorMessage
        onReloadPress={() => query.refetch()}
        message={query.error.message}
      />
    );
  }

  const handleRefresh = () => {
    query.refetch();
  };

  const handleEndReached = () => {
    query.fetchNextPage();
  };

  return (
    <SafeAreaView>
      <VStack p={4} space={2}>
        <FlatList
          data={query.data.pages.flatMap((page) => page)}
          keyExtractor={(item) => item.id}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
          refreshing={query.isFetching}
          height="full"
          renderItem={({ item }) => <RoomsItem room={item} />}
        />
      </VStack>
      <AddRoom />
    </SafeAreaView>
  );
};
