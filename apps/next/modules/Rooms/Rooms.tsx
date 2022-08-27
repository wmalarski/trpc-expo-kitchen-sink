import { ErrorMessage } from '@tens/next/components/ErrorMessage/ErrorMessage';
import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Pagination } from '../../components/Pagination/Pagination';
import { RoomsItem } from './RoomsItem/RoomsItem';

const take = 10;

export const Rooms = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.List' });

  const router = useRouter();

  const page = parseInt(router.query.page?.toString() || '') || 0;

  const trpcContext = trpc.useContext();

  const query = trpc.proxy.room.page.useQuery(
    { take, skip: take * page },
    {
      onSuccess(data) {
        data.rooms.forEach((room) => {
          trpcContext.setQueryData(['room.get', { id: room.id }], room);
        });
      },
    },
  );

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      <div className="flex flex-col">
        <h2 className="p-2 text-2xl font-bold">{t('header')}</h2>
        <Loader />
      </div>
    );
  }

  if (query.status === 'error') {
    return (
      <ErrorMessage
        message={query.error.message}
        onReloadClick={() => query.refetch()}
      />
    );
  }

  const handlePaginationChange = (newPage: number) => {
    router.push({ query: { page: newPage } });
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="p-2 text-2xl font-bold">{t('header')}</h2>
      <div className="flex flex-col gap-2">
        {query.data.rooms.map((room) => (
          <RoomsItem key={room.id} room={room} />
        ))}
      </div>
      <Pagination
        count={query.data.count}
        current={page}
        onChange={handlePaginationChange}
        pageSize={take}
      />
    </div>
  );
};
