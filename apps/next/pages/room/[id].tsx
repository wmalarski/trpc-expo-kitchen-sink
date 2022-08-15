import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { ReactElement } from 'react';
import { Questions } from '../../modules/Questions/Questions';
import { RoomHeading } from '../../modules/RoomHeading/RoomHeading';
import { useProtectedPath } from '../../utils/paths';

const RoomPage = (): ReactElement => {
  useProtectedPath();

  const roomId = useRouter().query.id as string;

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoomHeading roomId={roomId} />
      <Questions roomId={roomId} />
    </>
  );
};

export default RoomPage;
