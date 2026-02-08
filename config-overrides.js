const { override } = require('customize-cra');

module.exports = override((config) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        // If you need other Node.js core modules, add them here.
    };

    return config;
});