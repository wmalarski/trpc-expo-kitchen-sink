import { trpc } from '@tens/expo/utils/trpc';
import { Center, Heading, Spinner, Text, VStack } from 'native-base';
import { ReactElement } from 'react';

type Props = {
  roomId: string;
};

export const RoomHeading = ({ roomId }: Props): ReactElement => {
  const roomQuery = trpc.useQuery(['room.get', { id: roomId }]);

  if (roomQuery.status === 'loading' || roomQuery.status === 'idle') {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (roomQuery.status === 'error') {
    return <Text>{roomQuery.error.message}</Text>;
  }

  return (
    <VStack space={2}>
      <Heading>{roomQuery.data.title}</Heading>
      <Heading size="md">{roomQuery.data.description}</Heading>
    </VStack>
  );
};
