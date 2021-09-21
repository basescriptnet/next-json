const fs = require('fs');
// fallback for browsers 
// let result; 
// if (!fs.readFileSync) {
//     fs.readFileSync = function (fileName) {
//         // await fs.readFile(fileName);
//         let request = new XMLHttpRequest();
//         request.open('GET', fileName, true);  // `false` makes the request synchronous
//         request.send(null);
        
//         if (request.status === 200) {
//             return request.responseText;
//         }
//         console.warn(new Error('File couldn\'t be read.'))
//     }
// }
const parser = require('./parser.js');
function readFile (fileName) {
    let content = null;
    // try {
        content = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
    // } catch (err) {
    //     throw err;
    // }
    return content;
}
module.exports = (string) => {
    // if string is provided
    if (!/\.next$/.test(string)) { 
        try {
            let result = parser(string);
            return result;
        } catch (err) {
            console.log(err)
            return;
        }
    }
    // if file path is provided
    let file = readFile(string);
    try {
        let result = parser(file);
        return result;
    } catch (err) {
        console.log(err)
    }
}
// module.exports = bros;
