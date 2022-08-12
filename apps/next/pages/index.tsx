import { useSessionStatus } from '@tens/common/src/services/SessionService';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Loader } from '../modules/Loader/Loader';
import { Logout } from '../modules/Logout/Logout';
import { PostList } from '../modules/PostList/PostList';
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
          <PostList />
          <Logout />
        </>
      )}
    </>
  );
};

export default IndexPage;
