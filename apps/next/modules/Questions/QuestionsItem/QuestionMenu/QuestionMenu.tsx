import { Popover } from '@tens/next/components/Popover/Popover';
import { ReactElement, useState } from 'react';

export const QuestionMenu = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn m-1" onClick={() => setIsOpen(true)}>
        Click
      </label>
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow"
        >
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </Popover>
    </div>
  );
};
