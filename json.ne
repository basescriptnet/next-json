@{%
	//console.clear()
	const lexer = require('./lexer');
	let log = console.log.bind(console)
%}

@lexer lexer

# --------- main thread ---------
process -> main {% id %}
	| %space {% d => '' %}
	| null {% d => '' %}

main -> ( _ (var_assign) ):* json {% d => d[1] %}

json -> _ (object | array | string | number | boolean | if) _ {% d => {
		return d[1][0];
	} %}
	| _ myNull _ {% d => null %}

# extract inner content
html -> %htmlContent
	{% d => d[0].value %}

varName -> %variableName {% d => d[0].value %}

variable -> varName {% (d, l, reject) => {
	if (getValue(d[0]) === undefined) return reject;
	return getValue(d[0])
} %}

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
# expr
# 	-> string_concat {% id %}

# --------- conditions ---------
than -> "?" {% d => "?" %}
	| "than" {% d => "?" %}

else -> "else" {% d => ":" %}
	| ":" {% d => ":" %}

if -> 
	myNull _ than _ value _ else _ value {% d => d[8] %}
	| myNull _ than _ value {% d => null %}
	| (variable | string | number | boolean | condition | object | array) _ than _ value _ else _ value
	{% d => {
		if (Type.mayBeBoolean(d[0][0]))
			return d[0][0] ? d[4] : d[8]
		else if (Type.isObject(d[0][0]) || Type.isArray(d[0][0]))
			return d[4]
		Type.TypeError('boolean convertable', d[0][0]);
	}%}
	| (variable | string | number | boolean | ondition | object | array) _ than _ value
	{% d => {
		if (Type.mayBeBoolean(d[0][0]))
			return d[0][0] ? d[4] : null
		else if (Type.isObject(d[0][0]) || Type.isArray(d[0][0]))
			return d[4]
		Type.TypeError('boolean convertable', d[0][0]);
	}%}

condition -> boolean _ "==" _  boolean {% d => d[0] === d[4] %}
	| string _ "==" _  string {% d => d[0] === d[4] %}
	| myNull _ "==" _ myNull {% d => d[0] === d[4] %}
	| array _ "==" _ array {% d => JSON.stringify(d[0]) === JSON.stringify(d[4]) %}
	| object _ "==" _ object {% d => JSON.stringify(d[0]) === JSON.stringify(d[4]) %}

	| boolean _ "!=" _  boolean {% d => d[0] !== d[4] %}
	| string _ "!=" _  string {% d => d[0] !== d[4] %}
	| myNull _ "!=" _ myNull {% d => d[0] !== d[4] %}
	| array _ "!=" _ array {% d => JSON.stringify(d[0]) !== JSON.stringify(d[4]) %}
	| object _ "!=" _ object {% d => JSON.stringify(d[0]) !== JSON.stringify(d[4]) %}

	# math comparision
	| number _ "==" _ number {% d => d[0] === d[4] %}
	| number _ "!=" _ number {% d => d[0] !== d[4] %}
	| number _ ">" _ number {% d => d[0] > d[4] %}
	| number _ "<" _ number {% d => d[0] < d[4] %}
	| number _ ">=" _ number {% d => d[0] >= d[4] %}
	| number _ "<=" _ number {% d => d[0] <= d[4] %}

	# logical and/or
	| condition _ %logical_and _ condition {% d => d[0] && d[4] %}
	| condition _ %logical_or _ condition {% d => d[0] || d[4] %}

	| conditionalValues _ %logical_and _ conditionalValues {% d => d[0] && d[4] %}
	| condition _ %logical_and _ conditionalValues {% d => d[0] && d[4] %}
	| conditionalValues _ %logical_and _ condition {% d => d[0] && d[4] %}
	
	| conditionalValues _ %logical_or _ conditionalValues {% d => d[0] || d[4] %}
	| conditionalValues _ %logical_or _ condition {% d => d[0] || d[4] %}
	| condition _ %logical_or _ conditionalValues {% d => d[0] || d[4] %}

conditionalValues -> (string | number | myNull | array | object | boolean) {% d => d[0][0] %}
	| "(" _ if _ ")" {% d => d[2] %}
	| "(" _ conditionalValues _ ")" {% d => d[2] %}
# --------- hexadecimals ---------
# ✅
# --------- numbers ---------
number -> %number {% d => parseFloat(d[0].value) %}
	# | "+" variable {% d => Number(d[1])|0 %}
	# | "-" variable {% d => -Number(d[1])|0 %}
	# | "+" boolean {% d => Number(d[1]) %}
	# | "-" boolean {% d => -Number(d[1]) %}
	| "PI" {% d => 3.1415926536 %}
	| function {% (d, l, reject) => {
		if (!Type.isNumber(d[0]))
			return reject;
		return d[0];
	} %}
	| "(" _ number _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (Type.isNumber(d[0]))
			return d[0]
		return reject;
	} %}
	# | expressionResult {% d => log(1) || (d[0].flat(Infinity).join('_')) %}
	#(d[0].flat(Infinity).join(''))

# --------- operations ---------
string_concat -> string _ "+" _ string {% d => d[0] + d[4] %}
# --------- booleans ---------
boolean -> 
	"not" _ %space _ condition {% d => !d[4] %}
	| is _ %space _ condition {% d => d[4] %}
	| "!" _ boolean {% d => !d[2] %}
	| "!" _ "(" _ boolean _ ")" {% d => !d[4] %}
	| "true" {% d => true %} 
	| "false" {% d => false %}
	| "(" _ boolean _ ")" {% d => d[2] %}
	| "(" _ condition _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (Type.isBoolean(d[0]))
			return d[0]
		return reject;
	} %}
	| function {% (d, l, reject) => {
		if (typeof d[0] !== 'boolean')
			return reject;
		return d[0]
	} %}

# --------- nulls ---------
myNull -> "null" {% d => null %}
	| "(" _ myNull _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (d[0] === null)
			return null
		return reject;
	} %}

# --------- objects ---------
object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% extractObject %}
	| objectItem {% (d, l, reject) => {
		if (!(typeof d[0] === 'object' && !Array.isArray(d[0]) && d[0] !== null))
			return reject;
		return d[0];
	} %}
	| variable {% (d, l, reject) => {
		if (Type.isObject(d[0]))
			return d[0]
		return reject;
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
	| variable {% (d, l, reject) => {
		if (Type.isArray(d[0]))
			return d[0]
		return reject;
	} %}

arrayItem -> (array | variable | arrayItem | objectItem) _ "[" _ (number | variable) _ "]" {% (d, l, reject) => {
		let f = d[0][0];
		let s = d[4][0];
		if (!Array.isArray(f)) return reject;
		if (typeof s != 'number') return reject;
		return getArrayItem(f[s])
	}
%}

# --------- functions ---------
function -> %functionName arguments {% d => {
	if (!functions[d[0]])
		Type.Error('Function is not defined.')
	return functions[d[0]](...d[1]);
} %}

arguments -> "(" _ ")" {% d => [] %}
	| "(" _ value (_ "," _ value):* (_ ","):? _ ")" {% d => extractArray(d) %}

# --------- values ---------
value ->
	"(" _ value _ ")" {% d => d[2] %}
	| if {% id %}
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
	# | expr {% id %}
    | myNull {% d => null %}

hex -> %hexLong {% d => d[0].value %}
	| %hexShort {% d => d[0].value %}
	| "(" _ hex _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (Type.isHex(d[0]))
			return d[0]
		return reject;
	} %}

# --------- strings ---------
string -> %dstring {% d => d[0].value %}
	| %sstring {% d => d[0].value %}
	| %tstring {% d => d[0].value %}
	| hex {% id %}
	| function {% (d, l, reject) => {
		if (!Type.isString(d[0]))
			return reject;
		return d[0];
	} %}
	| "(" _ string _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (Type.isString(d[0]))
			return d[0]
		return reject;
	} %}
	| string_concat {% id %}

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
				log(request.responseText);
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
		return {}//JSON.parse(res);
	} else */
	// for now only json files are supported
	if (/\.json$/.test(d[0])) {
		let read = readFile(d[0])
		return JSON.parse(read.trim());
	}
	else {
		console.warn(`  File ${d[0]} is not found.`)
		return l
	}
} %}

@{%

//const $this = {};
const fs = require('fs');
const required = (functionName, argumentName, item, type) => {
	if (Type.isUndefined(item)) {
		Type.ArgumentError(`"${argumentName}" is required for "${functionName}" function, but none is provided.`);
	}
	else if (type && type != 'any') {
		if (typeof type === 'string' && Type(item) !== type
		|| Array.isArray(type) && !type.includes(Type(item)))
		Type.ArgumentError(`"${argumentName}" at "${functionName}()" must be typeof "${typeof type === 'string' ? type : type.join('/')}", got "${Type(item)}" instead.`);
	}
}
const variables = {};
const functions = {
	error (message) {
		required('error', 'message', message, 'any');
		console.error('>>> ' + message)
		return message
	},
	log (message) {
		required('log', 'message', message, 'any');
		log('>>> ' + message)
		return message
	},
	len (array) {
		required('len', 'array', array, 'array');
	},
	sqrt (number) {
		required('sqrt', 'First argument', number, 'number');
		return Math.sqrt(number)
	},
	pow (x, y) {
		required('pow', 'First argument', x, 'number');
		required('pow', 'Second argument', y, 'number');
		return Math.pow(x, y)
	},
	length (item) {
		required('length', 'First argument', item, ['array', 'object', 'string']);
		if (Type.isString(item))
			return item.length;
		else {
			return Object.keys(item).length
		}

	},
	join (args, separator) {
		required('join', 'First argument', args, 'array');
		if (args.length === 0)
			return '';
		let result = '';
		args.map(i => functions.String(i));
		return args.join(
			separator !== undefined ? functions.String(separator)
				: undefined
		)
	},
	random (min, max) {
		if (min === undefined) {
			return +Math.random().toFixed(2)
		} else if (max === undefined) {
			// max = min
			return ~~(Math.random() * min)
		} else {
			if (min > max)
				return 0;
			return ~~(Math.random() * (max - min) + min)
		}
	},
	String (item) {
		required('String', 'At least one argument', item)
		switch (Type(item)) {
			case 'object':
				return 'object';
			case 'array':
				return 'array';
			default:
				return item + '';
		}
	},
	Number (item) {
		required('Number', 'At least one argument', item)
		return (item)|0 // bitwise | turn anything inside the () into a number
	},
	abs (number) {
		required('abs', 'First argument', number, 'number')
		return Math.abs(number) // bitwise | turn anything inside the () into a number
	},
	invert (hex) {
		required('invert', 'First argument', hex, 'hex')
		return invertHex(hex);
	},
	round (number) {
		required('round', 'First argument', number, 'number')
		return Math.round(number)
	},
	sum (first, second, ...rest) {
		required('sum', 'First argument', first, 'number');
		required('sum', 'Second argument', second, 'number');
		for (let i = 0; i < rest.length; i++) {
			let j = rest[i];
			required('sum', 'All arguments', j, 'number');
			if (j < 0) rest[i] = '(' + rest[i] + ')'
		}
		return eval(`(${first})+(${second})+${rest.length ? rest.join('+') : 0}`);
	},
	reduce (first, second, ...rest) {
		required('sum', 'First argument', first, 'number');
		required('sum', 'Second argument', second, 'number');
		for (let i = 0; i < rest.length; i++) {
			let j = rest[i];
			required('sum', 'All arguments', j, 'number');
			if (j < 0) rest[i] = '(' + rest[i] + ')'
		}
		return eval(`(${first})-(${second})-${rest.length ? rest.join('-') : 0}`);
	},
	multiply (first, second, ...rest) {
		required('sum', 'First argument', first, 'number');
		required('sum', 'Second argument', second, 'number');
		for (let i = 0; i < rest.length; i++) {
			let j = rest[i];
			required('sum', 'All arguments', j, 'number');
			if (j < 0) rest[i] = '(' + rest[i] + ')'
		}
		return eval(`(${first})*(${second})*${rest.length ? rest.join('*') : 1}`);
	},
	divide (first, second, ...rest) {
		required('sum', 'First argument', first, 'number');
		required('sum', 'Second argument', second, 'number');
		if (second === 0)
			Type.ArgumentError(`Function "divide" may accept only the first argument with a value 0.`);
		for (let i = 0; i < rest.length; i++) {
			let j = rest[i];
			required('sum', 'All arguments', j, 'number');
			if (j === 0)
				Type.ArgumentError(`Function "divide()" may accept value 0 only for the first argument.`);
			if (j < 0) rest[i] = '(' + rest[i] + ')'
		}
		return eval(`(${first})/(${second})/${rest.length ? rest.join('/') : 1}`);
	},
	isNull (item) {
		required('isNull', 'At least one argument', item);
		return item === null;
	}
};
//$this.variables = variables;

const Type = require('./Type')

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
	//console.warn(new Error(`${varName} is not defined. undefined is returned instead.`))
	//variables[varName] = undefined;
	//return undefined;
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