import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { InferQueryOutput } from '@tens/api/src/types';
import { ReactElement } from 'react';
import { FiMenu } from 'react-icons/fi';
import { AnswerAction } from './AnswerAction/AnswerAction';
import { DeleteQuestion } from './DeleteQuestion/DeleteQuestion';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const QuestionMenu = ({
  question,
  take,
  showAnswered,
}: Props): ReactElement => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="btn btn-circle btn-sm">
        <FiMenu />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu bg-base-100 rounded-box w-52 p-2 shadow">
          <DropdownMenu.Arrow className="fill-base-100" />
          <ul className="menu">
            <li>
              <AnswerAction question={question} />
            </li>
            <li>
              <DeleteQuestion
                question={question}
                take={take}
                showAnswered={showAnswered}
              />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
