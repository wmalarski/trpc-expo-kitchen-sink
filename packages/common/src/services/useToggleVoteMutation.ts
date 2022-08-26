import type { AppRouter } from '@tens/api/src/routes';
import type { InferQueryOutput } from '@tens/api/src/types';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';

type UseToggleVoteMutation = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useToggleVoteMutation = ({
  question,
  trpc,
}: UseToggleVoteMutation) => {
  const queryClient = trpc.useContext();

  return trpc.useMutation(['vote.toggle'], {
    onMutate: async ({ content, questionId }) => {
      await queryClient.cancelQuery(['question.list']);

      const previous = queryClient.getQueryData([
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

      queryClient.setQueryData(['question.get', { questionId }], {
        ...question,
        vote,
        counts,
      });

      return { previous };
    },
    onError: (_err, { questionId }, context) => {
      if (!context?.previous) return;
      queryClient.setQueryData(
        ['question.get', { questionId }],
        context.previous,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries([
        'question.get',
        { questionId: question.id },
      ]);
    },
  });
};
