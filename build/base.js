const path = require('path');
// const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const { entries } = require('./config.js');

const resolvePath = (dir) => {
    return path.resolve(__dirname, '../', dir);
};

let baseConfig = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss', '.json', '.vue'],
        modules: [
            'node_modules',
            resolvePath('lib')
        ],
        alias: {
            'src': resolvePath('src'),
            'assets': resolvePath('src/assets')
        }
    },
    performance: {
        maxAssetSize: 400000, /* 资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积(单位: bytes)，控制 webpack 何时生成性能提示  */
        maxEntrypointSize: 400000  /* 入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。*/
    },
    module: {
        rules: [
            // .vue 这个配置一定要放在js 之前，这是有顺序的
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            // babel
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            // ts
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                    // {
                    //     loader: 'ts-loader', /* https://github.com/TypeStrong/ts-loader */
                    //     options: {
                    //         // 指定特定的ts编译配置，为了区分脚本的ts配置
                    //         configFile: path.resolve(__dirname, '../tsconfig.json'),
                    //         appendTsSuffixTo: [/\.vue$/],
                    //         transpileOnly: true, /* 只做语言转换，而不做类型检查, 这里如果不设置成TRUE，就会HMR 报错 */
                    //         happyPackMode: true,
                    //     }
                    // }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset', /* 当文件小于 8 KB 的时候会使用 asset/inline，否则会使用 asset/resource */
                generator: {
                    // [ext]前面自带"."
                    filename: 'assets/[name].[hash:7][ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|svg)(\?[a-z0-9#]*)?$/i,
                type: 'asset',
                generator: {
                    // [ext]前面自带"."
                    filename: 'fonts/[name].[hash:7][ext]'
                }
            },
            
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            
        ]
    },
    // optimization 优化
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            // maxSize: 0, /* 无效的 */
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 2,
            name: false,
            cacheGroups: {
                defaultVendors: {
                    filename: 'vendor.js',
                    reuseExistingChunk: true,
                    minChunks: Object.keys(entries).length,
                    test: /[\\/](node_modules)|(lib)[\\/]/
                }
            }
        },
        /* 为每个入口添加一个只含有 runtime 的额外 chunk */
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        // new webpack.ProvidePlugin({
        //     process: 'process/browser',
        // }),
    ]
};

module.exports = baseConfig;
