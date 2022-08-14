import { trpc } from '@tens/expo/utils/trpc';
import { Flex, Heading, HStack, Skeleton, Text, VStack } from 'native-base';
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
      <HStack>
        <VStack space={2} width="4/5">
          <Skeleton.Text lines={1} _line={{ height: '8' }} />
          <Skeleton.Text lines={2} />
        </VStack>
        <Flex align="flex-end" flexGrow={1}>
          <Skeleton borderRadius="full" width="10" height="10" />
        </Flex>
      </HStack>
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
