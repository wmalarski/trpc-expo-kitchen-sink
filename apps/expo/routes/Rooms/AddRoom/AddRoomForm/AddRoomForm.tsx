import { zodResolver } from '@hookform/resolvers/zod';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { trpc } from '@tens/expo/utils/trpc';
import {
  Button,
  Flex,
  FormControl,
  Input,
  TextArea,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { RoomsNavigatorParams } from '../../../Router';

const schema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(0),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onCancel: () => void;
};

export const AddRoomForm = ({ onCancel }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.AddRoom' });

  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const toast = useToast();

  const queryClient = trpc.useContext();

  const addRoomMutation = trpc.useMutation(['room.add'], {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['room.list']);
      queryClient.setQueryData(['room.get', { id: data.room.id }], data.room);
      toast.show({ description: t('successDesc'), title: t('successTitle') });
      navigation.navigate('Room', { roomId: data.room.id });
    },
    onError: () => {
      toast.show({ description: t('errorDesc'), title: t('errorTitle') });
    },
  });

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (input: FormData) => {
    addRoomMutation.mutate(input);
  };

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
          disabled={addRoomMutation.isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {t('save')}
        </Button>
      </Flex>
    </VStack>
  );
};
