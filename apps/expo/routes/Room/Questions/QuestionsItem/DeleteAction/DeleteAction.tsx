import type { InferQueryOutput } from '@tens/api/src/types';
import { useDeleteQuestionMutation } from '@tens/common/src/services/useDeleteQuestionMutation';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet, DeleteIcon, useToast } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const DeleteAction = ({
  question,
  showAnswered,
  take,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  const toast = useToast();

  const mutation = useDeleteQuestionMutation({
    question,
    take,
    trpc,
    showAnswered,
    onError: (error) => {
      toast.show({
        title: t('error'),
        description: error.message,
      });
    },
  });

  const handlePress = () => {
    mutation.mutate({ id: question.id });
  };

  return (
    <Actionsheet.Item
      leftIcon={<DeleteIcon mt={1} />}
      isDisabled={mutation.isLoading}
      onPress={handlePress}
    >
      {t('delete')}
    </Actionsheet.Item>
  );
};
