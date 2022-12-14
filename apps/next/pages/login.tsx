import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Loader } from '../components/Loader/Loader';
import { SendMagicLink } from '../modules/SendMagicLink/SendMagicLink';
import { SignIn } from '../modules/SignIn/SignIn';
import { usePublicPath } from '../utils/paths';
import { withTranslations } from '../utils/withTranslations';

const LoginPage = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Navigation' });

  usePublicPath();

  const sessionStatus = useSessionStatus();

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus === 'idle' && <Loader />}
      {sessionStatus === 'anon' && (
        <>
          <SendMagicLink />
          <SignIn />
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withTranslations();

export default LoginPage;
