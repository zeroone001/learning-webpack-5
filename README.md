# learning-webpack-5

学习webpack@5相关知识, 基于vue@3.x

## 准备工作



官网要求Node版本至少是 10.13.0 (LTS)，但是，经过自己的测试，V10.15.0都有报错，我直接升级成V14.x了



## 官方升级V4到V5的文档



[从 v4 升级到 v5](https://webpack.docschina.org/migrate/5/)



## 启动命令

--profile --progress  可以展示一个简单的性能曲线

```shell
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve --config ./build/dev.js --profile --progress",
    "build:debug": "cross-env NODE_ENV=development webpack --config ./build/prod.js --profile --progress --mode=development",
    "build": "cross-env NODE_ENV=production webpack --config ./build/prod.js --profile --progress --mode=production"
  },
```



## 安装

### webpack

```js
npm i webpack@5.44.0 webpack-cli@4 webpack-manifest-plugin webpack-merge -D
```

```js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { merge: webpackMerge } = require('webpack-merge');
const baseConfig = require('./base.js');

module.exports = webpackMerge(baseConfig, {
  plugins: [
    new WebpackManifestPlugin({
        publicPath: '',
        filter: function (FileDescriptor) {
            return FileDescriptor.isChunk;
        }
    })
  ]
})
```


### webpack-dev-server

`npm install webpack-dev-server@4 -D`


注意，webpack5版本下的，启动服务的命令已经不再是 `webpack-dev-server --config ./build/dev.js`

而是使用新的命令 `webpack serve --config ./build/dev.js`

```js
module.exports = {
  devServer: {
    host: '::',
    port: 8087, /* 端口号 */
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
   /* 
      我是配置了一个多页面的应用，所以加了这个，正常不需要加这个
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
  }
}
```

### ES6转ES5

```js
npm i babel-loader @babel/core @babel/preset-env -D

npm install @babel/plugin-transform-runtime -D
npm install  @babel/runtime @babel/runtime-corejs3 --save


// 下面这两个不用安装了
// 默认的Babel只⽀持let等⼀些基础的语法转换，Promise等特性无法转换，这时候需要借助@babel/polyfill，把es的新特性都装进来，来弥补低版本浏览器中缺失的特性。
npm i @babel/polyfill -D
/*
  配置babel  ------> .babelrc

  注意： 如果要配置corejs: 3的话，那么需要安装下面的
  
*/ 
npm i core-js@3 -D
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
        ),
        use: [
            'babel-loader'
        ]
      },
    ]
  }
}

```

## loader

### 处理样式

因为webpack只能处理commonjs规范的js文件，所以处理别的文件的时候，需要用别的loader

`npm install vue-style-loader style-loader css-loader postcss-loader sass sass-loader autoprefixer -D`

### html

`npm install html-loader -D`

### 创建HTML文件

`npm install html-webpack-plugin -D`

### 清除打包文件

`npm i clean-webpack-plugin -D`

### 处理图片等文件

不需要安装 file-loader 和 url-loader， webpack5内置好了

`npm install url-loader -D`

url-loader: 当文件大小达到一定要求的时候，可以将其处理成 base64 的 URIS ，内置 file-loader 
因为内置了file-loader, 所以 file-loader 就不需要安装了

webpack5： 提供了内置的静态资源构建能力，所以 `url-loader` 也不需要安装了



### 环境变量

以 cross-env 的方式来设置环境变量, 因为他可以跨终端进行设置

`npm install cross-env -D`

```js
// 使用
cross-env NODE_ENV=development 

// 获取
process.env.NODE_ENV
```




### yargs

获取命令行参数

用来配置自定义页面，启动服务，或者，自定义页面打包（因为我是配置了一个多页面的项目）

`npm i yargs@13 -D`

#### 获取命令参数

命令加参数 `--pages=demo1`
ps: 这里注意yargs的版本问题，如果使用下面的方式，建议用yargs@13
`const argv = require('yargs').argv;` 获取参数

```js
npm run dev --pages=demo1

// webpack.config.js
const argv = require('yargs').argv;
// log
console.log(argv.pages);
```






### chokidar

chokidar 可以用于监控文件、文件夹变化

`npm i chokidar --save-dev`

### 打包压缩

### 提取CSS文件 & 压缩CSS

`npm install mini-css-extract-plugin css-minimizer-webpack-plugin  -D`

[mini-css-extract-plugin github 地址](https://github.com/webpack-contrib/mini-css-extract-plugin)

#### 压缩CSS

webpack5 压缩CSS 使用 `css-minimizer-webpack-plugin` ---- [css-minimizer-webpack-plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin)


webpack4 压缩CSS 使用 `optimize-css-assets-webpack-plugin` ---- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)

```js
// 提取CSS文件
new MiniCssExtractPlugin({
    // filename: path.resolve(__dirname, 'dist/css/index.css')
    filename: 'css/[name].[contenthash:7].css'
})

```

### 压缩JS

`npm install terser-webpack-plugin -D`

```js
const TerserPlugin = require('terser-webpack-plugin');

optimization: {
    minimize: true,
    minimizer: [
        new TerserPlugin()
    ]
},
```

### ESlint & stylelint

`stylelint-webpack-plugin`

https://juejin.cn/post/6951649464637636622#heading-13

```shell
npm install eslint -D
npm install eslint-webpack-plugin -D

npm install stylelint --save-dev
npm install stylelint-webpack-plugin --save-dev
```

### eslint 的配置

真的超级简单，不要自己手动去配置




### typescript


`npm install typescript ts-loader -D`

### 加入VUE@3.x

webpack4的vue的编译模板是`vue-template-compiler`
webpack5的vue的编译模板是`@vue/compiler-sfc`

```js
npm install vue@next -S
npm install vue-loader@next @vue/compiler-sfc -D
```


### postcss-loader

[https://github.com/webpack-contrib/postcss-loader](https://github.com/webpack-contrib/postcss-loader)

功能： 
1. 把CSS解析为一个AST抽象语法树
2. 调用插件，处理抽象语法树，并且添加功能

### webpack-manifest-plugin

[https://github.com/shellscape/webpack-manifest-plugin](https://github.com/shellscape/webpack-manifest-plugin)

```js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const options = { ... };

module.exports = {
	// an example entry definition
	entry: [ 'app.js'	],
  ...
  plugins: [
    new WebpackManifestPlugin(options)
  ]
};

```

### optimization

```js
// 告知 webpack 当选择模块 id 时需要使用哪种算法
optimization: {
    moduleIds: 'deterministic' // 被哈希转化成的小位数值模块名。
},
```

### 环境支持

Node V10.13.0 以上版本

## 参考资料

[https://juejin.cn/post/6924180659829211143](https://juejin.cn/post/6924180659829211143)

[https://github.com/zxpsuper/createVue](https://github.com/zxpsuper/createVue)

[中文官网](https://webpack.docschina.org/configuration/)

## 优点

* 通过持久化硬盘缓存能力来提升构建性能
* 通过更好的算法来改进长期缓存（降低产物资源的缓存失效率）
* 通过更好的 Tree Shaking 能力和代码的生成逻辑来优化产物的大小
* 改善 web 平台的兼容性能力
* 清除了内部结构中，在 Webpack4 没有重大更新而引入一些新特性时所遗留下来的一些奇怪的 state
* 通过引入一些重大的变更为未来的一些特性做准备，使得能够长期的稳定在 Webpack5 版本上


workbox-webpack-plugin

Webpack5 移除了 Node.js Polyfill，将会导致一些包变得不可用（会在控制台输出 'XXX' is not defined），如果需要兼容 process 等 Nodejs Polyfill，则要安装相关的 Polyfill：process，并在 Plugin 中显式声明注入

```js
// webpack.config.js
{
    ...,
    plugins: [
        ...,
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
    ]
}

```