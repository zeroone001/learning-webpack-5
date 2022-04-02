const fs = require('fs');
const cheerio = require('cheerio');
/* 模拟HTMLWebpackPlugin */
module.exports = class HelloPlugin {
    constructor (options) {
        this.options = options;
    }
    apply (compiler) {
        compiler.hooks.done.tap("HelloPlugin", () => {
            console.log('213312done');
        });
        compiler.hooks.afterEmit.tap('HelloPlugin', (compilation) => {
            console.log('213312emit');
            const result = fs.readFileSync(this.options.template, 'utf-8');
            const $ = cheerio(result);
            Object.keys(compilation.assets).forEach((item) => {
                $('body').append(`<script src="${item}"></script>`)
            });
            fs.writeFileSync('./dist/' + this.options.filename, $.html());
        });
    }
}