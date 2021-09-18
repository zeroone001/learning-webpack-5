const path = require('path');
const glob = require('glob');
const argv = require('yargs').argv;

let entryPath = 'src/pages/*';
if (argv.pages) {
    entryPath = 'src/pages/+(';
    let pages = argv.pages.split(',');
    for (let i = 0; i < pages.length; i++) {
        if (i === pages.length - 1) {
            entryPath += `${pages[i]})`;
        } else {
            entryPath += `${pages[i]}|`;
        }
    }
}

// 获取入口文件
let entries = (entryPath => {
    let files = {};
    let filesPath = glob.sync(`${entryPath}/*.ts`, {
        ignore: [`src/pages/commend-list-old-version/*.ts`]
    });
    filesPath.forEach((entry, index) => {
        let chunkName = path.relative('src/pages', entry).replace(/\.ts$/i, '');
        files[chunkName] = path.resolve(__dirname, '../', entry);
    });
    return files;
})(entryPath);

module.exports = {
    entries,
    distRootPath: path.resolve(__dirname, '../', 'dist'),
    publicPath: '/',
    absolutePath: 'https://res.smzdm.com/h5/h5_haojia/dist/',
    server: {
        port: argv.port || 8087
    }
};
