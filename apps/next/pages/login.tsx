import { useSessionStatus } from '@tens/common/src/services/SessionService';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Loader } from '../modules/Loader/Loader';
import { Login } from '../modules/Login/Login';
import { usePublicPath } from '../utils/paths';

const LoginPage = (): ReactElement => {
  usePublicPath();

  const sessionStatus = useSessionStatus();

  return (
    <>
      <Head>
        <title>Login - Tens QA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus === 'idle' && <Loader />}
      {sessionStatus === 'anon' && <Login />}
    </>
  );
};

export default LoginPage;
