import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { RoomsItem } from './RoomsItem/RoomsItem';

export const Rooms = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.List' });

  const client = trpc.useContext();

  const query = trpc.proxy.room.list.useQuery(
    { take: 20, cursor: null },
    {
      onSuccess(data) {
        data.rooms.forEach((post) => {
          client.setQueryData(['room.get', { id: post.id }], post);
        });
      },
    },
  );

  if (query.status === 'loading' || query.status === 'idle') {
    return <Loader />;
  }

  if (query.status === 'error') {
    return <span>{query.error.message}</span>;
  }

  return (
    <>
      <h2 className="p-2 text-2xl font-bold">{t('header')}</h2>
      <div className="flex flex-col gap-2">
        {query.data?.rooms.map((room) => (
          <RoomsItem key={room.id} room={room} />
        ))}
      </div>
    </>
  );
};
