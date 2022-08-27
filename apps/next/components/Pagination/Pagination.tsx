import clsx from 'clsx';
import { ReactElement } from 'react';

type Props = {
  current: number;
  count: number;
  pageSize: number;
  onChange: (page: number) => void;
};

export const Pagination = ({
  count,
  current,
  pageSize,
  onChange,
}: Props): ReactElement => {
  const maxPage = Math.ceil(Math.max(count - 1, 0) / pageSize);

  console.log({ count, maxPage, pageSize });

  const pages = [
    0,
    Math.max(current - 1, 0),
    current,
    Math.min(current + 1, maxPage - 1),
    maxPage - 1,
  ].reduce((prev, curr) => {
    if (prev.indexOf(curr) < 0) prev.push(curr);
    return prev;
  }, [] as number[]);

  return (
    <div className="btn-group flex w-full flex-row justify-center">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={clsx('btn', { 'btn-active': page === current })}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
};
