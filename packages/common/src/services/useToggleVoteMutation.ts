import type { AppRouter } from '@tens/api/src/routes';
import type { InferQueryOutput } from '@tens/api/src/types';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';

type UseToggleVoteMutation = {
  onError: (error: TRPCClientErrorLike<AppRouter>) => void;
  question: InferQueryOutput<'question.list'>['questions'][0];
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useToggleVoteMutation = ({
  question,
  trpc,
  onError,
}: UseToggleVoteMutation) => {
  const trpcContext = trpc.useContext();

  return trpc.useMutation(['vote.toggle'], {
    onMutate: async ({ content, questionId }) => {
      await trpcContext.cancelQuery(['question.list']);

      const previous = trpcContext.getQueryData([
        'question.get',
        { questionId },
      ]);

      if (!previous) return {};

      const vote = !question.vote
        ? {
            content,
            createdAt: new Date(),
            id: `${Math.random() * 1e16}`,
            questionId,
            userId: question.userId,
          }
        : question.vote.content !== content
        ? { ...question.vote, content }
        : undefined;

      const counts = [...question.counts];
      if (!question.vote || question.vote.content !== content) {
        const index = counts.findIndex((e) => e.content === content);
        if (index >= 0) {
          const count = counts[index];
          counts[index] = { ...count, _count: count._count + 1 };
        } else {
          counts.push({ _count: 1, content, questionId });
        }
      }

      if (question.vote) {
        const currentContent = question.vote?.content;
        const index = counts.findIndex((e) => e.content === currentContent);
        if (index >= 0) {
          const count = counts[index];
          counts[index] = { ...count, _count: count._count - 1 };
        }
      }

      trpcContext.setQueryData(['question.get', { questionId }], {
        ...question,
        vote,
        counts,
      });

      return { previous };
    },
    onError: (err, { questionId }, context) => {
      onError(err);
      if (!context?.previous) return;
      trpcContext.setQueryData(
        ['question.get', { questionId }],
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
