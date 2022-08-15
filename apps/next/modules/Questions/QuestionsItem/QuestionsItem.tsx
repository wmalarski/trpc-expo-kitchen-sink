import type { InferQueryOutput } from '@tens/api/src/types';
import { ReactElement } from 'react';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
  cursor?: string;
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
        </div>
      </div>
    </div>
  );
};
