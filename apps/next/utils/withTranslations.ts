import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const withTranslations = (
  next: GetServerSideProps = () => Promise.resolve({ props: {} }),
): GetServerSideProps => {
  return async (context) => {
    const current = await next(context);

    return {
      ...current,
      props: {
        ...('props' in current ? current.props : {}),
        ...(await serverSideTranslations(context.locale || 'en', ['common'])),
      },
    };
  };
};
