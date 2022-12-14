import { useQuestionsSubscription } from '@tens/common/src/services/useQuestionSubscription';
import { ErrorMessage } from '@tens/expo/components/ErrorMessage/ErrorMessage';
import { supabase } from '@tens/expo/utils/supabase';
import { trpc } from '@tens/expo/utils/trpc';
import { FlatList, Skeleton, VStack } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const trpcContext = trpc.useContext();

  const query = trpc.useInfiniteQuery(
    ['question.list', { take, roomId, answered: showAnswered }],
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      onSuccess: async (data) => {
        data.pages
          .flatMap((page) => page.questions)
          .forEach((question) => {
            trpcContext.setQueryData(
              ['question.get', { questionId: question.id }],
              question,
            );
          });
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

  const handleRefresh = () => {
    query.refetch();
  };

  if (query.status === 'error') {
    return (
      <ErrorMessage
        message={query.error.message}
        onReloadPress={handleRefresh}
      />
    );
  }

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
