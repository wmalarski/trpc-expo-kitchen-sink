import { VStack } from 'native-base';
import { ReactElement } from 'react';
import { AddRoom } from './AddRoom/AddRoom';

export const Home = (): ReactElement => {
  return (
    <VStack p={4} pt={16} space={2}>
      <AddRoom />
    </VStack>
  );
};
