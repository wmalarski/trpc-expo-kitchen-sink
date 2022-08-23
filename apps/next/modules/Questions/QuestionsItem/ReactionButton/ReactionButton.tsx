import type { InferQueryOutput } from '@tens/api/src/types';
import { useToggleVoteMutation } from '@tens/common/src/services/useToggleVoteMutation';
import { trpc } from '@tens/next/utils/trpc';
import clsx from 'clsx';
import { ReactElement } from 'react';

type Props = {
  reaction: string;
  question: InferQueryOutput<'question.list'>['questions'][0];
  take: number;
  showAnswered?: boolean;
};

export const ReactionButton = ({
  reaction,
  question,
  take,
  showAnswered,
}: Props): ReactElement => {
  const mutation = useToggleVoteMutation({
    question,
    take,
    trpc,
    showAnswered,
  });

  const handleReactionClick = () => {
    mutation.mutate({ content: reaction, questionId: question.id });
  };

  const counts = question.counts.find((votes) => votes.content === reaction);
  const isSelected = question.vote?.content === reaction;

  return (
    <button
      className={clsx('btn bg-base-200', { 'bg-base-300': isSelected })}
      onClick={handleReactionClick}
    >
      {reaction}
      {`${reaction}${counts?._count ? ` ${counts._count}` : ''}`}
    </button>
  );
};
