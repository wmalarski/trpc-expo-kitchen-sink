import { StackScreenProps } from '@react-navigation/stack';
import { trpc } from '@tens/expo/utils/trpc';
import { Flex, Heading, HStack, Skeleton, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
import type { RoomsNavigatorParams } from '../Router';

export const RoomSettings = ({
  route,
}: StackScreenProps<RoomsNavigatorParams, 'Room'>): ReactElement => {
  const roomId = route.params.roomId;

  const query = trpc.useQuery(['room.get', { id: roomId }]);

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      <SafeAreaView>
        <HStack>
          <VStack space={2} width="4/5">
            <Skeleton.Text lines={1} _line={{ height: '8' }} />
            <Skeleton.Text lines={2} />
          </VStack>
          <Flex align="flex-end" flexGrow={1}>
            <Skeleton borderRadius="full" width="10" height="10" />
          </Flex>
        </HStack>
      </SafeAreaView>
    );
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <VStack space={2} width="4/5">
        <Heading>{query.data.title}</Heading>
        <Text>{query.data.description}</Text>
      </VStack>
    </SafeAreaView>
  );
};
