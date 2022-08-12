import { useSessionStatus } from '@tens/common/src/services/SessionService';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const paths = {
  index: '/',
  login: '/login',
};

export const usePublicPath = () => {
  const router = useRouter();

  const sessionStatus = useSessionStatus();

  useEffect(() => {
    if (sessionStatus !== 'auth') return;
    router.push(paths.index);
  }, [sessionStatus, router]);
};

export const useProtectedPath = () => {
  const router = useRouter();

  const sessionStatus = useSessionStatus();

  useEffect(() => {
    if (sessionStatus !== 'anon') return;
    router.push(paths.login);
  }, [sessionStatus, router]);
};
