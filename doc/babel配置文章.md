# babel的配置有两种方案

### 背景

之前只是在公司项目里配置，没有汇总起来，周末的时候，在跟同事讨论了一下，把配置记下来

### 关于polyfill

* 其实core-js@3 和 @babel/polyfill 都是polyfill
* 在 Babel > 7.4.0 之前，通常我们会安装 babel-polyfill 或 @babel/polyfill来处理实例方法和ES+新增的内置函数
* 7.4.0之后, 我们只需要安装core-js@3来代替@babel/polyfill就可以了
* Babel7.4.0版本开始，babel/polyfill 已经被废弃，推荐直接使用core-js
* 其实polyfill本身就是stable版本的core-js和regenerator-runtime的合集

```js
import '@babel/polyfill';
// 等于上面的
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```
## 两种配置都要安装的依赖

```shell
npm i babel-loader @babel/core @babel/preset-env -D
```

## 一，正常配置

首先装一下依赖

```shell
npm i core-js@3 -S
```

```js
// 先下载依赖 npm i core-js@3 -D
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8", "Android >= 4.4"]
                }, // 浏览器的支持范围
                "corejs": 3, // 这个属性，只有在useBuiltIns为usage或者entry的时候起作用，这里记得要安装 core-js@3
                "useBuiltIns": "usage" // 按需引入 core-js 中的模块
            }
        ]
    ]
}
```


## 二，更优的配置, Babel >= 7.4.0

原因： 

* 为代码创建沙盒环境，如果直接导入core-js或@babel/polyfill及其提供的Promise、Set和Map等内置组件，这些将污染全局。
* 如果代码是要发布给其他人使用的库，或者无法准确控制代码运行的环境，则会出现问题。


第一步，先安装依赖

```shell
npm install @babel/plugin-transform-runtime -D
npm install --save @babel/runtime @babel/runtime-corejs3
```

```js
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8", "Android >= 4.4"]
                }, // 浏览器的支持范围
            }
        ]
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime", {
            "corejs": 3
        }]
    ]
}
```


### 参考资料

* [https://babeljs.io/docs/en/babel-preset-env#corejs](https://babeljs.io/docs/en/babel-preset-env#corejs)
* [https://babeljs.io/docs/en/babel-plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
* [https://juejin.cn/post/6999188157992271886?utm_source=gold_browser_extension](https://juejin.cn/post/6999188157992271886?utm_source=gold_browser_extension)
