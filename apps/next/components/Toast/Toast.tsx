import * as ToastPrimitive from '@radix-ui/react-toast';
import clsx from 'clsx';
import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useState,
} from 'react';

export type ToastElement = {
  publish: () => void;
};

type Props = ToastPrimitive.ToastProps & {
  variant: 'error' | 'info' | 'success' | 'warning';
};

const ToastInner = (
  props: Props,
  forwardedRef: ForwardedRef<ToastElement>,
): ReactElement => {
  const { children, title, variant, ...toastProps } = props;
  const [count, setCount] = useState(0);

  useImperativeHandle(forwardedRef, () => ({
    publish: () => setCount((count) => count + 1),
  }));

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ToastPrimitive.Root
          className="toast"
          key={index}
          title={title}
          {...toastProps}
        >
          <div
            className={clsx('alert', {
              'alert-info': variant === 'info',
              'alert-error': variant === 'error',
              'alert-success': variant === 'success',
              'alert-warning': variant === 'warning',
            })}
          >
            <ToastPrimitive.Title className="text-md font-semibold">
              {title}
            </ToastPrimitive.Title>
            <ToastPrimitive.Description className="text-sm">
              {children}
            </ToastPrimitive.Description>
            <ToastPrimitive.Close>Dismiss</ToastPrimitive.Close>
          </div>
        </ToastPrimitive.Root>
      ))}
    </>
  );
};

export const Toast = forwardRef(ToastInner);
