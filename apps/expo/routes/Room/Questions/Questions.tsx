import { Question } from '@prisma/client';
import { trpc } from '@tens/expo/utils/trpc';
import { Box, Text } from 'native-base';
import { ReactElement, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

type Props = {
  roomId: string;
};

export const Questions = ({ roomId }: Props): ReactElement => {
  const [cursor] = useState<string>();

  const query = trpc.useQuery(['question.list', { cursor, take: 10, roomId }]);

  if (query.status === 'loading' || query.status === 'idle') {
    return <Text>Loading</Text>;
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  const handleItemPress = (item: Question) => {
    console.log(item);
  };

  return (
    <SafeAreaView>
      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Box padding={5} flex={1}>
              <Text>{item.content}</Text>
            </Box>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};
