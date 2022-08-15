import { useRouter } from 'next/dist/client/router';
import NextError from 'next/error';
import { ReactElement } from 'react';
import { useProtectedPath } from '../../utils/paths';
import { trpc } from '../../utils/trpc';

const RoomPage = (): ReactElement => {
  useProtectedPath();

  const id = useRouter().query.id as string;
  const query = trpc.proxy.room.get.useQuery({ id });

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

export default RoomPage;
