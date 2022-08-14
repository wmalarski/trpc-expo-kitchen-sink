import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuthService } from '@tens/common/src/services/SessionService';
import type { RoomsNavigatorParams } from '@tens/expo/routes/Router';
import {
  Actionsheet,
  Box,
  CheckIcon,
  CircleIcon,
  Divider,
  InfoIcon,
  QuestionIcon,
  ShareIcon,
  ThreeDotsIcon,
  useDisclose,
} from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { DeleteRoomAction } from './DeleteRoomAction/DeleteRoomAction';

type Props = {
  room: Room;
  onShowAnsweredChange: (showAnswered?: boolean) => void;
};

export const RoomActions = ({
  room,
  onShowAnsweredChange,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.RoomHeading' });

  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const authService = useAuthService();
  const userId = authService.session.user?.id;

  const { isOpen, onOpen, onClose } = useDisclose();

  const handleRoomSettingsPress = () => {
    navigation.navigate('RoomSettings', { roomId: room.id });
  };

  return (
    <Box>
      <TouchableOpacity onPress={onOpen}>
        <Box
          bg={isOpen ? 'gray.300' : 'gray.200'}
          color="black"
          p={3}
          borderRadius="full"
        >
          <ThreeDotsIcon />
        </Box>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content borderTopRadius="0">
          <Actionsheet.Item startIcon={<ShareIcon mt={1} />}>
            {t('copyLink')}
          </Actionsheet.Item>
          <Divider />
          <Actionsheet.Item
            onPress={() => onShowAnsweredChange()}
            startIcon={<CircleIcon mt={1} />}
          >
            {t('showAll')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => onShowAnsweredChange(true)}
            startIcon={<CheckIcon mt={1} />}
          >
            {t('showAnswered')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => onShowAnsweredChange(false)}
            startIcon={<QuestionIcon mt={1} />}
          >
            {t('showUnanswered')}
          </Actionsheet.Item>
          {room.userId === userId && (
            <>
              <Divider />
              <DeleteRoomAction room={room} onClose={onClose} />
              <Actionsheet.Item
                onPress={handleRoomSettingsPress}
                startIcon={<InfoIcon mt={1} />}
              >
                {t('roomSettings')}
              </Actionsheet.Item>
            </>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};
