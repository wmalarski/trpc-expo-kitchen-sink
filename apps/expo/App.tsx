import { NativeBaseProvider } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Router } from './routes/Router';
import { ApiService } from './services/ApiService';
import { SessionServiceProvider } from './services/SessionService';

const App = (): ReactElement => {
  return (
    <SessionServiceProvider>
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
