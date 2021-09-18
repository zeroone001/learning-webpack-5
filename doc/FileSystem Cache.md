# FileSystem Cache

Webpack5 之前，我们会使用 [cache-loader](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcache-loader) 缓存一些性能开销较大的 loader ，或者是使用 [hard-source-webpack-plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmzgoddard%2Fhard-source-webpack-plugin) 为模块提供一些中间缓存。在 Webpack5 之后，默认就为我们集成了一种自带的缓存能力（[对 module 和 chunks 进行缓存](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fother-options%2F%23cache)）。通过如下配置，即可在二次构建时提速



## Cache 

缓存模块和chunk,改善构建速度



```js
module.exports = {
    cache: {
        type: 'filesystem',
        buildDependencies: {
            // This makes all dependencies of this file - build dependencies
            config: [__filename],
            // 默认情况下 webpack 与 loader 是构建依赖。
        },
    },
}
```



