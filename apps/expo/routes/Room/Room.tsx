import type { StackScreenProps } from '@react-navigation/stack';
import { VStack } from 'native-base';
import { ReactElement, useState } from 'react';
import { SafeAreaView } from 'react-native';
import type { RoomsNavigatorParams } from '../Router';
import { AddQuestion } from './AddQuestion/AddQuestion';
import { Questions } from './Questions/Questions';
import { RoomHeading } from './RoomHeading/RoomHeading';

export const Room = ({
  route,
}: StackScreenProps<RoomsNavigatorParams, 'Room'>): ReactElement => {
  const roomId = route.params.roomId;

  const [showAnswered, setShowAnswered] = useState<boolean>();

  return (
    <SafeAreaView>
      <VStack p={4} space={2} height="full">
        <RoomHeading roomId={roomId} onShowAnsweredChange={setShowAnswered} />
        <Questions roomId={roomId} showAnswered={showAnswered} />
        <AddQuestion roomId={roomId} />
      </VStack>
    </SafeAreaView>
  );
};
