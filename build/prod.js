const path = require('path');
/* eslint-disable */
const { merge: webpackMerge } = require('webpack-merge');
const baseConfig = require('./base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const { entries, distRootPath } = require('./config.js');

const resolvePath = (dir) => {
    return path.resolve(__dirname, '../', dir);
};

let prodMode = process.env.NODE_ENV === 'production';
let proConfig = webpackMerge(baseConfig, {
    // mode: 'production',
    entry: entries,
    output: {
        path: distRootPath,
        publicPath: '../', /* 这是本地测试用的 */
        // publicPath: absolutePath /* 实际项目 用这个 */
        filename: '[name].[contenthash:7].js',
        environment: {
            arrowFunction: false, /* https://webpack.docschina.org/configuration/output/ */
            const: false,
        },
    },
    optimization: {
        moduleIds: 'deterministic' /* 对比于 hashed 来说，它会导致更小的文件 bundles。数字值的长度会被选作用于填满最多 80%的 id 空间 */
    },
    module: {
        rules: [
            {
                test: /\.(sc|c|sa)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // "postcss-preset-env", // postcss-preset-env 包含autoprefixer （npm install postcss-preset-env --save-dev）
                                        // "postcss-nested",
                                        "autoprefixer", // css 加前缀
                                    ],
                                ],
                            },
                        }
                    },
                    'sass-loader'
                ]
            },
        ]
    },

    plugins: [
        /* 把CSS提取成一个单独的文件 */
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:7].css'
        }),
        new WebpackManifestPlugin({
            publicPath: '',
            filter: function (FileDescriptor) {
                return FileDescriptor.isChunk;
            }
        })
    ]
});
/* 添加JS和CSS插件 */
if (prodMode) {
    // 通过提供一个或多个定制过的 TerserPlugin 实例， 覆盖默认压缩工具(minimizer)
    proConfig.optimization.minimize = true;
    proConfig.optimization.minimizer = [
        new TerserPlugin({
            parallel: true, /* 使用多进程并行运行来提高构建速度 */
            test: /\.js$/,
            terserOptions: {
                compress: {
                    drop_console: true /* 过滤console.log */
                }
                // https://github.com/terser/terser#minify-options
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            },
        }),
        new CssMinimizerPlugin({
            test: /\.css$/g,
            parallel: true
        }),
    ];
} else {
    proConfig.devtool = 'source-map';
}

let pages = Object.keys(entries);
pages.forEach(item => {
    if (item.indexOf('\/commons\/') === -1) {
        proConfig.plugins.push(new HtmlWebpackPlugin({
            filename: resolvePath(`dist/${item}.html`),
            template: resolvePath(`src/pages/${item}.html`),
            chunks: ['manifest', 'vendor', item]
        }));
    }
});

module.exports = proConfig;
