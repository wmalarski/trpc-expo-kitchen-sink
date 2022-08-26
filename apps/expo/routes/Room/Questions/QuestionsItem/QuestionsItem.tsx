import type { InferQueryOutput } from '@tens/api/src/types';
import { useAuthService } from '@tens/common/src/services/SessionService';
import { useVoteSubscription } from '@tens/common/src/services/useVoteSubscription';
import { reactions } from '@tens/common/src/utils/reactions';
import { supabase } from '@tens/expo/utils/supabase';
import { trpc } from '@tens/expo/utils/trpc';
import {
  Actionsheet,
  Box,
  Divider,
  HStack,
  Pressable,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import { memo, ReactElement } from 'react';
import { AnsweredActions } from './AnsweredActions/AnsweredActions';
import { DeleteAction } from './DeleteAction/DeleteAction';
import { ReactionButton } from './ReactionButton/ReactionButton';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  canAnswer: boolean;
  showAnswered?: boolean;
  take: number;
};

const QuestionsItemInner = ({
  question: initialQuestion,
  canAnswer,
  showAnswered,
  take,
}: Props): ReactElement => {
  const authService = useAuthService();
  const userId = authService.session.user?.id;

  const { isOpen, onOpen, onClose } = useDisclose();

  useVoteSubscription({
    questionId: initialQuestion.id,
    voteId: initialQuestion.vote?.id,
    supabase,
    trpc,
  });

  const query = trpc.useQuery(
    ['question.get', { questionId: initialQuestion.id }],
    {
      initialData: initialQuestion,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const question = query.data || initialQuestion;

  const votesCount = question.counts.reduce(
    (prev, curr) => prev + curr._count,
    0,
  );

  return (
    <Box bg="white" m={1}>
      <Pressable onPress={onOpen}>
        <HStack>
          <Box
            width={2}
            bg={question.answered ? 'success.400' : 'coolGray.400'}
            height="100%"
          />
          <VStack
            flexGrow={1}
            padding={4}
            bg={isOpen ? 'blueGray.100' : undefined}
          >
            <HStack space={2}>
              <Text fontWeight="medium">{votesCount}</Text>
              <Text>{question.content}</Text>
            </HStack>
            {votesCount ? (
              <HStack w="100%" justifyContent="flex-start" space={1} pt={2}>
                {question.counts.map(
                  (count) =>
                    count._count > 0 && (
                      <ReactionButton
                        key={count.content}
                        reaction={count.content}
                        question={question}
                      />
                    ),
                )}
              </HStack>
            ) : null}
          </VStack>
        </HStack>
      </Pressable>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content borderTopRadius="0">
          <HStack w="100%" justifyContent="center" space={1} pb={4}>
            {reactions.map((reaction) => (
              <ReactionButton
                key={reaction}
                reaction={reaction}
                question={question}
              />
            ))}
          </HStack>
          <Divider />
          {canAnswer && <AnsweredActions question={question} />}
          {(canAnswer || userId === question.userId) && (
            <DeleteAction
              question={question}
              take={take}
              showAnswered={showAnswered}
            />
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export const QuestionsItem = memo(QuestionsItemInner);
