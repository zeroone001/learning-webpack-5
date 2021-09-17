# stats 对象

## webpack4

```js
module.exports = {
    devServer: {
        stats: {
            colors: true,
            chunks: false,
            children: false,
            entrypoints: false,
            modules: false
        }
    }
}
```

## webpack5

```js
module.exports = {
    stats: 'errors-only',
}
```

## 官网地址

[官网地址stats](https://webpack.docschina.org/configuration/stats/)