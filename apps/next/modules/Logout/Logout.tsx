import { useAuthService } from '@tens/common/src/services/SessionService';
import { paths } from '@tens/next/utils/paths';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useMutation } from 'react-query';

export const Logout = (): ReactElement => {
  const router = useRouter();

  const authService = useAuthService();

  const mutation = useMutation(authService.signOut, {
    onSuccess: () => {
      router.push(paths.login);
    },
  });

  const handleSignOutPress = () => {
    mutation.mutate();
  };

  return (
    <button
      className={clsx('btn btn-primary', { loading: mutation.isLoading })}
      disabled={mutation.isLoading}
      onClick={handleSignOutPress}
    >
      Sign Out
    </button>
  );
};
