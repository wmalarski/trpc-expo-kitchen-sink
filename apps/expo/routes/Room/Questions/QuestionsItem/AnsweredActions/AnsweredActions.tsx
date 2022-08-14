import type { InferQueryOutput } from '@tens/api/src/types';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
  cursor?: string;
  take: number;
};

export const AnsweredActions = ({
  question,
  cursor,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['question.answer'], {
    onMutate: async ({ id, answered }) => {
      const args = { roomId: question.roomId, cursor, take };

      await queryClient.cancelQuery(['question.list', args]);

      const previous = queryClient.getQueryData(['question.list', args]);

      if (!previous) return {};

      const next = [...previous];

      const questionIndex = next.findIndex((entry) => entry.id === id);
      next[questionIndex] = { ...question, answered };

      queryClient.setQueryData(['question.list', args], next);

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (!context?.previous) return;
      const args = { roomId: question.roomId, cursor, take };
      queryClient.setQueryData(['question.list', args], context.previous);
    },
    onSettled: () => {
      const args = { roomId: question.roomId, cursor, take };
      queryClient.invalidateQueries(['question.list', args]);
    },
  });

  const handlePress = () => {
    mutation.mutate({ answered: !question.answered, id: question.id });
  };

  return (
    <Actionsheet.Item isDisabled={mutation.isLoading} onPress={handlePress}>
      {question.answered ? t('markAsUnanswered') : t('markAsAnswered')}
    </Actionsheet.Item>
  );
};
