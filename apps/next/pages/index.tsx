import { useSessionStatus } from '@tens/common/src/services/SessionService';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Loader } from '../components/Loader/Loader';
import { AddRoom } from '../modules/AddRoom/AddRoom';
import { Logout } from '../modules/Logout/Logout';
import { Rooms } from '../modules/Rooms/Rooms';
import { useProtectedPath } from '../utils/paths';

const IndexPage = (): ReactElement => {
  useProtectedPath();

  const sessionStatus = useSessionStatus();

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus === 'idle' && <Loader />}
      {sessionStatus === 'auth' && (
        <>
          <Rooms />
          <AddRoom />
          <Logout />
        </>
      )}
    </>
  );
};

export default IndexPage;
