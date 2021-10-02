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
	| "(" _ json _ ")" {% d => d[2] %}
	| _ myNull _ {% d => null %}

html -> %htmlContent
	{% d => d[0].value %}

varName -> %variableName {% d => d[0].value %}

variable -> varName {% (d, l, reject) => {
	if (getValue(d[0]) === undefined) return reject;
	return getValue(d[0])
} %}
	| "(" _ variable _ ")" {% d => d[2] %}

var_assign
	-> varName _ "=" _ (
		if | import | string
		| number | html
		| boolean | object
		| array | myNull
	) _ ";"
	{% function(d) {
		storeVariable(d[0], d[4][0]);
		return d[4][0];
	} %}

is -> "is" {% d => "is" %}

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
	| "PI" {% d => 3.1415926536 %}
	| "E" {% d => 2.7182818285 %}
	| (objectItem | arrayItem | variable |function) {% (d, l, reject) => {
		if (!Type.isNumber(d[0][0]))
			return reject;
		return d[0][0];
	} %}

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
	| (objectItem | arrayItem | variable |function) {% (d, l, reject) => {
		if (!Type.isNull(d[0][0]))
			return reject;
		return d[0][0];
	} %}

# --------- objects ---------
object -> "{" _ "}" {% function(d) { return {}; } %}
    | "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% extractObject %}
	| (objectItem | arrayItem | variable |function) {% (d, l, reject) => {
		if (!Type.isObject(d[0][0]))
			return reject;
		return d[0][0];
	} %}

objectItem -> object _ "[" _ string _ "]" {% (d, l, reject) => {
		let f = d[0];
		let s = d[4];
		return getArrayItem(f[s]);
	}
%}

pair -> key _ ":" _ value {% d => [d[0], d[4]] %}

key -> string {% id %}
	| property {% id %}

property -> %property {% d => d[0].value %}

# --------- arrays ---------
array -> "[" _ "]" {% function(d) { return []; } %}
    | "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% extractArray %}
	| (objectItem | arrayItem | variable |function) {% (d, l, reject) => {
		if (!Type.isArray(d[0][0]))
			return reject;
		return d[0][0];
	} %}

arrayItem -> array _ "[" _ number _ "]" {% (d, l, reject) => {
		let f = d[0];
		let s = d[4];
		return getArrayItem(f[s])
	}
%}
	| array _ "[" _ "]" {% (d, l, reject) => {
		let f = d[0];
		let s = f.length-1;
		return getArrayItem(f[s])
	}
%}

# --------- functions ---------
function ->
	"for" _ ((string | array | object) {% d => {
		let n = Object.values(d[0][0]);
		if (n === undefined) return null;
		return d[0][0];
	} %}) _ "=>" ( _ "." _ %functionName arguments):+
	{% d => {
		if (d[2] === null) throw 'Unexpected input in for loop.';
		let array = [];
		if (Type.isObject(d[2])) {
			array = {};
		}
		let keys = Object.keys(d[2])
		let values = Object.values(d[2])
		if (keys.length === 0) return d[2];
		for (let i = 0; i < keys.length; i++) {
			let value = functions[d[5][0][3].value](d[2][keys[i]], ...d[5][0][4]);
			for (let j = 1; j < d[5].length; j++) {
				let c = d[5][j];
				if (!functions[c[3].value]) {
					Type.Error('Function is not defined.');
				}
				value = functions[c[3]](
					value, ...c[4]
				);
			}
			
			if (Type.isObject(d[2])) {
				array[keys[i]] = value;
			}
			else array.push(value);
		}
		return array;
	} %}
	| %functionName arguments {% d => {
		if (!functions[d[0]])
			Type.Error('Function is not defined.')
		return functions[d[0].value](...d[1]);
	} %}
	| (string | number | array | object) _ "=>" _ %functionName arguments {% d => {
		if (!functions[d[4]])
			Type.Error('Function is not defined.')
		return functions[d[4].value](d[0][0], ...d[5]);
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
    | array {% id %}
	| import {% id %}
    | number {% id %}
	| hex {% id %}
    | string {% id %}
    | myNull {% d => null %}

hex -> %hexLong {% d => d[0].value %}
	| %hexShort {% d => d[0].value %}
	| "(" _ hex _ ")" {% d => d[2] %}
	| variable {% (d, l, reject) => {
		if (Type.isHex(d[0]))
			return d[0]
		return reject;
	} %}
	| function {% (d, l, reject) => {
		if (!Type.isHex(d[0]))
			return reject;
		return d[0];
	} %}

# --------- strings ---------
string -> %dstring {% d => d[0].value %}
	| %sstring {% d => d[0].value %}
	| %tstring {% d => d[0].value %}
	| hex {% id %}
	| (objectItem | arrayItem | variable |function) {% (d, l, reject) => {
		if (!Type.isString(d[0][0]))
			return reject;
		return d[0][0];
	} %}
	| string_concat {% id %}
	| string _ "[" _ number _ "]" {% (d, l, reject) => {
		let f = d[0];
		let s = d[4];
		return f[s];
	}
%}
	| string _ "[" _ "]" {% (d, l, reject) => {
		let f = d[0];
		let s = f.length-1
		return f[s];
	} %}

# --------- whitespace ---------
WS -> null | %space {% d => null %}

_ -> (WS %comment):* WS {% d => {} %}

# --------- special chars ---------
semicolon -> %semicolon {% d => d[0].value %} 

# --------- imports ---------
import -> "import" _ file {% function(d) {
	return d[2];
} %}

file -> string {% function(d, l, reject) {
	if (/\.json$/.test(d[0])) {
		let read = readFile(d[0])
		return JSON.parse(read.trim());
	}
	else {
		console.error(`[File Error]: "${d[0]}" is not found or is not json formated.`)
		return null
	}
} %}

@{%

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
const localVariables = {};
const variables = {
	$this: null
};
const functions = {
	// debugging
	error (message) {
		required('error', 'message', message);
		console.error('>>> ' + message)
		return message
	},
	log (message) {
		required('log', 'message', message);
		log('>>> ' + message)
		return message
	},
	// array <=> string
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
	split (string, separator = '') {
		required('split', 'First argument', string, 'string');
		required('split', 'Second argument', separator, 'string');
		return string.split(separator)
	},
	// math operations
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
	// type convert
	String (item) {
		required('String', 'At least one argument', item)
		switch (Type(item)) {
			case 'object':
			case 'array':
				return JSON.stringify(item);
			default:
				return item + '';
		}
	},
	Number (item) {
		required('Number', 'At least one argument', item)
		return (item)|0 // bitwise | turn anything inside the () into a number
	},
	Boolean (item) {
		required('Boolean', 'At least one argument', item)
		return !!item
	},
	Array (item) {
		required('Array', 'At least one argument', item)
		switch (Type(item)) {
			case 'string':
				return item.split('');
			case 'object':
				return Object.values(item);
			/*case 'number':
			case 'null':
			case 'boolean':
			case 'hex':
			case 'array':*/
			default:
				return [item];
		}
		return []
	},
	Object (item) {
		required('Object', 'At least one argument', item)
		let key = Type(item);
		if (key === 'string')
		try {
			return JSON.parse(item)
		} catch (err) {}
		let obj = {}
		obj[key] = item
		return obj;
	},
	// type check
	isNumber (item) {
		required('isNumber', 'At least one argument', item);
		return Type(item) == 'number'
	},
	isString (item) {
		required('isString', 'At least one argument', item);
		return Type(item) == 'string' || Type(item) == 'hex'
	},
	isArray (item) {
		required('isArray', 'At least one argument', item);
		return Type(item) == 'array'
	},
	isNull (item) {
		required('isNull', 'At least one argument', item);
		return item === null;
	},
	isHex (item) {
		required('isHex', 'At least one argument', item);
		return Type(item) == 'hex';
	},
	// array/object interactions
	push (array, ...rest) {
		required('push', 'First argument', array, 'array');
		if (rest.length)
			for (let i = 0; i < rest.length; i++) {
				let j = rest[i];
				array.push(j);
			}
		else array.push(null)
		return array;
	},
	insert (target, insertable) {
		required('insert', 'First argument', target, ['object', 'array']);
		if (Type.isObject(target)) {
			required('insert', 'Second argument', insertable, 'object');
			return Object.assign(target, insertable);
		} else {
			required('insert', 'Second argument', insertable, 'array');
			return [...target, ...insertable];
		}
	},
	slice (target, start, end) {
		required('slice', 'First argument', target, ['array', 'string']);
		required('slice', 'Second argument', start, 'number');
		if (end === undefined) end = target.length
		else if (typeof end !== 'number') {
			required('slice', 'Third argument', end, 'number');
		}
		let result = null;
		return target.slice(start, end)
	},
	remove (target, item) {
		required('remove', 'First argument', target, ['string', 'object', 'array']);
		let result = null;
		if (Type.isObject(target)) {
			required('remove', 'Second argument', item, 'string');
			result = target[item]
			delete target[item];
		}
		else {
			required('remove', 'Second argument', item, 'number');
			if (Type.isArray(target)) {
				result = target.splice(item, 1)[0]
			} else {
				result = target.split('').splice(item, 1).join('')
			}
		}
		return result === undefined ? null : result;
	},
	reverse (target) {
		required('remove', 'First argument', target, ['string', 'array']);
		if (Type.isString(target)) {
			return target.split('').reverse().join('')
		}
		return target.reverse()
	}
};
//$this.variables = variables;

const Type = require('./Type')

function storeVariable (varName, value) {
	variables[varName] = value;
	return varName
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