import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import type { RoomsNavigatorParams } from '@tens/expo/routes/Router';
import { Box, Heading, Skeleton, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

export type RoomRow =
  | {
      key: string;
      isLoading: true;
    }
  | {
      key: string;
      isLoading: false;
      room: Room;
    };

type Props = {
  row: RoomRow;
};

export const RoomsItem = ({ row }: Props): ReactElement => {
  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  if (row.isLoading) {
    return <Skeleton height="24" />;
  }

  const handleItemPress = () => {
    navigation.navigate('Room', { roomId: row.room.id });
  };

  return (
    <Box bg="white" m={1}>
      <TouchableOpacity onPress={handleItemPress}>
        <VStack padding={4} space={2}>
          <Heading>{row.room.title}</Heading>
          <Text>{row.room.description}</Text>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
};
