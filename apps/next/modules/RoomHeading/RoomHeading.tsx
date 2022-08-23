import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import NextError from 'next/error';
import { ReactElement } from 'react';

type Props = {
  roomId: string;
};

export const RoomHeading = ({ roomId }: Props): ReactElement => {
  const query = trpc.proxy.room.get.useQuery(
    { id: roomId },
    { refetchOnWindowFocus: false },
  );

  if (query.status === 'error') {
    const statusCode = query.error.data?.httpStatus ?? 500;
    return <NextError title={query.error.message} statusCode={statusCode} />;
  }

  if (query.status === 'loading' || query.status === 'idle') {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="text-2xl font-bold">{query.data.title}</h1>
      <p>{query.data.description}</p>
    </div>
  );
};
