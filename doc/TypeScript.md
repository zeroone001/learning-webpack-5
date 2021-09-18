# TypeScript







## 安装



```shell
npm install typescript ts-loader -D
```


官方给出的例子，可以按照这个配置 [example](https://github.com/TypeStrong/ts-loader/tree/main/examples/fork-ts-checker-webpack-plugin)

[vue-cli 的一个配置](https://github.com/vuejs/vue-cli/blob/2b3567c842f425ec9234a8204fe52a3ca76804ef/packages/%40vue/cli-plugin-typescript/index.js)




## 配置loader

`transpileOnly: true,` 禁用类型检查， 

[fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) 
用这个plugin在一个单独的进程上进行类型检查

可以搭配 [thread-loader](https://github.com/webpack-contrib/thread-loader)

```js
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
    plugins: [
        // developemnt
        new ForkTsCheckerWebpackPlugin({
            eslint: true
        }),
        new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false }),
        
        // production
        new ForkTsCheckerWebpackPlugin({
            async: false,
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096
        }),
    ]
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
                ]
            },
            // ts
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader', /* https://github.com/TypeStrong/ts-loader */
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, '../tsconfig.json'),
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true, /* 只做语言转换，而不做类型检查, 这里如果不设置成TRUE，就会HMR 报错 */
                            // happyPackMode: true,
                        }
                    }
                ]
            },
        ]
    }
}
```



## tsconfig.json

`"sourceMap": true, ` 这个一定要配置

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    "target": "es5",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "lib": [
      "es6",
      "dom",
      "es2017"
    ],                                   /* Specify library files to be included in the compilation. */
    // "allowJs": true,                             /* Allow javascript files to be compiled. */
    "sourceMap": true,                           /* Generates corresponding '.map' file. */
    // "outFile": "./",                             /* Concatenate and emit output to single file. */
    // "outDir": "./",                              /* Redirect output structure to the directory. */
    "rootDir": "./",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}

```



## 方案二

```js
 npm i typescript @babel/preset-typescript --save-dev
```

.babelrc

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8", "Android >= 4.4"]
                }
            }
        ],
        [
            "@babel/preset-typescript",
             {
                 "isTSX": true, // 必须设置，否者编译tsx时会报错
                 "allowNamespaces": true,
           "allExtensions": true // 必须设置，否者编译.vue 文件中ts 代码会报错
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

loader

```js
module.exports = {
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
                ]
            },
            // ts
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
        ]
    }
}
```

