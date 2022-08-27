import type { InferQueryOutput } from '@tens/api/src/types';
import { useAnswerQuestionMutation } from '@tens/common/src/services/useAnswerQuestionMutation';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet, CheckIcon, MinusIcon, useToast } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
};

export const AnsweredActions = ({ question }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const toast = useToast();

  const mutation = useAnswerQuestionMutation({
    question,
    trpc,
    onError: (error) => {
      toast.show({
        title: t('error'),
        description: error.message,
      });
    },
  });

  const handlePress = () => {
    mutation.mutate({ answered: !question.answered, id: question.id });
  };

  return (
    <Actionsheet.Item
      justifyContent="center"
      startIcon={
        question.answered ? <MinusIcon mt={1} /> : <CheckIcon mt={1} />
      }
      isDisabled={mutation.isLoading}
      onPress={handlePress}
    >
      {question.answered ? t('markAsUnanswered') : t('markAsAnswered')}
    </Actionsheet.Item>
  );
};
