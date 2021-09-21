@{%
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

%}

@lexer lexer

# --------- main thread ---------
process -> main {% id %}
	| %space {% d => '' %}
	| null {% d => '' %}

main -> ( _ (var_assign | log) ):* json {% d => d[1] %}

json -> _ (object | array | string | number | boolean) _ {% d => {
		return d[1][0];
	} %}
	| _ myNull _ {% d => null %}

# --------- debugging ---------
log -> "log" "(" _ value _ ")" _ ";" {% d => { console.log(`>>> ${d[3]}`) } %}

# extract inner content
html -> %htmlContent
	{% d => d[0].value %}

varName -> %variable {% d => d[0].value %}

variable -> varName {% d => getValue(d[0]) %}

var_assign
	-> varName _ "=" _ (
		if | import
		| expr | string
		| number | variable
		| boolean | object
		| array | myNull
		| html | arrayItem ) _ ";"
	{% function(d) {
		storeVariable(d[0], d[4][0]);
		return d[4][0];
	} %}

is -> "is" {% d => "is" %}
# --------- expressions ---------
expr
	-> expression {% arr => eval(arr[0].join('')) %} # executs the result of numberic expressions, @[n, op, n, op, n]
	| string_concat {% id %}
	#| if {% id %}
	#| "-" boolean _ %operator _ expr {% d => -Number(d[1]) %}

# --------- conditions ---------
if -> (variable | expr | string | number | boolean | myNull | condition) _ "?" _ value _ ":" _ value
	{% d => {
		return d[0][0] ? d[4] : d[8]
	}%}

condition -> conditionalValues _ "==" _ conditionalValues {% d => d[0] == d[4] %}

conditionalValues -> variable {% id %}
	| (expr | boolean | number | string | myNull) {% d=> d[0][0] %}

# --------- operations ---------
expression -> # math expressions
	expression _ %operator _ number {% ([fst, , _, , snd]) => [...fst, _.value, snd] %}
	| expression _ %operator _ boolean {% ([fst, , _, , snd]) => [...fst, _.value, Number(snd)] %}
	| expression _ %operator _ variable {% ([fst, , _, , snd], l, reject) => {
		if (typeof snd != 'number') return reject;
		return [...fst, _.value, snd] 
	} %}
	| number _ %operator _ variable {% ([fst, , _, , snd]) => [fst, _.value, Number(snd)] %}
	| number _ %operator _ number {% ([fst, , _, , snd]) => [fst, _.value, snd] %}
	| number _ %operator _ boolean {% ([fst, , _, , snd]) => [fst, _.value, Number(snd)] %}
	| boolean _ %operator _ number {% ([fst, , _, , snd]) => [Number(fst), _.value, snd] %}
	| boolean _ %operator _ boolean {% ([fst, , _, , snd]) => [Number(fst), _.value, Number(snd)] %}
	| boolean _ %operator _ variable {% ([fst, , _, , snd], l, reject) => {
		if (typeof snd != 'number') return reject;
		return [Number(fst), _.value, snd] 
	} %}
	| variable _ %operator _ boolean {% ([fst, , _, , snd], l, reject) => {
		if (typeof fst != 'number') return reject;
		return [fst, _.value, Number(snd)] 
	} %}
	| variable _ %operator _ variable {% ([fst, , _, , snd], l, reject) => {
		if (typeof fst != 'number') {
			if (typeof snd != 'number') {
				return reject;
			}
		}
		return [Number(fst), _.value, Number(snd)]
	} %}
	| variable _ %operator _ number {% ([fst, , _, , snd], l, reject) => {
		if (typeof fst != 'number') return reject;
		return [fst, _.value, snd] 
	} %}

string_concat
	-> (string _ "+" _ string
		| number _ "+" _ string
		| string _ "+" _ number
		| boolean _ "+" _ string
		| string _ "+" _ boolean
		| string _ "+" _ variable
		| variable _ "+" _ string
		#| expr _ "+" _ string
		#| string _ "+" _ expr
	) {% ([f]) => f[0] + f[4] %}
	| expression _ "+" _ string {% d => eval(d[0].join('')) + d[4] %}
	| expression _ "+" _ variable {% ([fst, , _, , snd], l, reject) => {
		if (typeof snd != 'string') {
			return reject;
		}
		return eval(fst.join('')) + snd
	} %}
	| string_concat _ "+" _ (string | number | boolean | variable) {% d => { return d[0] + d[4] }%}
	| variable _ "+" _ variable {%
		([f,,,, s], l, reject) => {
			if (typeof f == 'string' || typeof s == 'string') {
				return f + s
			}
			return reject;
		}
	%}
	| variable _ "+" _ (string | number | boolean) {%
		([f,,,, s], l, reject) => {
			//console.log(f, s)
			if (typeof f == 'string' || typeof s[0] == 'string') {
				return f + s[0]
			}
			return reject;
		}
	%}
	| string_concat _ "+" _ variable {% d => { return d[0] + d[4] }%}

# --------- booleans ---------
boolean -> 
	"not" _ %space _ condition {% d => !d[4] %}
	| is _ %space _ condition {% d => d[4] %}
	| "!" (variable | number | string | boolean | arrayItem | objectItem) {% (d, l, reject) => {
		console.log(d)
		if (!Type.mayBeBoolean(d[1][0]))
			//Type.TypeError('boolean', Type(d[1]));
			return reject
	} %}
	| "!" "true" {% d => false %} 
	| "!" "false" {% d => true %}
	| "true" {% d => true %} 
	| "false" {% d => false %}
	| "!" "(" _ (boolean | number | string)  _ ")" {% d => console.log(d) && !d[3][0] %}
	| "!" "(" _ expr _ ")" {% d => console.log(d) && !d[3] %}
	| "!" "(" _ variable _ ")" {% d =>console.log(d) && !d[3] %}

# --------- nulls ---------
myNull -> "null" {% d => null %}

# --------- objects ---------
object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% extractObject %}
	| objectItem {% (d, l, reject) => {
		if (!(typeof d[0] === 'object' && !Array.isArray(d[0]) && d[0] !== null))
			return reject;
		return d[0];
	} %}

objectItem -> (object | variable | arrayItem | objectItem) _ "[" _ (string | variable) _ "]" {% (d, l, reject) => {
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
%}

pair -> key _ ":" _ value {% d => [d[0], d[4]] %}

key -> string {% id %}
	| property {% id %}

property -> %property {% d => d[0].value %}

# --------- arrays ---------
array -> "[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% extractArray %}
	| arrayItem {% (d, l, reject) => {
		if (!Array.isArray(d[0])) return reject;
		return d[0];
	} %}

arrayItem -> (array | variable | arrayItem | objectItem) _ "[" _ (number | variable) _ "]" {% (d, l, reject) => {
		let f = d[0][0];
		let s = d[4][0];
		if (!Array.isArray(f)) return reject;
		if (typeof s != 'number') return reject;
		return getArrayItem(f[s])
	}
%}

# --------- values ---------
value ->
	if {% id %}
	| html {% id %}
	| condition {% id %}
	| boolean {% id %}
    | object {% id %}
	| objectItem {% id %}
    | array {% id %}
	| arrayItem {% id %}
	| import {% id %}
    | number {% id %}
    | string {% id %}
	| hex {% id %}
	| expr {% id %}
	| variable {% id %}
    # | "true" {% function(d) { return true; } %}
    # | "false" {% function(d) { return false; } %}
    # | "null" {% function(d) { return null; } %}
	
# --------- numbers ---------
number -> %number {% d => parseFloat(d[0].value) %}
	| "+" variable {% d => Number(d[1]) %}
	| "-" variable {% d => -Number(d[1]) %}
	| "+" boolean {% d => Number(d[1]) %}
	| "-" boolean {% d => -Number(d[1]) %}
	| random {% id %}
	| length {% id %}

random -> "random" "(" _ ")" {% d => +Math.random().toFixed(2) %}
	| "random" "(" _ number _ ")" {% d => Math.floor(Math.random() * d[3]) %}
	| "random" "(" _ number _ "," _ number _ ")" {% d=> Math.floor(Math.random() * (d[7] - d[3]) + d[3]) %}

length -> "length" "(" _ (array | object) _ ")" {% d => Object.keys(d[3][0]).length %}
	| "length" "(" _ variable _ ")" {% d => {
		let v = d[3];
		if (!Array.isArray(v) || (v && typeof v === 'object' && !(v instanceof Array))) {
			console.warn(
				new Error('[length()]: Argument #1 must be type of Array or Object, got ' + v + ' instead.')
			);
			return;
		}
		return Object.keys(v).length
	} %}

# --------- hexadecimals ---------
invert -> "invert" "(" _ (%hexLong | %hexShort) _ ")" {% d => invertHex(d[3][0].value) %}
	| "invert" "(" _ variable _ ")" {% d => {
		if (!/#[A-Za-z0-9]{3}/.test(d[3]) && !/#[A-Za-z0-9]{6}/.test(d[3])) {
			console.warn(
				new Error('[join()]: Argument #1 must be type of Array, got ' + d[3] + ' instead.')
			);
			return;
		}
		return invertHex(d[3]);
	} %}
hex -> %hexLong {% d => d[0].value %}
	| %hexShort {% d => d[0].value %}
	| invert {% id %}

# --------- strings ---------
string -> "join" "(" _ array _ ("," _ string _):? ")" {% d => d[3].join(!d[5] ? ',' : d[5][2]) %}
	| "join" "(" _ variable _ ("," _ string _):? ")"
		{% d => {
			return Array.isArray(d[3])
			? d[3].join(!d[5] ? ',' : d[5][2])
			: console.warn(
				new Error('[join()]: Argument #1 must be type of Array, got ' + d[3] + ' instead.')
			) } %}
	| %dstring {% function(d) { return JSON.parse(d[0].value) } %}
	| %sstring {% function(d) { return JSON.parse(d[0].value) } %}
	| %tstring {% function(d) {
		return d[0].value
	} %}
	| hex {% id %}

# --------- whitespace ---------
WS -> null | %space {% d => null %}

_ -> (WS %comment):* WS {% d => {} %}
	# | (WS %commentBlock):* WS {% d => {} %}

# --------- special chars ---------
semicolon -> %semicolon {% d => d[0].value %} 

# --------- imports ---------
import -> "import" _ file {% function(d) {
	return d[2];
} %}

file -> string {% function(d, l, reject) { 
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
} %}

@{%

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

%}