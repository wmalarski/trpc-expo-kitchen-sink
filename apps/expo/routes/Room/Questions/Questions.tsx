import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, Text, VStack } from 'native-base';
import { ReactElement, useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const query = trpc.useInfiniteQuery(
    ['question.list', { take, roomId, answered: showAnswered }],
    {
      getNextPageParam: (data) => {
        if (data.length < 1) return null;
        return data[data.length - 1].id;
      },
    },
  );

  console.log({ params: query.data?.pageParams });

  const data = useMemo(() => {
    if (!query.data) return [];
    return query.data?.pages.flatMap((page, index) => {
      const cursor = query.data.pageParams[index] as string | undefined;
      return page.map((room) => ({ ...room, cursor }));
    });
  }, [query.data]);

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

  const handleEndReached = () => {
    query.fetchNextPage();
  };

  console.log({ data });

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        refreshing={query.isFetching}
        renderItem={({ item: question }) => (
          <QuestionsItem
            question={question}
            cursor={question.cursor}
            take={take}
          />
        )}
      />
    </SafeAreaView>
  );
};
