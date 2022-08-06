module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: ['@babel/plugin-proposal-unicode-property-regex'],
  };
};
