import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { trpc } from '@tens/expo/utils/trpc';
import { Box, VStack } from 'native-base';
import { ReactElement } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import type { RoomsNavigatorParams } from '../../Router';

export const RoomList = (): ReactElement => {
  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const queryClient = trpc.useContext();

  const roomsQuery = trpc.useQuery(['room.list', { skip: 0, take: 10 }], {
    // refetchInterval: 3000,
    onSuccess(data) {
      data.forEach((room) => {
        queryClient.setQueryData(['room.get', { id: room.id }], room);
      });
    },
  });

  const handleItemPress = (item: Room) => {
    navigation.navigate('Room', { roomId: item.id });
  };

  return (
    <SafeAreaView>
      <VStack>
        {roomsQuery.data ? (
          <FlatList
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <Box padding={5} flex={1}>
                  <Text>{item.title}</Text>
                </Box>
              </TouchableOpacity>
            )}
            data={roomsQuery.data}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text>{roomsQuery.status}</Text>
        )}
      </VStack>
    </SafeAreaView>
  );
};
