import { Room } from '@prisma/client';
import { paths } from '@tens/next/utils/paths';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ReactElement } from 'react';

type Props = {
  room: Room;
};

export const RoomsItem = ({ room }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.List' });

  return (
    <article key={room.id} className="card">
      <div className="card-body bg-base-300 flex flex-row justify-between">
        <div>
          <h3 className="card-title">{room.title}</h3>
          <span>{room.description}</span>
        </div>
        <div>
          <Link href={paths.room(room.id)}>
            <a className="link">{t('showMore')}</a>
          </Link>
        </div>
      </div>
    </article>
  );
};
