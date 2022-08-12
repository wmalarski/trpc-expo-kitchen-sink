import Head from 'next/head';
import { ReactElement } from 'react';
import { Login } from '../modules/Login/Login';
import { usePublicPath } from '../utils/paths';

const LoginPage = (): ReactElement => {
  usePublicPath();

  return (
    <>
      <Head>
        <title>Login - Tens QA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
};

export default LoginPage;
