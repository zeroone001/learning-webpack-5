# eslint



## 安装

如果用了，eslint-webpack-plugin， 就不需要eslint-loader 了

[eslint-webpack-plugin](https://github.com/webpack-contrib/eslint-webpack-plugin)

```shell
npm install eslint -D
# npm install eslint-loader -D
npm install eslint-webpack-plugin --save-dev

```



```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    plugins: [
        new ESLintPlugin({
            fix: true, /* 自动帮助修复 */
            extensions: ['js', 'json', 'coffee', 'vue'],
            exclude: 'node_modules'
        })
    ]
}
```





```js
// .eslintrc
module.exports = {
  env: { // 项目运行环境
    browser: true, // 浏览器端
    commonjs: true, // 支持CJS
    es2021: true, // 支持ES2021及之前的所有语法
  },
  
  // 值可以是字符串或者数组(多个)
  extends: [ // 继承，即规则继承自那些规则（这些规则会被合并到自定义的规则中，可以认为是规则的扩展）
    'plugin:vue/essential', // vue的基本规则
    'airbnb-base', // Airbnb的校验规则
  ],
  
  // 使用什么解释器，可以作为顶层属性配置也可以作为parserOptions的子属性进行配置
  // parser: '@typescript-eslint/parser',
  
  // 解析器的相关信息， 可以指定ESMAScript的版本、sourceType的类型
  parserOptions: { 
    ecmaVersion: 12, // 使用的ECMA的版本
    // 使用什么样的解释器，默认是espree，这里是@typescript-eslint/parser，因为要对TS规则进行校验
    parser: '@typescript-eslint/parser', 
  },
  
  plugins: [ // 插件列表
    'vue', // eslint-plugin-vue@latest的简写
    '@typescript-eslint',
  ],
  
  // 用户自定义规则数组 --- 自定义规则的优先级最高
  rules: { 
  },
};


```

