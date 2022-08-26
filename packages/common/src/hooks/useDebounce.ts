import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { useMemo } from 'react';
import { useEvent } from './useEvent';

export const useDebounce = <T, R>(
  callback: (arg: T) => R,
  delay: number,
): DebouncedFunc<(arg: T) => R> => {
  const callbackMemoized = useEvent(callback);

  return useMemo(
    () => debounce(callbackMemoized, delay),
    [callbackMemoized, delay],
  );
};
