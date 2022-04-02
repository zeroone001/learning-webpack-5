const path = require('path');
// const autoprefixer = require('autoprefixer');
/* eslint-disable */ 
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const { entries } = require('./config.js');

const HelloPlugin = require('../plugins/hello');

const resolvePath = (dir) => {
    return path.resolve(__dirname, '../', dir);
};

let baseConfig = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss', '.json', '.vue'],
    modules: [
      'node_modules',
      resolvePath('lib'),
    ],
    alias: {
      'src': resolvePath('src'),
      'assets': resolvePath('src/assets')
    },
  },
  stats: {
    moduleTrace: false,
    loggingTrace: false,
    colors: true,
    chunks: false,
    children: false,
    entrypoints: false,
    modules: false,
    performance: false,
    logging: 'error', /* 仅显示错误 */
  },
  performance: {
      maxAssetSize: 400000, /* 资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积(单位: bytes)，控制 webpack 何时生成性能提示  */
      maxEntrypointSize: 400000,  /* 入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。*/
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
                filename: 'assets/[name].[hash:7][ext]',
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
          chunks: 'all', /* 可选的值：'async': 异步，即按需加载的模块。'all': 所有的模块，包括同步和异步。'initial': 初始加载的模块即同步模块 */
          minSize: 30000,  /* module超过该大小才会被split，默认30000。 */
          // maxSize: 0, /* 默认值0，代表不限制。 */ 
          minChunks: 1, /* module至少被多少chunk引用才会生成新chunk。 是minChunks不是minModules */
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
    // new HelloPlugin({
    //     template: '../index.html',
    //     filename: './index.html'
    // }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    // new webpack.ProvidePlugin({
    //     process: 'process/browser',
    // }),
  ],
};

module.exports = baseConfig;
