import { trpc } from '@tens/expo/utils/trpc';
import { Center, FlatList, Spinner, Text } from 'native-base';
import { ReactElement, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
};

export const Questions = ({ roomId }: Props): ReactElement => {
  const [cursor] = useState<string>();

  const query = trpc.useQuery(['question.list', { cursor, take: 10, roomId }]);

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
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
      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={query.isFetching}
        height="full"
        renderItem={({ item }) => <QuestionsItem question={item} />}
      />
    </SafeAreaView>
  );
};
