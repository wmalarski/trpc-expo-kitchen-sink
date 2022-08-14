import type { InferQueryOutput } from '@tens/api/src/types';
import { trpc } from '@tens/expo/utils/trpc';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
  cursor?: string;
  take: number;
};

export const useVoteToggleMutation = ({ question, cursor, take }: Props) => {
  const queryClient = trpc.useContext();

  return trpc.useMutation(['vote.toggle'], {
    onMutate: async ({ content, questionId }) => {
      const args = { roomId: question.roomId, cursor, take };

      await queryClient.cancelQuery(['question.list', args]);

      const previous = queryClient.getQueryData(['question.list', args]);

      if (!previous) return {};

      const next = [...previous];
      const counts = [...question.counts];

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

      const questionIndex = next.findIndex((entry) => entry.id === questionId);
      next[questionIndex] = { ...question, vote, counts: counts };

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
};
