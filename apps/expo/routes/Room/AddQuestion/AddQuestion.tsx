import { AddIcon, Box, Fab, Modal } from 'native-base';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddQuestionForm } from './AddQuestionForm/AddQuestionForm';

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.AddQuestion' });

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPress = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box bottom={0} right={0} position="absolute">
      <Fab
        icon={<AddIcon />}
        onPress={handleOpenPress}
        renderInPortal={false}
        shadow={2}
        size="lg"
      />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('header')}</Modal.Header>
          <Modal.Body>
            <AddQuestionForm roomId={roomId} onClose={handleClose} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};
