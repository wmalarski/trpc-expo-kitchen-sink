import { Room } from '@prisma/client';
import { paths } from '@tens/next/utils/paths';
import Link from 'next/link';
import { ReactElement } from 'react';

type Props = {
  room: Room;
};

export const RoomsItem = ({ room }: Props): ReactElement => {
  return (
    <article key={room.id} className="card">
      <div className="card-body bg-base-300">
        <Link href={paths.room(room.id)}>
          <a>
            <h3 className="card-title">{room.title}</h3>
          </a>
        </Link>
      </div>
    </article>
  );
};
