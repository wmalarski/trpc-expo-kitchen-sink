import { useAuthService } from '@tens/common/src/services/SessionService';
import { Button, VStack } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

export const Account = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Account' });

  const authService = useAuthService();

  const signOutMutation = useMutation(authService.signOut);

  const handleSignOutPress = () => {
    signOutMutation.mutate();
  };

  return (
    <VStack p={4} pt={12} space={4}>
      <Button disabled={signOutMutation.isLoading} onPress={handleSignOutPress}>
        {t('signOut')}
      </Button>
    </VStack>
  );
};
