const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

// Minimal, dependency-free replacement for copy-webpack-plugin.
// Recursively copies everything from `public/` (except index.html and
// favicon.ico, which HtmlWebpackPlugin already handles) into the output
// directory so that static assets referenced by absolute paths
// (css/js/images/fonts, resumeData.json, manifest.json, CNAME, etc.)
// actually exist in the production build.
class CopyPublicAssetsPlugin {
    constructor({ from, to, ignore = [] }) {
        this.from = from;
        this.to = to;
        this.ignore = ignore;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('CopyPublicAssetsPlugin', () => {
            this.copyRecursive(this.from, this.to);
        });
    }

    copyRecursive(src, dest) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        fs.mkdirSync(dest, { recursive: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (this.ignore.includes(entry.name)) {
                continue;
            }

            if (entry.isDirectory()) {
                this.copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

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
            port: 3049,
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
            new CopyPublicAssetsPlugin({
                from: path.resolve(__dirname, 'public'),
                to: path.resolve(__dirname, 'build'),
                ignore: ['index.html', 'favicon.ico'],
            }),
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