// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
