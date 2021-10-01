const nearley = require("nearley");
module.exports = function (str) {
    const grammar = require("./json.js"); // keep here, otherwise if grammar is changed, watch needs to be restarted
    let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // if (str.trim().length == 0) return '';
    let result = (parser.feed(str)).results[0]
    if (!result) return null;
    return result
}