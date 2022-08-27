import type { InferQueryOutput } from '@tens/api/src/types';
import { useToggleVoteMutation } from '@tens/common/src/services/useToggleVoteMutation';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { trpc } from '@tens/next/utils/trpc';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement, useRef } from 'react';

type Props = {
  reaction: string;
  question: InferQueryOutput<'question.list'>['questions'][0];
};

export const ReactionButton = ({ reaction, question }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const toastRef = useRef<ToastElement>(null);

  const mutation = useToggleVoteMutation({
    question,
    trpc,
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const handleReactionClick = () => {
    mutation.mutate({ content: reaction, questionId: question.id });
  };

  const counts = question.counts.find((votes) => votes.content === reaction);
  const isSelected = question.vote?.content === reaction;

  return (
    <>
      <button
        className={clsx('btn bg-base-200 btn-circle btn-sm', {
          'bg-base-300': isSelected,
        })}
        onClick={handleReactionClick}
      >
        {`${reaction}${counts?._count ? ` ${counts._count}` : ''}`}
      </button>
      <Toast ref={toastRef} variant="error" title={t('error')}>
        {mutation.error?.message}
      </Toast>
    </>
  );
};
