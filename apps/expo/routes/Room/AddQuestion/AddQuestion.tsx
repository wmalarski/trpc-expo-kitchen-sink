import { AddIcon, Box, Fab, Modal, useDisclose } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AddQuestionForm } from './AddQuestionForm/AddQuestionForm';

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.AddQuestion' });

  const { isOpen, onClose, onOpen } = useDisclose();

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
            <AddQuestionForm roomId={roomId} onClose={onClose} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};
