import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { RoomForm } from '../RoomForm/RoomForm';

export const AddRoom = (): ReactElement => {
  const client = trpc.useContext();

  const mutation = trpc.proxy.room.add.useMutation({
    onSettled() {
      return client.invalidateQueries(['room.list']);
    },
  });

  return (
    <div className="card">
      <div className="card-body bg-base-300">
        <h2 className="card-title">Add room</h2>
        <RoomForm
          isLoading={mutation.isLoading}
          onSubmit={mutation.mutate}
          submitText="Add"
          error={mutation.error}
        />
      </div>
    </div>
  );
};
