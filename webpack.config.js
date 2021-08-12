
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');

const { VueLoaderPlugin } = require('vue-loader/dist/index');

const argv = require('yargs').argv;
// const yargs = require('yargs/yargs')
// const { hideBin } = require('yargs/helpers')
// const argv = yargs(hideBin(process.argv)).argv;

console.log('argv', argv);
let prodMode = argv.mode === 'production'; // 生产环境

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        contentBase: path.resolve(__dirname, 'dist')
    },
    // 暂时先不压缩
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserWebpackPlugin()
    //     ]
    // },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.ts/,
                use: [
                    'ts-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            },
            {
                test: /\.(sc|c|sa)ss$/,
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
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
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'assets/[name].[hash:7].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: path.resolve(__dirname, 'dist/index.html'),
            title: '123',
            // 压缩
            minify: {
                collapseWhitespace: true, // 去掉空格
                removeComments: true // 去掉注释
            }
        }),
        
        new MiniCssExtractPlugin({
            // filename: path.resolve(__dirname, 'dist/css/index.css')
            filename: 'css/[name].[contenthash:7].css'
        }),
        new OptimizeCssAssetsWebpackPlugin(),
    ]
}