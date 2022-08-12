import Head from 'next/head';
import { ReactElement } from 'react';
import { PostList } from '../modules/PostList/PostList';
import { useProtectedPath } from '../utils/paths';

const IndexPage = (): ReactElement => {
  useProtectedPath();

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostList />
    </>
  );
};

export default IndexPage;
