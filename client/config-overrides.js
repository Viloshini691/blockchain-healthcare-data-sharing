// client/config-overrides.js
const path = require("path");

module.exports = function override(config) {
  // Ensure the fallback object exists
  config.resolve = config.resolve || {};
  config.resolve.fallback = Object.assign({}, config.resolve.fallback, {
    http: false,
    https: false,
    zlib: false,
    url: false,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/")
  });

  return config;
};
