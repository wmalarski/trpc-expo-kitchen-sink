import { trpc } from '@tens/expo/utils/trpc';
import {
  Center,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import { ReactElement } from 'react';
import { RoomActions } from './RoomActions/RoomActions';

type Props = {
  roomId: string;
  onShowAnsweredChange: (showAnswered?: boolean) => void;
};

export const RoomHeading = ({
  roomId,
  onShowAnsweredChange,
}: Props): ReactElement => {
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
    <HStack>
      <VStack space={2} width="4/5">
        <Heading>{query.data.title}</Heading>
        <Text>{query.data.description}</Text>
      </VStack>
      <Flex align="flex-end" flexGrow={1}>
        <RoomActions
          room={query.data}
          onShowAnsweredChange={onShowAnsweredChange}
        />
      </Flex>
    </HStack>
  );
};
