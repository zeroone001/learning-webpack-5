# 压缩配置



## 安装



分别是CSS和JS的压缩



```shell
npm install terser-webpack-plugin -D
npm install css-minimizer-webpack-plugin  -D
```



```js
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
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
            })
        ]
    },
}

```

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                test: /\.css$/g,
                parallel: true /* https://github.com/webpack-contrib/css-minimizer-webpack-plugin#parallel */
            }),
        ]
    }
}

```

