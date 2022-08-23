import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { Loader } from '@tens/next/components/Loader/Loader';
import { AddRoom } from '@tens/next/modules/AddRoom/AddRoom';
import { Navbar } from '@tens/next/modules/Navbar/Navbar';
import { Rooms } from '@tens/next/modules/Rooms/Rooms';
import { useProtectedPath } from '@tens/next/utils/paths';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { ReactElement } from 'react';

const IndexPage = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Navigation' });

  useProtectedPath();

  const sessionStatus = useSessionStatus();

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus === 'idle' && <Loader />}
      {sessionStatus === 'auth' && (
        <>
          <Navbar />
          <div className="flex flex-col gap-2 p-4">
            <AddRoom />
            <Rooms />
          </div>
        </>
      )}
    </>
  );
};

export default IndexPage;
