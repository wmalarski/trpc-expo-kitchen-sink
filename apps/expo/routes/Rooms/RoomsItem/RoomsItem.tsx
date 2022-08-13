import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { Box, Heading, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import type { RoomsNavigatorParams } from '../../Router';

type Props = {
  room: Room;
};

export const RoomsItem = ({ room }: Props): ReactElement => {
  const navigation = useNavigation<NavigationProp<RoomsNavigatorParams>>();

  const handleItemPress = () => {
    navigation.navigate('Room', { roomId: room.id });
  };

  return (
    <Box bg="white" m={1}>
      <TouchableOpacity onPress={handleItemPress}>
        <VStack padding={4} space={2}>
          <Heading>{room.title}</Heading>
          <Text>{room.description}</Text>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
};
