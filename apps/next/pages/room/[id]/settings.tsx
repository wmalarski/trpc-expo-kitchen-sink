import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { Loader } from '@tens/next/components/Loader/Loader';
import { Navbar } from '@tens/next/modules/Navbar/Navbar';
import { RoomHeading } from '@tens/next/modules/RoomHeading/RoomHeading';
import { useProtectedPath } from '@tens/next/utils/paths';
import { withTranslations } from '@tens/next/utils/withTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { ReactElement } from 'react';

const RoomSettingsPage = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Navigation' });

  useProtectedPath();

  const sessionStatus = useSessionStatus();

  const roomId = useRouter().query.id as string;

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
            <RoomHeading roomId={roomId} />
          </div>
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withTranslations();

export default RoomSettingsPage;
