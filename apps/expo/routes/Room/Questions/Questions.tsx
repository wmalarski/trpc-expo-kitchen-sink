import { trpc } from '@tens/expo/utils/trpc';
import { Text } from 'native-base';
import { ReactElement, useState } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

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

  return (
    <SafeAreaView>
      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QuestionsItem question={item} />}
      />
    </SafeAreaView>
  );
};
