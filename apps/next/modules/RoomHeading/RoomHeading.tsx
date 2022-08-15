import { trpc } from '@tens/next/utils/trpc';
import NextError from 'next/error';
import { ReactElement } from 'react';

type Props = {
  roomId: string;
};

export const RoomHeading = ({ roomId }: Props): ReactElement => {
  const query = trpc.proxy.room.get.useQuery({ id: roomId });

  if (query.status === 'error') {
    const statusCode = query.error.data?.httpStatus ?? 500;
    return <NextError title={query.error.message} statusCode={statusCode} />;
  }

  if (query.status === 'loading' || query.status === 'idle') {
    return <>Loading...</>;
  }

  return (
    <>
      <h1>{query.data.title}</h1>
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(query.data, null, 4)}</pre>
    </>
  );
};
