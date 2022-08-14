import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, Text, VStack } from 'native-base';
import { ReactElement, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const [cursor] = useState<string>();

  const query = trpc.useQuery([
    'question.list',
    { cursor, take, roomId, answered: showAnswered },
  ]);

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
      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={query.isFetching}
        // height="full"
        renderItem={({ item }) => (
          <QuestionsItem question={item} cursor={cursor} take={take} />
        )}
      />
    </SafeAreaView>
  );
};
