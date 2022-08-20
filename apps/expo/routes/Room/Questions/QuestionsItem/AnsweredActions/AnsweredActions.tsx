import type { InferQueryOutput } from '@tens/api/src/types';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet, CheckIcon, MinusIcon } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const AnsweredActions = ({
  question,
  showAnswered,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['question.answer'], {
    onMutate: async ({ id, answered }) => {
      const args = { roomId: question.roomId, showAnswered, take };

      await queryClient.cancelQuery(['question.list']);

      const previous = queryClient.getInfiniteQueryData([
        'question.list',
        args,
      ]);

      if (!previous) return {};

      const next = previous.pages.map((page) => {
        const questionIndex = page.questions.findIndex(
          (question) => question.id === id,
        );
        if (questionIndex < 0) return page;

        const nextQuestions = [...page.questions];
        nextQuestions[questionIndex] = { ...question, answered };
        return { ...page, questions: nextQuestions };
      });

      queryClient.setInfiniteQueryData(['question.list', args], {
        ...previous,
        pages: next,
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (!context?.previous) return;
      const args = { roomId: question.roomId, showAnswered, take };
      queryClient.setInfiniteQueryData(
        ['question.list', args],
        context.previous,
      );
    },
    onSettled: () => {
      const args = { roomId: question.roomId, showAnswered, take };
      queryClient.invalidateQueries(['question.list', args]);
    },
  });

  const handlePress = () => {
    mutation.mutate({ answered: !question.answered, id: question.id });
  };

  return (
    <Actionsheet.Item
      justifyContent="center"
      startIcon={
        question.answered ? <MinusIcon mt={1} /> : <CheckIcon mt={1} />
      }
      isDisabled={mutation.isLoading}
      onPress={handlePress}
    >
      {question.answered ? t('markAsUnanswered') : t('markAsAnswered')}
    </Actionsheet.Item>
  );
};
