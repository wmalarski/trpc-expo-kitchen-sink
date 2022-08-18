import { Room } from '@prisma/client';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import type { RoomsNavigatorParams } from '@tens/expo/routes/Router';
import { Box, Heading, Text, VStack } from 'native-base';
import { memo, ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  room: Room;
};

const RoomsItemInner = ({ room }: Props): ReactElement => {
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

export const RoomsItem = memo(RoomsItemInner);
