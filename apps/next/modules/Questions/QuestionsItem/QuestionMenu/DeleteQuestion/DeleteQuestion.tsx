import type { InferQueryOutput } from '@tens/api/src/types';
import { useDeleteQuestionMutation } from '@tens/common/src/services/useDeleteQuestionMutation';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement, useRef } from 'react';
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

  const toastRef = useRef<ToastElement>(null);

  const mutation = useDeleteQuestionMutation({
    question,
    take,
    trpc,
    showAnswered,
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const handleClick = () => {
    mutation.mutate({ id: question.id });
  };

  return (
    <>
      <button
        className="btn gap-2"
        disabled={mutation.isLoading}
        onClick={handleClick}
      >
        <FiTrash />
        {t('delete')}
      </button>
      <Toast ref={toastRef} variant="error" title={t('error')}>
        {mutation.error?.message}
      </Toast>
    </>
  );
};
