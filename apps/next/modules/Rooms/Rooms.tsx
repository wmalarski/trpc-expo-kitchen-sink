import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { RoomsItem } from './RoomsItem/RoomsItem';

export const Rooms = (): ReactElement => {
  const client = trpc.useContext();

  const query = trpc.proxy.room.list.useQuery(
    { skip: 0, take: 20 },
    {
      onSuccess(data) {
        data.forEach((post) => {
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
      <h2>Posts</h2>
      {query.data?.map((room) => (
        <RoomsItem key={room.id} room={room} />
      ))}
    </>
  );
};
