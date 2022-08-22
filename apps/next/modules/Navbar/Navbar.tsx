import { paths } from '@tens/next/utils/paths';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Logout } from './Logout/Logout';

export const Navbar = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Navigation' });

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link href={paths.index} passHref>
          <a className="btn btn-ghost text-xl normal-case">{t('title')}</a>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content bg-base-300 rounded-box mt-3 w-52 p-2 shadow"
          >
            <li>
              <Logout />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
