import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@tens/expo/utils/trpc';
import {
  Button,
  Flex,
  FormControl,
  TextArea,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(1),
});

type AddQuestionFormData = z.infer<typeof schema>;

type Props = {
  roomId: string;
  onClose: () => void;
};

export const AddQuestionForm = ({ roomId, onClose }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.AddQuestion' });

  const toast = useToast();

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['question.add'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['question.list']);
      toast.show({ description: t('successDesc'), title: t('successTitle') });
      onClose();
    },
    onError: () => {
      toast.show({ description: t('errorDesc'), title: t('errorTitle') });
    },
  });

  const { control, handleSubmit } = useForm<AddQuestionFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { content: '' },
  });

  const onSubmit = (input: AddQuestionFormData) => {
    mutation.mutate({ ...input, roomId });
  };

  return (
    <VStack space={2}>
      <Controller
        control={control}
        name="content"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isRequired={true} isInvalid={!!formState.errors.content}>
            <VStack space={2}>
              <FormControl.Label>{t('questionLabel')}</FormControl.Label>
              <TextArea
                autoCompleteType="cc-csc"
                placeholder={t('questionPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.content?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />
      <Flex justify="flex-end" direction="row">
        <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
          {t('cancel')}
        </Button>
        <Button disabled={mutation.isLoading} onPress={handleSubmit(onSubmit)}>
          {t('save')}
        </Button>
      </Flex>
    </VStack>
  );
};
