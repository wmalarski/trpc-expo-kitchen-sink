import { SessionServiceProvider } from '@tens/common/src/services/SessionService';
import { trpc } from '@tens/next/utils/trpc';
import { appWithTranslation } from 'next-i18next';
import { AppType } from 'next/dist/shared/lib/utils';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/globals.css';
import { supabase } from '../utils/supabase';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionServiceProvider supabase={supabase}>
      <Component {...pageProps} />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </SessionServiceProvider>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp as any));
