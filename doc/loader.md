# loader



因为webpack只能处理commonjs规范的js文件，所以处理别的文件的时候，需要用别的loader





## 静态资源构建

Webpack5 提供了内置的静态资源构建能力，我们不需要安装额外的loader



* asset/source ——功能相当于 raw-loader。

* asset/inline——功能相当于 url-loader，若想要设置编码规则，可以在 generator 中设置 dataUrl。具体可参见[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fasset-modules%2F%23custom-data-uri-generator)。

* asset/resource——功能相当于 file-loader。项目中的资源打包统一采用这种方式，得益于团队项目已经完全铺开使用了 HTTP2 多路复用的相关特性，我们可以将资源统一处理成文件的形式，在获取时让它们能够并行传输，避免在通过编码的形式内置到 js 文件中，而造成资源体积的增大进而影响资源的加载。

* asset—— 默认会根据文件大小来选择使用哪种类型，当文件小于 8 KB 的时候会使用 asset/inline，否则会使用 asset/resource。也可手动进行阈值的设定，具体可以参考[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fasset-modules%2F%23general-asset-type)。

```js
// webpack5 内置了loader
module.exports = {
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset',
                generator: {
                    // [ext]前面自带"."
                    filename: 'assets/[name].[hash:7][ext]'
                }
            }
        ]
    }
}
```

```js
// webpack4
module.exports= {
    module: {
        rules: [
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
            }
        ]
    }
}
```



### 处理样式

vue 环境下使用  `vue-style-loader` 

非vue环境下使用  ` style-loader `



```
npm install vue-style-loader  css-loader postcss-loader sass sass-loader autoprefixer -D
```



### html

`npm install html-loader -D`

