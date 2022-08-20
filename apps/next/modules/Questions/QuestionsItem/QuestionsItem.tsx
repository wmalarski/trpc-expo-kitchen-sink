import type { InferQueryOutput } from '@tens/api/src/types';
import { ReactElement } from 'react';
import { QuestionMenu } from './QuestionMenu/QuestionMenu';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  canAnswer?: boolean;
  take: number;
};

export const QuestionsItem = ({ question }: Props): ReactElement => {
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
          <QuestionMenu />
        </div>
      </div>
    </div>
  );
};
