import { AddIcon, Fab, Modal } from 'native-base';
import { ReactElement, useState } from 'react';
import { AddQuestionForm } from './AddQuestionForm/AddQuestionForm';

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPress = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Fab
        icon={<AddIcon />}
        onPress={handleOpenPress}
        renderInPortal={true}
        shadow={2}
        size="lg"
      />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add question</Modal.Header>
          <Modal.Body>
            <AddQuestionForm roomId={roomId} onClose={handleClose} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
