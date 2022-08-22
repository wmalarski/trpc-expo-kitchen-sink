import type { InferQueryOutput } from '@tens/api/src/types';
import { useToggleVoteMutation } from '@tens/common/src/services/useToggleVoteMutation';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { QuestionMenu } from './QuestionMenu/QuestionMenu';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  canAnswer?: boolean;
  take: number;
  showAnswered?: boolean;
};

export const QuestionsItem = ({
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

  const handleReactionClick = (content: string) => {
    mutation.mutate({ content, questionId: question.id });
  };

  const votesCount = question.counts.reduce(
    (prev, curr) => prev + curr._count,
    0,
  );

  return (
    <div className="card">
      <div className="card-body bg-base-300">
        <div className="card-title">
          <span>{votesCount}</span>
          <span>{question.content}</span>
          <QuestionMenu
            question={question}
            take={take}
            showAnswered={showAnswered}
          />
        </div>
      </div>
    </div>
  );
};
