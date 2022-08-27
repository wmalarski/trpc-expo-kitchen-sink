import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { InferQueryOutput } from '@tens/api/src/types';
import { useAnswerQuestionMutation } from '@tens/common/src/services/useAnswerQuestionMutation';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement, useRef } from 'react';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
};

export const AnswerAction = ({ question }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const toastRef = useRef<ToastElement>(null);

  const mutation = useAnswerQuestionMutation({
    question,
    trpc,
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const handlePress = () => {
    mutation.mutate({ answered: !question.answered, id: question.id });
  };

  return (
    <>
      <DropdownMenu.Item className="" onClick={handlePress}>
        {question.answered ? t('markAsUnanswered') : t('markAsAnswered')}
      </DropdownMenu.Item>
      <Toast ref={toastRef} variant="error" title={t('error')}>
        {mutation.error?.message}
      </Toast>
    </>
  );
};
