# learning-webpack-5

学习webpack@5相关知识, 基于vue@3.x

## 安装

```js
npm i webpack@5.44.0 webpack-cli@4 webpack-manifest-plugin webpack-merge -D
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


### 处理样式

因为webpack只能处理commonjs规范的js文件，所以处理别的文件的时候，需要用别的loader

`npm install style-loader css-loader postcss-loader sass sass-loader autoprefixer -D`

### 清除打包文件

`npm i clean-webpack-plugin -D`

### 处理图片等文件

`npm install url-loader file-loader -D`

### 创建HTML文件

`npm install html-webpack-plugin -D`

### 开发环境下服务器配置

`npm install webpack-dev-server -D`

```js
devServer: {
    port: 3000,
    hot: true,
    open: true,
    contentBase: path.resolve(__dirname, 'dist')
},
```

### 环境变量

以 cross-env 的方式来设置环境变量, 因为他可以跨终端进行设置

`npm install cross-env -D`

#### 获取环境变量

命令加参数 `--mode=development`
ps: 这里注意yargs的版本问题，如果使用下面的方式，建议用yargs@13
`const argv = require('yargs').argv;` 获取参数

### 打包压缩

### 提取CSS文件&压缩CSS

`npm install mini-css-extract-plugin optimize-css-assets-webpack-plugin -D`

```js
// 提取CSS文件
new MiniCssExtractPlugin({
    // filename: path.resolve(__dirname, 'dist/css/index.css')
    filename: 'css/[name].[contenthash:7].css'
})
// 压缩CSS
new OptimizeCssAssetsWebpackPlugin()
```

### 压缩JS

`npm install terser-webpack-plugin -D`

```js
optimization: {
    minimize: true,
    minimizer: [
        new TerserWebpackPlugin()
    ]
},
```

### 加入TS支持

`npm install typescript ts-loader -D`

### 加入VUE@3.x

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

## 参考资料

[https://juejin.cn/post/6924180659829211143](https://juejin.cn/post/6924180659829211143)

[https://github.com/zxpsuper/createVue](https://github.com/zxpsuper/createVue)

[中文官网](https://webpack.docschina.org/configuration/)