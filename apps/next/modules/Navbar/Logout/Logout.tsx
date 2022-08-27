import { useAuthService } from '@tens/common/src/services/SessionService';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { paths } from '@tens/next/utils/paths';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactElement, useRef } from 'react';
import { useMutation } from 'react-query';

export const Logout = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Account' });

  const router = useRouter();

  const toastRef = useRef<ToastElement>(null);

  const authService = useAuthService();

  const mutation = useMutation(authService.signOut, {
    onSuccess: () => {
      router.push(paths.login);
    },
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const handleSignOutPress = () => {
    mutation.mutate();
  };

  return (
    <>
      <button
        className={clsx('btn', { loading: mutation.isLoading })}
        disabled={mutation.isLoading}
        onClick={handleSignOutPress}
      >
        {t('signOut')}
      </button>
      <Toast ref={toastRef} variant="error" title={t('error')}>
        {t('errorText')}
      </Toast>
    </>
  );
};
