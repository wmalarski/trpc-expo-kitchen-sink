import * as Toast from '@radix-ui/react-toast';
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
      <Toast.Provider>
        <Component {...pageProps} />
        <Toast.Viewport className="fixed bottom-0 right-0 z-50 flex w-96 max-w-full flex-col gap-4 p-4" />
      </Toast.Provider>
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </SessionServiceProvider>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp as any));
