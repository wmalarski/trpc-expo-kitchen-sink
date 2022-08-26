import type { InferQueryOutput } from '@tens/api/src/types';
import { useToggleVoteMutation } from '@tens/common/src/services/useToggleVoteMutation';
import { trpc } from '@tens/expo/utils/trpc';
import { Text } from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  reaction: string;
};

export const ReactionButton = ({ question, reaction }: Props): ReactElement => {
  const mutation = useToggleVoteMutation({
    question,
    trpc,
  });

  const handleReactionClick = () => {
    mutation.mutate({ content: reaction, questionId: question.id });
  };

  const counts = question.counts.find((votes) => votes.content === reaction);
  const isSelected = question.vote?.content === reaction;

  return (
    <TouchableOpacity onPress={handleReactionClick}>
      <Text bg={isSelected ? 'gray.200' : 'gray.100'} p={2} borderRadius="full">
        {`${reaction}${counts?._count ? ` ${counts._count}` : ''}`}
      </Text>
    </TouchableOpacity>
  );
};
