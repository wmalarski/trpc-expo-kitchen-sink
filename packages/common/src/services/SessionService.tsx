import {
  Session,
  SupabaseClient,
  UserCredentials,
} from '@supabase/supabase-js';
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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

const SessionServiceContext = createContext<SessionServiceContextValue>({
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
  supabase: SupabaseClient;
};

const sessionService = (
  supabase: SupabaseClient,
  session: Session | null,
): SessionServiceContextValue => {
  return session
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
};

export const SessionServiceProvider = ({
  children,
  supabase,
}: Props): ReactElement => {
  const [value, setValue] = useState<SessionServiceContextValue>({
    status: 'idle',
  });

  useEffect(() => {
    setValue(sessionService(supabase, supabase.auth.session()));

    supabase.auth.onAuthStateChange((_event, session) => {
      setValue(sessionService(supabase, session));
    });
  }, [supabase]);

  return (
    <SessionServiceContext.Provider value={value}>
      {children}
    </SessionServiceContext.Provider>
  );
};
