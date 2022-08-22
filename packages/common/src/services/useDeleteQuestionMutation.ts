import type { AppRouter } from '@tens/api/src/routes';
import type { InferQueryOutput } from '@tens/api/src/types';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useDeleteQuestionMutation = ({
  question,
  showAnswered,
  take,
  trpc,
}: Props) => {
  const queryClient = trpc.useContext();

  return trpc.useMutation(['question.delete'], {
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
};
