import type { InferQueryOutput } from '@tens/api/src/types';
import { useToggleVoteMutation } from '@tens/common/src/services/useToggleVoteMutation';
import { trpc } from '@tens/next/utils/trpc';
import clsx from 'clsx';
import { ReactElement } from 'react';

type Props = {
  reaction: string;
  question: InferQueryOutput<'question.list'>['questions'][0];
};

export const ReactionButton = ({ reaction, question }: Props): ReactElement => {
  const mutation = useToggleVoteMutation({
    question,
    trpc,
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
      {`${reaction}${counts?._count ? ` ${counts._count}` : ''}`}
    </button>
  );
};
