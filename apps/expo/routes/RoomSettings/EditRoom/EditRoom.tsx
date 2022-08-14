import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RoomForm, RoomFormData } from '@tens/expo/modules/RoomForm/RoomForm';
import { trpc } from '@tens/expo/utils/trpc';
import { Heading, useToast } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import type { RoomsNavigatorParams } from '../../Router';

type Props = {
  room: Room;
};

export const EditRoom = ({ room }: Props): ReactElement => {
  const { t } = useTranslation('common', {
    keyPrefix: 'RoomSettings.EditRoom',
  });

  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const toast = useToast();

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['room.update'], {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(['room.list']);
      const updated = { ...room, variables };
      queryClient.setQueryData(['room.get', { id: room.id }], updated);
      toast.show({ description: t('successDesc'), title: t('successTitle') });
    },
    onError: () => {
      toast.show({ description: t('errorDesc'), title: t('errorTitle') });
    },
  });

  const handleSubmit = (input: RoomFormData) => {
    mutation.mutate({ ...input, id: room.id });
  };

  const handleCancel = () => {
    navigation.navigate('Room', { roomId: room.id });
  };

  return (
    <SafeAreaView>
      <Heading size="md">{t('header')}</Heading>
      <RoomForm
        defaultValues={room}
        isLoading={mutation.isLoading}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitText={t('save')}
      />
    </SafeAreaView>
  );
};
