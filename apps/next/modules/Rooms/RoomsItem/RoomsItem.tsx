import { Room } from '@prisma/client';
import Link from 'next/link';
import { ReactElement } from 'react';
import { paths } from '../../../utils/paths';

type Props = {
  room: Room;
};

export const RoomsItem = ({ room }: Props): ReactElement => {
  return (
    <article key={room.id} className="card">
      <div className="card-body bg-gray-900">
        <h3 className="card-title">{room.title}</h3>
        <Link href={paths.room(room.id)}>
          <a>View more</a>
        </Link>
      </div>
    </article>
  );
};
