import type { InferQueryOutput } from '@tens/api/src/types';
import { useVoteSubscription } from '@tens/common/src/services/useVoteSubscription';
import { supabase } from '@tens/next/utils/supabase';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { QuestionMenu } from './QuestionMenu/QuestionMenu';
import { ReactionButton } from './ReactionButton/ReactionButton';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  canAnswer?: boolean;
  take: number;
  showAnswered?: boolean;
};

export const QuestionsItem = ({
  question: initialQuestion,
  take,
  showAnswered,
}: Props): ReactElement => {
  useVoteSubscription({
    questionId: initialQuestion.id,
    voteId: initialQuestion.vote?.id,
    supabase,
    trpc,
  });

  const query = trpc.proxy.question.get.useQuery(
    { questionId: initialQuestion.id },
    {
      initialData: initialQuestion,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const question = query.data || initialQuestion;

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
          {votesCount ? (
            <div className="flex">
              {question.counts.map(
                ({ _count, content }) =>
                  _count > 0 && (
                    <ReactionButton
                      key={content}
                      reaction={content}
                      question={question}
                    />
                  ),
              )}
            </div>
          ) : null}
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
