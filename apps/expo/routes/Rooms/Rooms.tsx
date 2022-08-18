import { ErrorMessage } from '@tens/expo/components/ErrorMessage/ErrorMessage';
import { trpc } from '@tens/expo/utils/trpc';
import { Skeleton, VStack } from 'native-base';
import { ReactElement, useCallback, useState } from 'react';
import { SafeAreaView, VirtualizedList } from 'react-native';
import { AddRoom } from './AddRoom/AddRoom';
import { RoomRow, RoomsItem } from './RoomsItem/RoomsItem';

export const Rooms = (): ReactElement => {
  const queryClient = trpc.useContext();

  const [skip, setSkip] = useState(0);

  const query = trpc.useQuery(['room.listSkip', { take: 10, skip }], {
    onSuccess: (data) => {
      data.rooms.forEach((room) => {
        queryClient.setQueryData(['room.get', { id: room.id }], room);
      });
    },
  });

  const getItem = useCallback(
    (_data: RoomRow, row: number) => {
      const room = query.data?.rooms[row - skip];
      if (room) return { key: room.id, room, isLoading: false as const };
      return { key: `${Math.random() * 1e16}`, isLoading: true as const };
    },
    [query.data?.rooms, skip],
  );

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

  return (
    <SafeAreaView>
      <VStack p={4} space={2}>
        <VirtualizedList<RoomRow>
          data={[] as RoomRow[]}
          keyExtractor={(item) => item.key}
          onRefresh={handleRefresh}
          refreshing={query.isFetching}
          // height="full"
          initialNumToRender={4}
          getItemCount={() => query.data.count}
          getItem={getItem}
          renderItem={({ item, index }) => {
            console.log(index);
            return <RoomsItem row={item} />;
          }}
          // onScroll={(event) => {
          //   console.log({ native: event.nativeEvent });
          // }}

          // onViewableItemsChanged={(event) => {
          //   console.log(event);
          // }}
          // viewabilityConfig={{
          //   itemVisiblePercentThreshold: 10,
          //   minimumViewTime: 0,
          //   waitForInteraction: false,
          //   viewAreaCoveragePercentThreshold: 10,
          // }}
        />
      </VStack>
      <AddRoom />
    </SafeAreaView>
  );
};
