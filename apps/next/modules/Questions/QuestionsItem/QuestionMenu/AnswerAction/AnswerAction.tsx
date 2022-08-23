import type { InferQueryOutput } from '@tens/api/src/types';
import { useAnswerQuestionMutation } from '@tens/common/src/services/useAnswerQuestionMutation';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const AnswerAction = ({
  question,
  showAnswered,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const mutation = useAnswerQuestionMutation({
    question,
    take,
    trpc,
    showAnswered,
  });

  const handlePress = () => {
    mutation.mutate({ answered: !question.answered, id: question.id });
  };

  return (
    <button className="btn" onClick={handlePress}>
      {question.answered ? t('markAsUnanswered') : t('markAsAnswered')}
    </button>
  );
};
