import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { paths } from '@tens/next/utils/paths';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement, useRef } from 'react';
import { RoomForm } from '../RoomForm/RoomForm';

export const AddRoom = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.AddRoom' });

  const router = useRouter();

  const toastRef = useRef<ToastElement>(null);

  const trpcContext = trpc.useContext();

  const mutation = trpc.proxy.room.add.useMutation({
    onSettled() {
      return trpcContext.invalidateQueries(['room.list']);
    },
    onSuccess(data) {
      router.push(paths.room(data.room.id));
    },
    onError: () => {
      toastRef.current?.publish();
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
        />
      </div>
      <Toast ref={toastRef} variant="error" title={t('errorTitle')}>
        {t('errorDesc')}
      </Toast>
    </div>
  );
};
