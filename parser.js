const nearley = require("nearley");
const grammar = require("./json.js");
module.exports = function (str) {
    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // if (str.trim().length == 0) return '';
    let result = (parser.feed(str)).results[0]
    if (!result) return null;
    return result
}