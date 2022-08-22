import type { AppRouter } from '@tens/api/src/routes';
import type { InferQueryOutput } from '@tens/api/src/types';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';

type UseToggleVoteMutation = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useToggleVoteMutation = ({
  question,
  take,
  showAnswered,
  trpc,
}: UseToggleVoteMutation) => {
  const queryClient = trpc.useContext();

  return trpc.useMutation(['vote.toggle'], {
    onMutate: async ({ content, questionId }) => {
      const args = { roomId: question.roomId, take, showAnswered };

      await queryClient.cancelQuery(['question.list']);

      const previous = queryClient.getInfiniteQueryData([
        'question.list',
        args,
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

      const next = previous.pages.map((page) => {
        const questionIndex = page.questions.findIndex(
          (entry) => entry.id === questionId,
        );
        if (questionIndex < 0) return page;

        const nextQuestions = [...page.questions];
        nextQuestions[questionIndex] = { ...question, vote, counts: counts };
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
      const args = { roomId: question.roomId, take };
      queryClient.setInfiniteQueryData(
        ['question.list', args],
        context.previous,
      );
    },
    onSettled: () => {
      const args = { roomId: question.roomId, take };
      queryClient.invalidateQueries(['question.list', args]);
    },
  });
};
