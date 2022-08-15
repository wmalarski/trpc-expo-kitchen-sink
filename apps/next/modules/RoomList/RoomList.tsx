import { trpc } from '@tens/next/utils/trpc';
import Link from 'next/link';
import { ReactElement } from 'react';
import { AddRoom } from './AddRoom/AddRoom';

export const RoomList = (): ReactElement => {
  const client = trpc.useContext();

  const postsQuery = trpc.proxy.room.list.useQuery(
    { skip: 0, take: 20 },
    {
      onSuccess(data) {
        data.forEach((post) => {
          client.setQueryData(['room.get', { id: post.id }], post);
        });
      },
    },
  );

  return (
    <>
      <h1>Welcome to your tRPC starter!</h1>
      <p>
        Check <a href="https://trpc.io/docs">the docs</a> whenever you get
        stuck, or ping <a href="https://twitter.com/alexdotjs">@alexdotjs</a> on
        Twitter.
      </p>
      <h2>
        Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>
      {postsQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <Link href={`/post/${item.id}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}
      <AddRoom />
    </>
  );
};
