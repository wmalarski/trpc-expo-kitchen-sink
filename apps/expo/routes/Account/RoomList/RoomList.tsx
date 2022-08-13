import { trpc } from '@tens/expo/utils/trpc';
import { Box, VStack } from 'native-base';
import { ReactElement } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';

export const RoomList = (): ReactElement => {
  const posts = trpc.useQuery(['room.list'], {
    // refetchInterval: 3000,
  });

  return (
    <SafeAreaView>
      <VStack>
        {posts.data ? (
          <FlatList
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  alert(`You clicked ID ${item.id} `);
                }}
              >
                <Box padding={5} flex={1}>
                  <Text>{item.title}</Text>
                </Box>
              </TouchableOpacity>
            )}
            data={posts.data}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text>{posts.status}</Text>
        )}
      </VStack>
    </SafeAreaView>
  );
};
