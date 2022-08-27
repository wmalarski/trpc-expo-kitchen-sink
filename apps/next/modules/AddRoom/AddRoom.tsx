import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { paths } from '../../utils/paths';
import { RoomForm } from '../RoomForm/RoomForm';

export const AddRoom = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.AddRoom' });

  const router = useRouter();

  const trpcContext = trpc.useContext();

  const mutation = trpc.proxy.room.add.useMutation({
    onSettled() {
      return trpcContext.invalidateQueries(['room.list']);
    },
    onSuccess(data) {
      router.push(paths.room(data.room.id));
    },
  });

  return (
    <div className="card">
      <div className="card-body bg-base-300">
        <h2 className="card-title">{t('header')}</h2>
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
