import { useAuthService } from '@tens/common/src/services/SessionService';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useMutation } from 'react-query';
import { paths } from '../../utils/paths';

export const Logout = (): ReactElement => {
  const router = useRouter();

  const authService = useAuthService();

  const signOutMutation = useMutation(authService.signOut, {
    onSuccess: () => {
      router.push(paths.login);
    },
  });

  const handleSignOutPress = () => {
    signOutMutation.mutate();
  };

  return (
    <button disabled={signOutMutation.isLoading} onClick={handleSignOutPress}>
      Sign Out
    </button>
  );
};
