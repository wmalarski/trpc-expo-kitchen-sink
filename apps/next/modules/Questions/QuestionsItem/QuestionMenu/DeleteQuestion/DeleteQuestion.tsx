import type { InferQueryOutput } from '@tens/api/src/types';
import { useDeleteQuestionMutation } from '@tens/common/src/services/useDeleteQuestionMutation';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { FiTrash } from 'react-icons/fi';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const DeleteQuestion = ({
  question,
  showAnswered,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const mutation = useDeleteQuestionMutation({
    question,
    take,
    trpc,
    showAnswered,
  });

  const handleClick = () => {
    mutation.mutate({ id: question.id });
  };

  return (
    <button
      className="btn gap-2"
      disabled={mutation.isLoading}
      onClick={handleClick}
    >
      <FiTrash />
      {t('delete')}
    </button>
  );
};
