import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { RoomsNavigatorParams } from '@tens/expo/routes/Router';
import { trpc } from '@tens/expo/utils/trpc';
import { Actionsheet, DeleteIcon, useToast } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  room: Room;
  onClose: () => void;
};

export const DeleteRoomAction = ({ room, onClose }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.RoomHeading' });

  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const toast = useToast();

  const trpcContext = trpc.useContext();

  const mutation = trpc.useMutation(['room.delete'], {
    onSuccess: () => {
      onClose();
      trpcContext.invalidateQueries(['room.list']);
      navigation.navigate('Rooms');
    },
    onError: (error) => {
      toast.show({
        title: t('error'),
        description: error.message,
      });
    },
  });

  const handlePress = () => {
    mutation.mutate({ id: room.id });
  };

  return (
    <Actionsheet.Item
      leftIcon={<DeleteIcon mt={1} />}
      isDisabled={mutation.isLoading}
      onPress={handlePress}
    >
      {t('deleteRoom')}
    </Actionsheet.Item>
  );
};
