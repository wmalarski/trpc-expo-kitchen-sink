import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  FormControl,
  Input,
  TextArea,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(0),
});

export type RoomFormData = z.infer<typeof schema>;

type Props = {
  defaultValues?: RoomFormData;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: RoomFormData) => void;
  submitText: string;
};

export const RoomForm = ({
  defaultValues,
  isLoading,
  onCancel,
  onSubmit,
  submitText,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'RoomForm' });

  const { control, handleSubmit } = useForm<RoomFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues || {
      title: '',
      description: '',
    },
  });

  return (
    <VStack space={2}>
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isRequired={true} isInvalid={!!formState.errors.title}>
            <VStack space={2}>
              <FormControl.Label>{t('nameLabel')}</FormControl.Label>
              <Input
                placeholder={t('namePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.title?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isInvalid={!!formState.errors.description}>
            <VStack space={2}>
              <FormControl.Label>{t('descriptionLabel')}</FormControl.Label>
              <TextArea
                autoCompleteType="cc-csc"
                placeholder={t('descriptionPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.description?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <Flex justify="flex-end" direction="row">
        <Button variant="ghost" colorScheme="blueGray" onPress={onCancel}>
          {t('cancel')}
        </Button>
        <Button
          disabled={isLoading}
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {submitText}
        </Button>
      </Flex>
    </VStack>
  );
};
