# stylelint



```shell
npm install stylelint --save-dev
npm install stylelint-webpack-plugin stylelint-config-standard --save-dev

```



```js
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    plugins: [
        new StylelintPlugin({
            fix: true,
            extensions: ['css', 'scss', 'sass'],
            exclude: 'node_modules'
        })
    ]
}
```



`.stylelintrc.json`

```json
{
    "extends": "stylelint-config-standard"
}
```

