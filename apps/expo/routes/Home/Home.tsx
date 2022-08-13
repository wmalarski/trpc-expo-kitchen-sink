import { Button } from 'native-base';
import { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { trpc } from '../../utils/trpc';

export const Home = (): ReactElement => {
  const [title] = useState('');
  const [description] = useState('');

  const addRoomMutation = trpc.useMutation(['room.add']);

  const handleSignOutPress = () => {
    addRoomMutation.mutate({
      description,
      title,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          disabled={addRoomMutation.isLoading}
          onPress={handleSignOutPress}
        >
          Create room
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
