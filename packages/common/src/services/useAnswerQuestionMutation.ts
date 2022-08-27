import type { AppRouter } from '@tens/api/src/routes';
import type { InferQueryOutput } from '@tens/api/src/types';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
  onError: (error: TRPCClientErrorLike<AppRouter>) => void;
};

export const useAnswerQuestionMutation = ({
  question,
  trpc,
  onError,
}: Props) => {
  const trpcContext = trpc.useContext();

  return trpc.useMutation(['question.answer'], {
    onMutate: async ({ id, answered }) => {
      await trpcContext.cancelQuery(['question.get', { questionId: id }]);

      const previous = trpcContext.getQueryData([
        'question.get',
        { questionId: id },
      ]);

      if (!previous) return {};

      trpcContext.setQueryData(['question.get', { questionId: id }], {
        ...previous,
        answered,
      });

      return { previous };
    },
    onError: (err, { id }, context) => {
      onError(err);
      if (!context?.previous) return;
      trpcContext.setQueryData(
        ['question.get', { questionId: id }],
        context.previous,
      );
    },
    onSettled: () => {
      trpcContext.invalidateQueries([
        'question.get',
        { questionId: question.id },
      ]);
    },
  });
};
