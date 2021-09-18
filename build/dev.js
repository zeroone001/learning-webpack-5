const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const baseConfig = require('./base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const { entries, distRootPath, publicPath, server } = require('./config.js');

const resolvePath = (dir) => {
    return path.resolve(__dirname, '../', dir);
};
let devConfig = webpackMerge(baseConfig, {
    mode: 'development',
    // target: 'web', /* 默认就是web不需要加 */
    entry: entries,
    output: {
        path: distRootPath,
        publicPath,
        filename: '[name].js'
    },
    stats: 'errors-only',
    devtool: 'source-map', /* 推荐使用高质量SourceMaps进行生产构建 */
    cache: {
        type: 'filesystem',
        buildDependencies: {
            // This makes all dependencies of this file - build dependencies
            config: [__filename],
            // 默认情况下 webpack 与 loader 是构建依赖。
        },
    },
    devServer: {
        host: '::',
        port: server.port, /* 端口号 */
        compress: true, /* 启用 gzip compression */
        open: [`http://localhost:${server.port}`], /* 告诉 dev-server 在服务器已经启动后打开浏览器 */
        hot: true, /* 启用 webpack 的 热模块替换 */
        client: {
            progress: true, /* 在浏览器中以百分比显示编译进度 */
            overlay: {
                errors: true,
                warnings: false,
            }, /* 当出现编译错误或警告时，在浏览器中显示全屏覆盖 */
        },
        /* 
            提供在服务器内部执行所有其他中间件之前执行自定义中间件的能力
            这可以用来定义自定义处理程序 
        */
        onBeforeSetupMiddleware: function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }
            devServer.app.get('/', (req, res) => {
                var resHtml = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>index</title>
                </head>
                <body>
                    <ul>`;
                for (let key in entries) {
                    if (key.indexOf('\/commons\/') === -1) {
                        resHtml += `<li><a href="${key}.html">${key}.html</a></li>`;
                    }
                }
                resHtml += `</ul>
                </body>
                </html>`;
                res.send(resHtml);
            });
        },
        onListening: function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(sc|c|sa)ss$/,
                exclude: /node_modules/,
                use: [
                    'vue-style-loader',
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
        new ESLintPlugin({
            fix: true, /* 自动帮助修复 */
            extensions: ['js', 'json', 'coffee', 'vue'],
            exclude: 'node_modules'
        }),
        new StylelintPlugin({
            // fix: false,
            // extensions: ['css', 'scss', 'sass'],
            files:['./src/**/*.(scss|sass|css|vue)'],
            exclude: 'node_modules'
        })
    ]
});

// 根据对应入口文件生成html文件
let pages = Object.keys(entries);
pages.forEach(item => {
    if (item.indexOf('\/commons\/') === -1) {
        devConfig.plugins.push(new HtmlWebpackPlugin({
            filename: resolvePath(`dist/${item}.html`),
            template: resolvePath(`src/pages/${item}.html`),
            chunks: ['manifest', 'vendor', item]
        }));
    }
});

module.exports = devConfig;
