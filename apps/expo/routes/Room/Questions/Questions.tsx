import { useQuestionsSubscription } from '@tens/common/src/services/useQuestionSubscription';
import { supabase } from '@tens/expo/utils/supabase';
import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
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
      getNextPageParam: (lastPage) => {
        return lastPage.cursor;
      },
    },
  );

  useQuestionsSubscription({
    roomId,
    supabase,
    trpc,
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

  const handleEndReached = () => {
    query.fetchNextPage();
  };

  return (
    <SafeAreaView>
      <FlatList
        data={query.data.pages.flatMap((page) => page.questions)}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        refreshing={query.isFetching}
        renderItem={({ item: question }) => (
          <QuestionsItem
            canAnswer={query.data.pages[0].canAnswer}
            question={question}
            showAnswered={showAnswered}
            take={take}
          />
        )}
      />
    </SafeAreaView>
  );
};
