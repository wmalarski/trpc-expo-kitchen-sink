import { VStack } from 'native-base';
import { ReactElement } from 'react';
import { AddRoom } from './AddRoom/AddRoom';
import { RoomList } from './RoomList/RoomList';

export const Home = (): ReactElement => {
  return (
    <VStack p={4} space={2}>
      <RoomList />
      <AddRoom />
    </VStack>
  );
};
