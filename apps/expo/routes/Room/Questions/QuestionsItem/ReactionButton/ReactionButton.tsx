import type { InferQueryOutput } from '@tens/api/src/types';
import { Text } from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
  reaction: string;
  onPress: () => void;
};

export const ReactionButton = ({
  question,
  reaction,
  onPress,
}: Props): ReactElement => {
  const counts = question.counts.find((votes) => votes.content === reaction);
  const isSelected = question.vote?.content === reaction;

  return (
    <TouchableOpacity onPress={onPress}>
      <Text bg={isSelected ? 'gray.200' : 'gray.100'} p={2} borderRadius="full">
        {`${reaction}${counts?._count ? ` ${counts._count}` : ''}`}
      </Text>
    </TouchableOpacity>
  );
};
