import type { InferQueryOutput } from '@tens/api/src/types';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet, DeleteIcon } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const DeleteAction = ({
  question,
  showAnswered,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['question.delete'], {
    onMutate: async ({ id }) => {
      const args = { roomId: question.roomId, showAnswered, take };

      await queryClient.cancelQuery(['question.list', args]);

      const previous = queryClient.getInfiniteQueryData([
        'question.list',
        args,
      ]);

      if (!previous) return {};

      const next = previous.pages.map((page) => {
        const nextQuestions = page.questions.filter(
          (question) => question.id !== id,
        );
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
    mutation.mutate({ id: question.id });
  };

  return (
    <Actionsheet.Item
      leftIcon={<DeleteIcon mt={1} />}
      isDisabled={mutation.isLoading}
      onPress={handlePress}
    >
      {t('delete')}
    </Actionsheet.Item>
  );
};
