import { Session, UserCredentials } from '@supabase/supabase-js';
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../utils/supabase';

type AuthService = {
  session: Session;
  signOut: () => Promise<void>;
};

type AnonService = {
  signIn: (credentials: UserCredentials) => Promise<void>;
  signUp: (credentials: UserCredentials) => Promise<void>;
};

type SessionServiceContextValue =
  | {
      status: 'idle';
    }
  | {
      status: 'auth';
      service: AuthService;
    }
  | {
      status: 'anon';
      service: AnonService;
    };

export const SessionServiceContext = createContext<SessionServiceContextValue>({
  status: 'idle',
});

export const useAuthService = (): AuthService => {
  const context = useContext(SessionServiceContext);
  if (context.status !== 'auth') {
    throw new Error('AuthService not defined');
  }
  return context.service;
};

export const useAnonService = (): AnonService => {
  const context = useContext(SessionServiceContext);
  if (context.status !== 'anon') {
    throw new Error('AnonService not defined');
  }
  return context.service;
};

export const useSessionStatus = (): SessionServiceContextValue['status'] => {
  const context = useContext(SessionServiceContext);
  return context.status;
};

export const useSession = (): Session | null => {
  const context = useContext(SessionServiceContext);
  return context.status === 'auth' ? context.service.session : null;
};

type Props = {
  children: ReactNode;
};

export const SessionServiceProvider = ({ children }: Props): ReactElement => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const value: SessionServiceContextValue = session
    ? {
        status: 'auth',
        service: {
          session,
          signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
          },
        },
      }
    : {
        status: 'anon',
        service: {
          signIn: async (credentials) => {
            const { error } = await supabase.auth.signIn(credentials);
            if (error) throw new Error(error.message);
          },
          signUp: async (credentials) => {
            const { error } = await supabase.auth.signUp(credentials);
            if (error) throw new Error(error.message);
          },
        },
      };

  return (
    <SessionServiceContext.Provider value={value}>
      {children}
    </SessionServiceContext.Provider>
  );
};
