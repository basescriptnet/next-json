const chokidar = require('chokidar');
const bson = require('./index');
const fs = require('fs');
const arg = process.argv[2];
let spaces = +process.argv[3];
if (arg) {
    console.log(arg)
    watch(arg, spaces);
}
function watch (dir = '.', space = 0) {
    // try {
        // console.log(dir)
        space = +space;
        if (!space && space !== 0) space = 0;
        // if (!dir) throw new Error('Destination must be provided. Terminating Watch...')
        const watcher = chokidar.watch('.', {
            ignored: 'node_modules',
            ignoreInitial: true,
            cwd: __dirname
        });
        // console.log(watcher)
        console.log(__dirname, dir)
        watcher.on('change', (path) => {
            // console.log('path: ', path);
            // if (!/\.next$/i.test(path)) console.log('not .next') 
            // return;
            if (!/\.next$/i.test(path)) return;
            // console.clear()
            let fileName = path.substr(0, path.length-('.next'.length));
            try {
                console.clear();
                let content = bson(path);
                let result = writeFile(path, fileName, content);
                console.log(result)
            } catch (err) {
                // console.clear();
                console.warn(new Error('Can\'t compile. Unexpected input.'));
                console.warn(new Error(err));
            }
        });
        let writeFile = (path, fileName, content) => {
            let result = JSON.stringify(content, null, space || spaces)
            // console.clear();
            console.log('File: '+fileName+'.json')
            // console.log(result)
            fs.writeFileSync(
                `${fileName}.json`,
                result
            );
            return result;
        };
    // } catch (err) {
    //     console.log(err);
    // }
}
module.exports = watch;
/*
// let Benchmark = require('benchmark')
// let suite = new Benchmark.Suite;
let bson = require('./index');
// suite.add('from file', function() {
//     bson.fromFile('./json.next');
// })
// .add('from string', function() {
//     bson.feed('{randomNumber: random(0, 100)}')
// })
// .on('cycle', function(event) {
//     console.log(String(event.target));
// })
// .on('complete', function() {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });
let obj = bson('./json.next');
let obj2 = bson('{randomNumber: random(0, 100)}')
let obj3 = bson('{randomNumber: random(0, 100)}')
console.log(obj.b, obj2.randomNumber, obj3.randomNumber)
*/