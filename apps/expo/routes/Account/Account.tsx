import { Button } from 'native-base';
import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useMutation } from 'react-query';
import { useAuthService } from '../../services/SessionService';

export const Account = (): ReactElement => {
  const authService = useAuthService();

  const signOutMutation = useMutation(authService.signOut);

  const handleSignOutPress = () => {
    signOutMutation.mutate();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          disabled={signOutMutation.isLoading}
          onPress={handleSignOutPress}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
