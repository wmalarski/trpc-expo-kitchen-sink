import { SessionServiceProvider } from '@tens/common/src/services/SessionService';
import { NativeBaseProvider } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Router } from './routes/Router';
import { ApiService } from './services/ApiService';
import { supabase } from './utils/supabase';

const App = (): ReactElement => {
  return (
    <SessionServiceProvider supabase={supabase}>
      <ApiService>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <Router />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </ApiService>
    </SessionServiceProvider>
  );
};

export default App;
