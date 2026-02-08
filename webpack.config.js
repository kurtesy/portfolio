const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'static/js/[name].[contenthash:8].js',
            chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
            assetModuleFilename: 'static/media/[name].[hash][ext]',
            clean: true,
            publicPath: '/',
        },
        devtool: isProduction ? false : 'cheap-module-source-map',
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            compress: true,
            port: 3000,
            hot: true,
            historyApiFallback: true, // Important for single-page apps
            // proxy: [
            //     {
            //         context: ['/api'],
            //         target: 'https://medium.com', // Or any other RSS feed source
            //         changeOrigin: true,
            //         pathRewrite: { '^/api': '' },
            //         onProxySetup: (proxy) => {
            //             proxy.on('proxyReq', (proxyReq, req, res) => {
            //                 // Medium requires a user-agent header.
            //                 proxyReq.setHeader('user-agent', 'Mozilla/5.0');
            //             });
            //         },
            //     },
            // ],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.(css|scss|sass)$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            fallback: {
                stream: require.resolve('stream-browserify'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                assert: require.resolve('assert/'),
                url: require.resolve('url/'),
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                favicon: './public/favicon.ico',
            }),
            isProduction && new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
            new NodePolyfillPlugin(),
        ].filter(Boolean),
        optimization: {
            minimize: isProduction,
            minimizer: [
                `...`, // This extends existing minimizers (like terser-webpack-plugin)
                new CssMinimizerPlugin(),
            ],
        },
    };
};