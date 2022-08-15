import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RoomForm, RoomFormData } from '@tens/expo/modules/RoomForm/RoomForm';
import type { RoomsNavigatorParams } from '@tens/expo/routes/Router';
import { trpc } from '@tens/expo/utils/trpc';
import { AddIcon, Box, Fab, Modal, useDisclose, useToast } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const AddRoom = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.AddRoom' });

  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const { isOpen, onClose, onOpen } = useDisclose(false);

  const toast = useToast();

  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['room.add'], {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['room.list']);
      queryClient.setQueryData(['room.get', { id: data.room.id }], data.room);
      navigation.navigate('Room', { roomId: data.room.id });
    },
    onError: () => {
      toast.show({ description: t('errorDesc'), title: t('errorTitle') });
    },
  });

  const handleSubmit = (input: RoomFormData) => {
    mutation.mutate(input);
  };

  return (
    <Box bottom={0} right={0} position="absolute">
      <Fab
        icon={<AddIcon />}
        onPress={onOpen}
        renderInPortal={false}
        shadow={2}
        size="lg"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('header')}</Modal.Header>
          <Modal.Body>
            <RoomForm
              isLoading={mutation.isLoading}
              onCancel={onClose}
              onSubmit={handleSubmit}
              submitText={t('save')}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};
