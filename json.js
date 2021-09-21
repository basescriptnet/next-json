// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

console.clear()
const moo = require('moo')
// add html
let grammarObj = {
	htmlContent: {
		match: /\(\s*\(?:(?!>\s*\))*<[\s\S]+\>\s*\)/, lineBreaks: true
	},
	// hexadecimals
	hexLong: /#[A-Za-z0-9]{6}/, // used for css colors
	hexShort: /#[A-Za-z0-9]{3}/, // used for css colors
	number: /(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	property: /(?:--)?[A-Za-z_]+[A-Za-z0-9_-]*[A-Za-z0-9_]*/,
	comment: /\/\/.*/,
	operator: /\+|-|\/|\*|%/,
	variable: /\$[A-Za-z_0-9\$]+/,
	// commentBlock: /\/\*[.*|\r?\n]\*\//, // /* ... */
    space: {match: /\s+/, lineBreaks: true},
	random: "random",
	join: "join",
	length: "length",
	log: "log",
	dstring: {match: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/},
	sstring: {match: /'(?:\\['fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/, value: x => '\"' + x.slice(1, -1) + '\"'},
	tstring: {match: /`(?:\\[`fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/, lineBreaks: true, value: x => x.slice(1, -1)},
	htmlContent: {match: /html`(?:\\[`fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/, lineBreaks: true, value: x => x.slice(4)},
	'?': '?',
	'>': '>',
	'<': '<',
	'>=': '>=',
	'<=': '<=',
	'!=': '!=',
	'!==': '!==',
	'==': '==',
	'===': '===',
	'&&': '&&',
	'and': 'and',
	'or': 'or',
	'not': 'not',
	'is': 'is',
	'||': '||',	
	// other
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
	'(': '(',
	')': ')',
    ',': ',',
    ':': ':',
	'=': '=',
	';': ';',
	'!': '!',
	"import": "import",
	"invert": "invert",
	'debugger': 'debugger',
	// booleans
    true: 'true',
    false: 'false',
    null: 'null',
}
let lexer = moo.compile(grammarObj);




//const $this = {};
const fs = require('fs');
//const sp = require('sync-promise');
let variables = {};
//$this.variables = variables;

function Type(item) {
	switch (typeof item) {
		case 'string':
			return 'string';
		case 'number':
			return 'number';
		case 'boolean':
			return 'boolean';
		case 'undefined':
			//throw new Error(`${item} is not defined`);
			return 'undefined';
		case 'object':
			if (Array.isArray(item))
				return 'array';
			if (item === null)
				return 'null';
			return 'object';
	}
}
Type.isArray = (item) => {
	return Type(item) === 'array'
}
Type.isNumber = (item) => {
	return Type(item) === 'number'
}
Type.isBoolean = (item) => {
	return Type(item) === 'boolean'
}
Type.isObject = (item) => {
	return Type(item) === 'object'
}
Type.isString = (item) => {
	return Type(item) === 'string'
}
Type.isNull = (item) => {
	return Type(item) === 'null'
}
Type.isUndefined = (item) => {
	return Type(item) === 'undefined'
}
Type.TypeError = (expectedType, recieved) => {
	throw new TypeError(`Unexpected input type. Expecteg "${expectedType}", recieved "${recieved}".`);
}
Type.mayBeBoolean = item => {
	let type = Type(item)
	return ['string', 'number', 'boolean'].includes(type)
}

function storeVariable (varName, value) {
	variables[varName] = value;
}

function getArrayItem(item) {
	return item === undefined ? null : item;
}

function getValue(varName) {
	if (varName in variables) {
		return variables[varName]
	}
	// console.warn(new Error(`${varName} is not defined. undefined is returned instead.`))
	variables[varName] = undefined;
	return undefined;
}
function extractPair(kv, output) {
    if(kv[0]) { output[kv[0]] = kv[1]; }
}

function extractObject(d) {
    let output = {};

    extractPair(d[2], output);

    for (let i in d[3]) {
        extractPair(d[3][i][3], output);
    }

    return output;
}

function extractArray(d) {
    let output = [d[2]];

    for (let i in d[3]) {
        output.push(d[3][i][3]);
    }

    return output;
}

function invertHex(hex) {
	let n = hex.substr(1);
	if (n.length == 3) n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2];
	return `#${(Number(`0x1${n}`) ^ 0xFFFFFF).toString(16).substr(1).toLowerCase()}`;
}

function readFile (fileName) {
	let content = null;
	try {
		// content = await fs.readFile(fileName, 'utf-8')
		content = fs.readFileSync(fileName, 'utf-8')
		/*let p = new sp(function(resolve, reject) {
			resolve(content);
		});
		return p.v*/
	} catch (err) {
		throw err;
	}
	return content;
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["main"], "postprocess": id},
    {"name": "process", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": d => ''},
    {"name": "process", "symbols": [], "postprocess": d => ''},
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1$subexpression$1", "symbols": ["var_assign"]},
    {"name": "main$ebnf$1$subexpression$1$subexpression$1", "symbols": ["log"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["_", "main$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1", "json"], "postprocess": d => d[1]},
    {"name": "json$subexpression$1", "symbols": ["object"]},
    {"name": "json$subexpression$1", "symbols": ["array"]},
    {"name": "json$subexpression$1", "symbols": ["string"]},
    {"name": "json$subexpression$1", "symbols": ["number"]},
    {"name": "json$subexpression$1", "symbols": ["boolean"]},
    {"name": "json", "symbols": ["_", "json$subexpression$1", "_"], "postprocess":  d => {
        	return d[1][0];
        } },
    {"name": "json", "symbols": ["_", "myNull", "_"], "postprocess": d => null},
    {"name": "log", "symbols": [{"literal":"log"}, {"literal":"("}, "_", "value", "_", {"literal":")"}, "_", {"literal":";"}], "postprocess": d => { console.log(`>>> ${d[3]}`) }},
    {"name": "html", "symbols": [(lexer.has("htmlContent") ? {type: "htmlContent"} : htmlContent)], "postprocess": d => d[0].value},
    {"name": "varName", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => d[0].value},
    {"name": "variable", "symbols": ["varName"], "postprocess": d => getValue(d[0])},
    {"name": "var_assign$subexpression$1", "symbols": ["if"]},
    {"name": "var_assign$subexpression$1", "symbols": ["import"]},
    {"name": "var_assign$subexpression$1", "symbols": ["expr"]},
    {"name": "var_assign$subexpression$1", "symbols": ["string"]},
    {"name": "var_assign$subexpression$1", "symbols": ["number"]},
    {"name": "var_assign$subexpression$1", "symbols": ["variable"]},
    {"name": "var_assign$subexpression$1", "symbols": ["boolean"]},
    {"name": "var_assign$subexpression$1", "symbols": ["object"]},
    {"name": "var_assign$subexpression$1", "symbols": ["array"]},
    {"name": "var_assign$subexpression$1", "symbols": ["myNull"]},
    {"name": "var_assign$subexpression$1", "symbols": ["html"]},
    {"name": "var_assign$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "var_assign", "symbols": ["varName", "_", {"literal":"="}, "_", "var_assign$subexpression$1", "_", {"literal":";"}], "postprocess":  function(d) {
        	storeVariable(d[0], d[4][0]);
        	return d[4][0];
        } },
    {"name": "is", "symbols": [{"literal":"is"}], "postprocess": d => "is"},
    {"name": "expr", "symbols": ["expression"], "postprocess": arr => eval(arr[0].join(''))},
    {"name": "expr", "symbols": ["string_concat"], "postprocess": id},
    {"name": "if$subexpression$1", "symbols": ["variable"]},
    {"name": "if$subexpression$1", "symbols": ["expr"]},
    {"name": "if$subexpression$1", "symbols": ["string"]},
    {"name": "if$subexpression$1", "symbols": ["number"]},
    {"name": "if$subexpression$1", "symbols": ["boolean"]},
    {"name": "if$subexpression$1", "symbols": ["myNull"]},
    {"name": "if$subexpression$1", "symbols": ["condition"]},
    {"name": "if", "symbols": ["if$subexpression$1", "_", {"literal":"?"}, "_", "value", "_", {"literal":":"}, "_", "value"], "postprocess":  d => {
        	return d[0][0] ? d[4] : d[8]
        }},
    {"name": "condition", "symbols": ["conditionalValues", "_", {"literal":"=="}, "_", "conditionalValues"], "postprocess": d => d[0] == d[4]},
    {"name": "conditionalValues", "symbols": ["variable"], "postprocess": id},
    {"name": "conditionalValues$subexpression$1", "symbols": ["expr"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["boolean"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["number"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["string"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["myNull"]},
    {"name": "conditionalValues", "symbols": ["conditionalValues$subexpression$1"], "postprocess": d=> d[0][0]},
    {"name": "expression", "symbols": ["expression", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "number"], "postprocess": ([fst, , _, , snd]) => [...fst, _.value, snd]},
    {"name": "expression", "symbols": ["expression", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "boolean"], "postprocess": ([fst, , _, , snd]) => [...fst, _.value, Number(snd)]},
    {"name": "expression", "symbols": ["expression", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "variable"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof snd != 'number') return reject;
        	return [...fst, _.value, snd] 
        } },
    {"name": "expression", "symbols": ["number", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "variable"], "postprocess": ([fst, , _, , snd]) => [fst, _.value, Number(snd)]},
    {"name": "expression", "symbols": ["number", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "number"], "postprocess": ([fst, , _, , snd]) => [fst, _.value, snd]},
    {"name": "expression", "symbols": ["number", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "boolean"], "postprocess": ([fst, , _, , snd]) => [fst, _.value, Number(snd)]},
    {"name": "expression", "symbols": ["boolean", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "number"], "postprocess": ([fst, , _, , snd]) => [Number(fst), _.value, snd]},
    {"name": "expression", "symbols": ["boolean", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "boolean"], "postprocess": ([fst, , _, , snd]) => [Number(fst), _.value, Number(snd)]},
    {"name": "expression", "symbols": ["boolean", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "variable"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof snd != 'number') return reject;
        	return [Number(fst), _.value, snd] 
        } },
    {"name": "expression", "symbols": ["variable", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "boolean"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof fst != 'number') return reject;
        	return [fst, _.value, Number(snd)] 
        } },
    {"name": "expression", "symbols": ["variable", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "variable"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof fst != 'number') {
        		if (typeof snd != 'number') {
        			return reject;
        		}
        	}
        	return [Number(fst), _.value, Number(snd)]
        } },
    {"name": "expression", "symbols": ["variable", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "number"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof fst != 'number') return reject;
        	return [fst, _.value, snd] 
        } },
    {"name": "string_concat$subexpression$1", "symbols": ["string", "_", {"literal":"+"}, "_", "string"]},
    {"name": "string_concat$subexpression$1", "symbols": ["number", "_", {"literal":"+"}, "_", "string"]},
    {"name": "string_concat$subexpression$1", "symbols": ["string", "_", {"literal":"+"}, "_", "number"]},
    {"name": "string_concat$subexpression$1", "symbols": ["boolean", "_", {"literal":"+"}, "_", "string"]},
    {"name": "string_concat$subexpression$1", "symbols": ["string", "_", {"literal":"+"}, "_", "boolean"]},
    {"name": "string_concat$subexpression$1", "symbols": ["string", "_", {"literal":"+"}, "_", "variable"]},
    {"name": "string_concat$subexpression$1", "symbols": ["variable", "_", {"literal":"+"}, "_", "string"]},
    {"name": "string_concat", "symbols": ["string_concat$subexpression$1"], "postprocess": ([f]) => f[0] + f[4]},
    {"name": "string_concat", "symbols": ["expression", "_", {"literal":"+"}, "_", "string"], "postprocess": d => eval(d[0].join('')) + d[4]},
    {"name": "string_concat", "symbols": ["expression", "_", {"literal":"+"}, "_", "variable"], "postprocess":  ([fst, , _, , snd], l, reject) => {
        	if (typeof snd != 'string') {
        		return reject;
        	}
        	return eval(fst.join('')) + snd
        } },
    {"name": "string_concat$subexpression$2", "symbols": ["string"]},
    {"name": "string_concat$subexpression$2", "symbols": ["number"]},
    {"name": "string_concat$subexpression$2", "symbols": ["boolean"]},
    {"name": "string_concat$subexpression$2", "symbols": ["variable"]},
    {"name": "string_concat", "symbols": ["string_concat", "_", {"literal":"+"}, "_", "string_concat$subexpression$2"], "postprocess": d => { return d[0] + d[4] }},
    {"name": "string_concat", "symbols": ["variable", "_", {"literal":"+"}, "_", "variable"], "postprocess": 
        ([f,,,, s], l, reject) => {
        	if (typeof f == 'string' || typeof s == 'string') {
        		return f + s
        	}
        	return reject;
        }
        	},
    {"name": "string_concat$subexpression$3", "symbols": ["string"]},
    {"name": "string_concat$subexpression$3", "symbols": ["number"]},
    {"name": "string_concat$subexpression$3", "symbols": ["boolean"]},
    {"name": "string_concat", "symbols": ["variable", "_", {"literal":"+"}, "_", "string_concat$subexpression$3"], "postprocess": 
        ([f,,,, s], l, reject) => {
        	//console.log(f, s)
        	if (typeof f == 'string' || typeof s[0] == 'string') {
        		return f + s[0]
        	}
        	return reject;
        }
        	},
    {"name": "string_concat", "symbols": ["string_concat", "_", {"literal":"+"}, "_", "variable"], "postprocess": d => { return d[0] + d[4] }},
    {"name": "boolean", "symbols": [{"literal":"not"}, "_", (lexer.has("space") ? {type: "space"} : space), "_", "condition"], "postprocess": d => !d[4]},
    {"name": "boolean", "symbols": ["is", "_", (lexer.has("space") ? {type: "space"} : space), "_", "condition"], "postprocess": d => d[4]},
    {"name": "boolean$subexpression$1", "symbols": ["variable"]},
    {"name": "boolean$subexpression$1", "symbols": ["number"]},
    {"name": "boolean$subexpression$1", "symbols": ["string"]},
    {"name": "boolean$subexpression$1", "symbols": ["boolean"]},
    {"name": "boolean$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "boolean$subexpression$1", "symbols": ["objectItem"]},
    {"name": "boolean", "symbols": [{"literal":"!"}, "boolean$subexpression$1"], "postprocess":  (d, l, reject) => {
        	console.log(d)
        	if (!Type.mayBeBoolean(d[1][0]))
        		//Type.TypeError('boolean', Type(d[1]));
        		return reject
        } },
    {"name": "boolean", "symbols": [{"literal":"!"}, {"literal":"true"}], "postprocess": d => false},
    {"name": "boolean", "symbols": [{"literal":"!"}, {"literal":"false"}], "postprocess": d => true},
    {"name": "boolean", "symbols": [{"literal":"true"}], "postprocess": d => true},
    {"name": "boolean", "symbols": [{"literal":"false"}], "postprocess": d => false},
    {"name": "boolean$subexpression$2", "symbols": ["boolean"]},
    {"name": "boolean$subexpression$2", "symbols": ["number"]},
    {"name": "boolean$subexpression$2", "symbols": ["string"]},
    {"name": "boolean", "symbols": [{"literal":"!"}, {"literal":"("}, "_", "boolean$subexpression$2", "_", {"literal":")"}], "postprocess": d => console.log(d) && !d[3][0]},
    {"name": "boolean", "symbols": [{"literal":"!"}, {"literal":"("}, "_", "expr", "_", {"literal":")"}], "postprocess": d => console.log(d) && !d[3]},
    {"name": "boolean", "symbols": [{"literal":"!"}, {"literal":"("}, "_", "variable", "_", {"literal":")"}], "postprocess": d =>console.log(d) && !d[3]},
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess": d => null},
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": function(d) { return {}; }},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "object$ebnf$2", "symbols": ["object$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "object$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "object$ebnf$2", "_", {"literal":"}"}], "postprocess": extractObject},
    {"name": "object", "symbols": ["objectItem"], "postprocess":  (d, l, reject) => {
        	if (!(typeof d[0] === 'object' && !Array.isArray(d[0]) && d[0] !== null))
        		return reject;
        	return d[0];
        } },
    {"name": "objectItem$subexpression$1", "symbols": ["object"]},
    {"name": "objectItem$subexpression$1", "symbols": ["variable"]},
    {"name": "objectItem$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "objectItem$subexpression$1", "symbols": ["objectItem"]},
    {"name": "objectItem$subexpression$2", "symbols": ["string"]},
    {"name": "objectItem$subexpression$2", "symbols": ["variable"]},
    {"name": "objectItem", "symbols": ["objectItem$subexpression$1", "_", {"literal":"["}, "_", "objectItem$subexpression$2", "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0][0];
        	let s = d[4][0];
        	if (typeof s != 'string') return reject;
        	if (!(typeof d[0][0] === 'object' && !Array.isArray(d[0][0]) && d[0][0] !== null))
        		return reject;
        	let item = getArrayItem(f[s]);
        	if (!(typeof item === 'object' && !Array.isArray(item) && item !== null))
        		return reject;
        	return item;
        }
        },
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": d => [d[0], d[4]]},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "key", "symbols": ["property"], "postprocess": id},
    {"name": "property", "symbols": [(lexer.has("property") ? {type: "property"} : property)], "postprocess": d => d[0].value},
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": function(d) { return []; }},
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "array$ebnf$2", "symbols": ["array$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "array$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "array$ebnf$2", "_", {"literal":"]"}], "postprocess": extractArray},
    {"name": "array", "symbols": ["arrayItem"], "postprocess":  (d, l, reject) => {
        	if (!Array.isArray(d[0])) return reject;
        	return d[0];
        } },
    {"name": "arrayItem$subexpression$1", "symbols": ["array"]},
    {"name": "arrayItem$subexpression$1", "symbols": ["variable"]},
    {"name": "arrayItem$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "arrayItem$subexpression$1", "symbols": ["objectItem"]},
    {"name": "arrayItem$subexpression$2", "symbols": ["number"]},
    {"name": "arrayItem$subexpression$2", "symbols": ["variable"]},
    {"name": "arrayItem", "symbols": ["arrayItem$subexpression$1", "_", {"literal":"["}, "_", "arrayItem$subexpression$2", "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0][0];
        	let s = d[4][0];
        	if (!Array.isArray(f)) return reject;
        	if (typeof s != 'number') return reject;
        	return getArrayItem(f[s])
        }
        },
    {"name": "value", "symbols": ["if"], "postprocess": id},
    {"name": "value", "symbols": ["html"], "postprocess": id},
    {"name": "value", "symbols": ["condition"], "postprocess": id},
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["object"], "postprocess": id},
    {"name": "value", "symbols": ["objectItem"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["arrayItem"], "postprocess": id},
    {"name": "value", "symbols": ["import"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["hex"], "postprocess": id},
    {"name": "value", "symbols": ["expr"], "postprocess": id},
    {"name": "value", "symbols": ["variable"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseFloat(d[0].value)},
    {"name": "number", "symbols": [{"literal":"+"}, "variable"], "postprocess": d => Number(d[1])},
    {"name": "number", "symbols": [{"literal":"-"}, "variable"], "postprocess": d => -Number(d[1])},
    {"name": "number", "symbols": [{"literal":"+"}, "boolean"], "postprocess": d => Number(d[1])},
    {"name": "number", "symbols": [{"literal":"-"}, "boolean"], "postprocess": d => -Number(d[1])},
    {"name": "number", "symbols": ["random"], "postprocess": id},
    {"name": "number", "symbols": ["length"], "postprocess": id},
    {"name": "random", "symbols": [{"literal":"random"}, {"literal":"("}, "_", {"literal":")"}], "postprocess": d => +Math.random().toFixed(2)},
    {"name": "random", "symbols": [{"literal":"random"}, {"literal":"("}, "_", "number", "_", {"literal":")"}], "postprocess": d => Math.floor(Math.random() * d[3])},
    {"name": "random", "symbols": [{"literal":"random"}, {"literal":"("}, "_", "number", "_", {"literal":","}, "_", "number", "_", {"literal":")"}], "postprocess": d=> Math.floor(Math.random() * (d[7] - d[3]) + d[3])},
    {"name": "length$subexpression$1", "symbols": ["array"]},
    {"name": "length$subexpression$1", "symbols": ["object"]},
    {"name": "length", "symbols": [{"literal":"length"}, {"literal":"("}, "_", "length$subexpression$1", "_", {"literal":")"}], "postprocess": d => Object.keys(d[3][0]).length},
    {"name": "length", "symbols": [{"literal":"length"}, {"literal":"("}, "_", "variable", "_", {"literal":")"}], "postprocess":  d => {
        	let v = d[3];
        	if (!Array.isArray(v) || (v && typeof v === 'object' && !(v instanceof Array))) {
        		console.warn(
        			new Error('[length()]: Argument #1 must be type of Array or Object, got ' + v + ' instead.')
        		);
        		return;
        	}
        	return Object.keys(v).length
        } },
    {"name": "invert$subexpression$1", "symbols": [(lexer.has("hexLong") ? {type: "hexLong"} : hexLong)]},
    {"name": "invert$subexpression$1", "symbols": [(lexer.has("hexShort") ? {type: "hexShort"} : hexShort)]},
    {"name": "invert", "symbols": [{"literal":"invert"}, {"literal":"("}, "_", "invert$subexpression$1", "_", {"literal":")"}], "postprocess": d => invertHex(d[3][0].value)},
    {"name": "invert", "symbols": [{"literal":"invert"}, {"literal":"("}, "_", "variable", "_", {"literal":")"}], "postprocess":  d => {
        	if (!/#[A-Za-z0-9]{3}/.test(d[3]) && !/#[A-Za-z0-9]{6}/.test(d[3])) {
        		console.warn(
        			new Error('[join()]: Argument #1 must be type of Array, got ' + d[3] + ' instead.')
        		);
        		return;
        	}
        	return invertHex(d[3]);
        } },
    {"name": "hex", "symbols": [(lexer.has("hexLong") ? {type: "hexLong"} : hexLong)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": [(lexer.has("hexShort") ? {type: "hexShort"} : hexShort)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": ["invert"], "postprocess": id},
    {"name": "string$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "string", "_"]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "string", "symbols": [{"literal":"join"}, {"literal":"("}, "_", "array", "_", "string$ebnf$1", {"literal":")"}], "postprocess": d => d[3].join(!d[5] ? ',' : d[5][2])},
    {"name": "string$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "string", "_"]},
    {"name": "string$ebnf$2", "symbols": ["string$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "string$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "string", "symbols": [{"literal":"join"}, {"literal":"("}, "_", "variable", "_", "string$ebnf$2", {"literal":")"}], "postprocess":  d => {
        return Array.isArray(d[3])
        ? d[3].join(!d[5] ? ',' : d[5][2])
        : console.warn(
        	new Error('[join()]: Argument #1 must be type of Array, got ' + d[3] + ' instead.')
        ) } },
    {"name": "string", "symbols": [(lexer.has("dstring") ? {type: "dstring"} : dstring)], "postprocess": function(d) { return JSON.parse(d[0].value) }},
    {"name": "string", "symbols": [(lexer.has("sstring") ? {type: "sstring"} : sstring)], "postprocess": function(d) { return JSON.parse(d[0].value) }},
    {"name": "string", "symbols": [(lexer.has("tstring") ? {type: "tstring"} : tstring)], "postprocess":  function(d) {
        	return d[0].value
        } },
    {"name": "string", "symbols": ["hex"], "postprocess": id},
    {"name": "WS", "symbols": []},
    {"name": "WS", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": d => null},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": ["WS", (lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "_$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1", "WS"], "postprocess": d => {}},
    {"name": "semicolon", "symbols": [(lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": d => d[0].value},
    {"name": "import", "symbols": [{"literal":"import"}, "_", "file"], "postprocess":  function(d) {
        	return d[2];
        } },
    {"name": "file", "symbols": ["string"], "postprocess":  function(d, l, reject) { 
        	/*if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi) {
        		var request = new XMLHttpRequest();
        		request.open('GET', d[0], false);  // `false` makes the request synchronous
        		request.send(null);
        		let res = l;
        		try {
        			if (request.status === 200) {
        				console.log(request.responseText);
        				return JSON.parse(request.responseText);
        			} else {
        				throw 'Resource not found'
        			}
        		} catch (err) {
        			console.error(err)
        			return null
        		}
        	} else
        	if (/\.next$/.test(d[0])) {
        		let read = readFile(d[0]).trim()
        		//let res = require('./parser.js')(read)
        		debugger
        		return {}//JSON.parse(res);
        	} else */
        	// for now only json files are supported
        	if (/\.json$/.test(d[0])) {
        		let read = readFile(d[0])
        		return JSON.parse(read.trim());
        	}
        	else {
        		console.warn(`File ${d[0]} is not found.`)
        		return l
        	}
        } }
]
  , ParserStart: "process"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
