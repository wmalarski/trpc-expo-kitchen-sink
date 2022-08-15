import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { Loader } from '@tens/next/components/Loader/Loader';
import { AddQuestion } from '@tens/next/modules/AddQuestion/AddQuestion';
import { Navbar } from '@tens/next/modules/Navbar/Navbar';
import { Questions } from '@tens/next/modules/Questions/Questions';
import { RoomHeading } from '@tens/next/modules/RoomHeading/RoomHeading';
import { useProtectedPath } from '@tens/next/utils/paths';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { ReactElement } from 'react';

const RoomPage = (): ReactElement => {
  useProtectedPath();

  const sessionStatus = useSessionStatus();

  const roomId = useRouter().query.id as string;

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus === 'idle' && <Loader />}
      {sessionStatus === 'auth' && (
        <>
          <Navbar />
          <div className="flex flex-col gap-2 p-4">
            <RoomHeading roomId={roomId} />
            <Questions roomId={roomId} />
            <AddQuestion roomId={roomId} />
          </div>
        </>
      )}
    </>
  );
};

export default RoomPage;
