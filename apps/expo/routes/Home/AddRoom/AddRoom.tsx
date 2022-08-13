import { AddIcon, Fab, Modal } from 'native-base';
import { ReactElement, useState } from 'react';
import { AddRoomForm } from './AddRoomForm/AddRoomForm';

export const AddRoom = (): ReactElement => {
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
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Add room</Modal.Header>
          <Modal.Body>
            <AddRoomForm onCancel={handleClose} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
