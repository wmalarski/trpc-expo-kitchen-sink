import { SessionServiceProvider } from '@tens/common/src/services/SessionService';
import { trpc } from '@tens/next/utils/trpc';
import { AppType } from 'next/dist/shared/lib/utils';
import { I18nextProvider } from 'react-i18next';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/globals.css';
import i18next from '../utils/i18next';
import { supabase } from '../utils/supabase';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <I18nextProvider i18n={i18next}>
      <SessionServiceProvider supabase={supabase}>
        <Component {...pageProps} />
        {process.env.NODE_ENV !== 'production' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SessionServiceProvider>
    </I18nextProvider>
  );
};

export default trpc.withTRPC(MyApp);
