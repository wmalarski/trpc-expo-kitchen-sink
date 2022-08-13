import { trpc } from '@tens/expo/utils/trpc';
import { Center, Heading, Spinner, Text, VStack } from 'native-base';
import { ReactElement } from 'react';

type Props = {
  roomId: string;
};

export const RoomHeading = ({ roomId }: Props): ReactElement => {
  const query = trpc.useQuery(['room.get', { id: roomId }]);

  if (query.status === 'loading' || query.status === 'idle') {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (query.status === 'error') {
    return <Text>{query.error.message}</Text>;
  }

  return (
    <VStack space={2}>
      <Heading>{query.data.title}</Heading>
      <Text>{query.data.description}</Text>
    </VStack>
  );
};
