import { trpc } from '@tens/next/utils/trpc';
import { AppType } from 'next/dist/shared/lib/utils';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
