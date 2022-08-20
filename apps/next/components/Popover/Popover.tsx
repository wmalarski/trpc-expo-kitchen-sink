import { ReactElement, ReactNode, RefObject, useRef } from 'react';
import { DismissButton, FocusScope, useOverlay } from 'react-aria';

type Props = {
  popoverRef?: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Popover = ({
  children,
  isOpen,
  onClose,
  popoverRef: inputRef,
}: Props): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = inputRef || ref;

  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true,
    },
    popoverRef,
  );

  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={popoverRef}
        className="bg-base-300 absolute mt-1 min-w-full border-2 border-solid border-gray-50"
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
};
