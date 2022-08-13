import { useAuthService } from '@tens/common/src/services/SessionService';
import { Button, VStack } from 'native-base';
import { ReactElement } from 'react';
import { useMutation } from 'react-query';
import { RoomList } from './RoomList/RoomList';

export const Account = (): ReactElement => {
  const authService = useAuthService();

  const signOutMutation = useMutation(authService.signOut);

  const handleSignOutPress = () => {
    signOutMutation.mutate();
  };

  return (
    <VStack p={4} space={4}>
      <RoomList />
      <Button disabled={signOutMutation.isLoading} onPress={handleSignOutPress}>
        Sign Out
      </Button>
    </VStack>
  );
};
