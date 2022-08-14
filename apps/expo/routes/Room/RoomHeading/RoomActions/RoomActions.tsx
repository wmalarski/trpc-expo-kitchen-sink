import { Room } from '@prisma/client';
import { useAuthService } from '@tens/common/src/services/SessionService';
import {
  Actionsheet,
  Box,
  CheckIcon,
  CircleIcon,
  Divider,
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
};

export const RoomActions = ({ room }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.RoomHeading' });

  const authService = useAuthService();
  const userId = authService.session.user?.id;

  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <>
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
          <Actionsheet.Item startIcon={<CircleIcon mt={1} />}>
            {t('showAll')}
          </Actionsheet.Item>
          <Actionsheet.Item startIcon={<CheckIcon mt={1} />}>
            {t('showAnswered')}
          </Actionsheet.Item>
          <Actionsheet.Item startIcon={<QuestionIcon mt={1} />}>
            {t('showUnanswered')}
          </Actionsheet.Item>
          {room.userId === userId && (
            <>
              <Divider />
              <DeleteRoomAction room={room} onClose={onClose} />
            </>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
