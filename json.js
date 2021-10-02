// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	//console.clear()
	const lexer = require('./lexer');
	let log = console.log.bind(console)



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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["main"], "postprocess": id},
    {"name": "process", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": d => ''},
    {"name": "process", "symbols": [], "postprocess": d => ''},
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1$subexpression$1", "symbols": ["var_assign"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["_", "main$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1", "json"], "postprocess": d => d[1]},
    {"name": "json$subexpression$1", "symbols": ["object"]},
    {"name": "json$subexpression$1", "symbols": ["array"]},
    {"name": "json$subexpression$1", "symbols": ["string"]},
    {"name": "json$subexpression$1", "symbols": ["number"]},
    {"name": "json$subexpression$1", "symbols": ["boolean"]},
    {"name": "json$subexpression$1", "symbols": ["if"]},
    {"name": "json", "symbols": ["_", "json$subexpression$1", "_"], "postprocess":  d => {
        	return d[1][0];
        } },
    {"name": "json", "symbols": [{"literal":"("}, "_", "json", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "json", "symbols": ["_", "myNull", "_"], "postprocess": d => null},
    {"name": "html", "symbols": [(lexer.has("htmlContent") ? {type: "htmlContent"} : htmlContent)], "postprocess": d => d[0].value},
    {"name": "varName", "symbols": [(lexer.has("variableName") ? {type: "variableName"} : variableName)], "postprocess": d => d[0].value},
    {"name": "variable", "symbols": ["varName"], "postprocess":  (d, l, reject) => {
        	if (getValue(d[0]) === undefined) return reject;
        	return getValue(d[0])
        } },
    {"name": "variable", "symbols": [{"literal":"("}, "_", "variable", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "var_assign$subexpression$1", "symbols": ["if"]},
    {"name": "var_assign$subexpression$1", "symbols": ["import"]},
    {"name": "var_assign$subexpression$1", "symbols": ["string"]},
    {"name": "var_assign$subexpression$1", "symbols": ["number"]},
    {"name": "var_assign$subexpression$1", "symbols": ["html"]},
    {"name": "var_assign$subexpression$1", "symbols": ["boolean"]},
    {"name": "var_assign$subexpression$1", "symbols": ["object"]},
    {"name": "var_assign$subexpression$1", "symbols": ["array"]},
    {"name": "var_assign$subexpression$1", "symbols": ["myNull"]},
    {"name": "var_assign", "symbols": ["varName", "_", {"literal":"="}, "_", "var_assign$subexpression$1", "_", {"literal":";"}], "postprocess":  function(d) {
        	storeVariable(d[0], d[4][0]);
        	return d[4][0];
        } },
    {"name": "is", "symbols": [{"literal":"is"}], "postprocess": d => "is"},
    {"name": "than", "symbols": [{"literal":"?"}], "postprocess": d => "?"},
    {"name": "than", "symbols": [{"literal":"than"}], "postprocess": d => "?"},
    {"name": "else", "symbols": [{"literal":"else"}], "postprocess": d => ":"},
    {"name": "else", "symbols": [{"literal":":"}], "postprocess": d => ":"},
    {"name": "if", "symbols": ["myNull", "_", "than", "_", "value", "_", "else", "_", "value"], "postprocess": d => d[8]},
    {"name": "if", "symbols": ["myNull", "_", "than", "_", "value"], "postprocess": d => null},
    {"name": "if$subexpression$1", "symbols": ["variable"]},
    {"name": "if$subexpression$1", "symbols": ["string"]},
    {"name": "if$subexpression$1", "symbols": ["number"]},
    {"name": "if$subexpression$1", "symbols": ["boolean"]},
    {"name": "if$subexpression$1", "symbols": ["condition"]},
    {"name": "if$subexpression$1", "symbols": ["object"]},
    {"name": "if$subexpression$1", "symbols": ["array"]},
    {"name": "if", "symbols": ["if$subexpression$1", "_", "than", "_", "value", "_", "else", "_", "value"], "postprocess":  d => {
        	if (Type.mayBeBoolean(d[0][0]))
        		return d[0][0] ? d[4] : d[8]
        	else if (Type.isObject(d[0][0]) || Type.isArray(d[0][0]))
        		return d[4]
        	Type.TypeError('boolean convertable', d[0][0]);
        }},
    {"name": "if$subexpression$2", "symbols": ["variable"]},
    {"name": "if$subexpression$2", "symbols": ["string"]},
    {"name": "if$subexpression$2", "symbols": ["number"]},
    {"name": "if$subexpression$2", "symbols": ["boolean"]},
    {"name": "if$subexpression$2", "symbols": ["ondition"]},
    {"name": "if$subexpression$2", "symbols": ["object"]},
    {"name": "if$subexpression$2", "symbols": ["array"]},
    {"name": "if", "symbols": ["if$subexpression$2", "_", "than", "_", "value"], "postprocess":  d => {
        	if (Type.mayBeBoolean(d[0][0]))
        		return d[0][0] ? d[4] : null
        	else if (Type.isObject(d[0][0]) || Type.isArray(d[0][0]))
        		return d[4]
        	Type.TypeError('boolean convertable', d[0][0]);
        }},
    {"name": "condition", "symbols": ["boolean", "_", {"literal":"=="}, "_", "boolean"], "postprocess": d => d[0] === d[4]},
    {"name": "condition", "symbols": ["string", "_", {"literal":"=="}, "_", "string"], "postprocess": d => d[0] === d[4]},
    {"name": "condition", "symbols": ["myNull", "_", {"literal":"=="}, "_", "myNull"], "postprocess": d => d[0] === d[4]},
    {"name": "condition", "symbols": ["array", "_", {"literal":"=="}, "_", "array"], "postprocess": d => JSON.stringify(d[0]) === JSON.stringify(d[4])},
    {"name": "condition", "symbols": ["object", "_", {"literal":"=="}, "_", "object"], "postprocess": d => JSON.stringify(d[0]) === JSON.stringify(d[4])},
    {"name": "condition", "symbols": ["boolean", "_", {"literal":"!="}, "_", "boolean"], "postprocess": d => d[0] !== d[4]},
    {"name": "condition", "symbols": ["string", "_", {"literal":"!="}, "_", "string"], "postprocess": d => d[0] !== d[4]},
    {"name": "condition", "symbols": ["myNull", "_", {"literal":"!="}, "_", "myNull"], "postprocess": d => d[0] !== d[4]},
    {"name": "condition", "symbols": ["array", "_", {"literal":"!="}, "_", "array"], "postprocess": d => JSON.stringify(d[0]) !== JSON.stringify(d[4])},
    {"name": "condition", "symbols": ["object", "_", {"literal":"!="}, "_", "object"], "postprocess": d => JSON.stringify(d[0]) !== JSON.stringify(d[4])},
    {"name": "condition", "symbols": ["number", "_", {"literal":"=="}, "_", "number"], "postprocess": d => d[0] === d[4]},
    {"name": "condition", "symbols": ["number", "_", {"literal":"!="}, "_", "number"], "postprocess": d => d[0] !== d[4]},
    {"name": "condition", "symbols": ["number", "_", {"literal":">"}, "_", "number"], "postprocess": d => d[0] > d[4]},
    {"name": "condition", "symbols": ["number", "_", {"literal":"<"}, "_", "number"], "postprocess": d => d[0] < d[4]},
    {"name": "condition", "symbols": ["number", "_", {"literal":">="}, "_", "number"], "postprocess": d => d[0] >= d[4]},
    {"name": "condition", "symbols": ["number", "_", {"literal":"<="}, "_", "number"], "postprocess": d => d[0] <= d[4]},
    {"name": "condition", "symbols": ["condition", "_", (lexer.has("logical_and") ? {type: "logical_and"} : logical_and), "_", "condition"], "postprocess": d => d[0] && d[4]},
    {"name": "condition", "symbols": ["condition", "_", (lexer.has("logical_or") ? {type: "logical_or"} : logical_or), "_", "condition"], "postprocess": d => d[0] || d[4]},
    {"name": "condition", "symbols": ["conditionalValues", "_", (lexer.has("logical_and") ? {type: "logical_and"} : logical_and), "_", "conditionalValues"], "postprocess": d => d[0] && d[4]},
    {"name": "condition", "symbols": ["condition", "_", (lexer.has("logical_and") ? {type: "logical_and"} : logical_and), "_", "conditionalValues"], "postprocess": d => d[0] && d[4]},
    {"name": "condition", "symbols": ["conditionalValues", "_", (lexer.has("logical_and") ? {type: "logical_and"} : logical_and), "_", "condition"], "postprocess": d => d[0] && d[4]},
    {"name": "condition", "symbols": ["conditionalValues", "_", (lexer.has("logical_or") ? {type: "logical_or"} : logical_or), "_", "conditionalValues"], "postprocess": d => d[0] || d[4]},
    {"name": "condition", "symbols": ["conditionalValues", "_", (lexer.has("logical_or") ? {type: "logical_or"} : logical_or), "_", "condition"], "postprocess": d => d[0] || d[4]},
    {"name": "condition", "symbols": ["condition", "_", (lexer.has("logical_or") ? {type: "logical_or"} : logical_or), "_", "conditionalValues"], "postprocess": d => d[0] || d[4]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["string"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["number"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["myNull"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["array"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["object"]},
    {"name": "conditionalValues$subexpression$1", "symbols": ["boolean"]},
    {"name": "conditionalValues", "symbols": ["conditionalValues$subexpression$1"], "postprocess": d => d[0][0]},
    {"name": "conditionalValues", "symbols": [{"literal":"("}, "_", "if", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "conditionalValues", "symbols": [{"literal":"("}, "_", "conditionalValues", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseFloat(d[0].value)},
    {"name": "number", "symbols": [{"literal":"PI"}], "postprocess": d => 3.1415926536},
    {"name": "number", "symbols": [{"literal":"E"}], "postprocess": d => 2.7182818285},
    {"name": "number$subexpression$1", "symbols": ["objectItem"]},
    {"name": "number$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "number$subexpression$1", "symbols": ["variable"]},
    {"name": "number$subexpression$1", "symbols": ["function"]},
    {"name": "number", "symbols": ["number$subexpression$1"], "postprocess":  (d, l, reject) => {
        	if (!Type.isNumber(d[0][0]))
        		return reject;
        	return d[0][0];
        } },
    {"name": "string_concat", "symbols": ["string", "_", {"literal":"+"}, "_", "string"], "postprocess": d => d[0] + d[4]},
    {"name": "boolean", "symbols": [{"literal":"not"}, "_", (lexer.has("space") ? {type: "space"} : space), "_", "condition"], "postprocess": d => !d[4]},
    {"name": "boolean", "symbols": ["is", "_", (lexer.has("space") ? {type: "space"} : space), "_", "condition"], "postprocess": d => d[4]},
    {"name": "boolean", "symbols": [{"literal":"!"}, "_", "boolean"], "postprocess": d => !d[2]},
    {"name": "boolean", "symbols": [{"literal":"!"}, "_", {"literal":"("}, "_", "boolean", "_", {"literal":")"}], "postprocess": d => !d[4]},
    {"name": "boolean", "symbols": [{"literal":"true"}], "postprocess": d => true},
    {"name": "boolean", "symbols": [{"literal":"false"}], "postprocess": d => false},
    {"name": "boolean", "symbols": [{"literal":"("}, "_", "boolean", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "boolean", "symbols": [{"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "boolean", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isBoolean(d[0]))
        		return d[0]
        	return reject;
        } },
    {"name": "boolean", "symbols": ["function"], "postprocess":  (d, l, reject) => {
        	if (typeof d[0] !== 'boolean')
        		return reject;
        	return d[0]
        } },
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess": d => null},
    {"name": "myNull", "symbols": [{"literal":"("}, "_", "myNull", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "myNull$subexpression$1", "symbols": ["objectItem"]},
    {"name": "myNull$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "myNull$subexpression$1", "symbols": ["variable"]},
    {"name": "myNull$subexpression$1", "symbols": ["function"]},
    {"name": "myNull", "symbols": ["myNull$subexpression$1"], "postprocess":  (d, l, reject) => {
        	if (!Type.isNull(d[0][0]))
        		return reject;
        	return d[0][0];
        } },
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": function(d) { return {}; }},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "object$ebnf$2", "symbols": ["object$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "object$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "object$ebnf$2", "_", {"literal":"}"}], "postprocess": extractObject},
    {"name": "object$subexpression$1", "symbols": ["objectItem"]},
    {"name": "object$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "object$subexpression$1", "symbols": ["variable"]},
    {"name": "object$subexpression$1", "symbols": ["function"]},
    {"name": "object", "symbols": ["object$subexpression$1"], "postprocess":  (d, l, reject) => {
        	if (!Type.isObject(d[0][0]))
        		return reject;
        	return d[0][0];
        } },
    {"name": "objectItem", "symbols": ["object", "_", {"literal":"["}, "_", "string", "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0];
        	let s = d[4];
        	return getArrayItem(f[s]);
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
    {"name": "array$subexpression$1", "symbols": ["objectItem"]},
    {"name": "array$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "array$subexpression$1", "symbols": ["variable"]},
    {"name": "array$subexpression$1", "symbols": ["function"]},
    {"name": "array", "symbols": ["array$subexpression$1"], "postprocess":  (d, l, reject) => {
        	if (!Type.isArray(d[0][0]))
        		return reject;
        	return d[0][0];
        } },
    {"name": "arrayItem", "symbols": ["array", "_", {"literal":"["}, "_", "number", "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0];
        	let s = d[4];
        	return getArrayItem(f[s])
        }
        },
    {"name": "arrayItem", "symbols": ["array", "_", {"literal":"["}, "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0];
        	let s = f.length-1;
        	return getArrayItem(f[s])
        }
        },
    {"name": "function$subexpression$1$subexpression$1", "symbols": ["string"]},
    {"name": "function$subexpression$1$subexpression$1", "symbols": ["array"]},
    {"name": "function$subexpression$1$subexpression$1", "symbols": ["object"]},
    {"name": "function$subexpression$1", "symbols": ["function$subexpression$1$subexpression$1"], "postprocess":  d => {
        	let n = Object.values(d[0][0]);
        	if (n === undefined) return null;
        	return d[0][0];
        } },
    {"name": "function$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"."}, "_", (lexer.has("functionName") ? {type: "functionName"} : functionName), "arguments"]},
    {"name": "function$ebnf$1", "symbols": ["function$ebnf$1$subexpression$1"]},
    {"name": "function$ebnf$1$subexpression$2", "symbols": ["_", {"literal":"."}, "_", (lexer.has("functionName") ? {type: "functionName"} : functionName), "arguments"]},
    {"name": "function$ebnf$1", "symbols": ["function$ebnf$1", "function$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function", "symbols": [{"literal":"for"}, "_", "function$subexpression$1", "_", {"literal":"=>"}, "function$ebnf$1"], "postprocess":  d => {
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
        } },
    {"name": "function", "symbols": [(lexer.has("functionName") ? {type: "functionName"} : functionName), "arguments"], "postprocess":  d => {
        	if (!functions[d[0]])
        		Type.Error('Function is not defined.')
        	return functions[d[0].value](...d[1]);
        } },
    {"name": "function$subexpression$2", "symbols": ["string"]},
    {"name": "function$subexpression$2", "symbols": ["number"]},
    {"name": "function$subexpression$2", "symbols": ["array"]},
    {"name": "function$subexpression$2", "symbols": ["object"]},
    {"name": "function", "symbols": ["function$subexpression$2", "_", {"literal":"=>"}, "_", (lexer.has("functionName") ? {type: "functionName"} : functionName), "arguments"], "postprocess":  d => {
        	if (!functions[d[4]])
        		Type.Error('Function is not defined.')
        	return functions[d[4].value](d[0][0], ...d[5]);
        } },
    {"name": "arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": d => []},
    {"name": "arguments$ebnf$1", "symbols": []},
    {"name": "arguments$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "arguments$ebnf$1", "symbols": ["arguments$ebnf$1", "arguments$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments$ebnf$2", "symbols": ["arguments$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [{"literal":"("}, "_", "value", "arguments$ebnf$1", "arguments$ebnf$2", "_", {"literal":")"}], "postprocess": d => extractArray(d)},
    {"name": "value", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "value", "symbols": ["if"], "postprocess": id},
    {"name": "value", "symbols": ["html"], "postprocess": id},
    {"name": "value", "symbols": ["condition"], "postprocess": id},
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["object"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["import"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["hex"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": d => null},
    {"name": "hex", "symbols": [(lexer.has("hexLong") ? {type: "hexLong"} : hexLong)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": [(lexer.has("hexShort") ? {type: "hexShort"} : hexShort)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": [{"literal":"("}, "_", "hex", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "hex", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isHex(d[0]))
        		return d[0]
        	return reject;
        } },
    {"name": "hex", "symbols": ["function"], "postprocess":  (d, l, reject) => {
        	if (!Type.isHex(d[0]))
        		return reject;
        	return d[0];
        } },
    {"name": "string", "symbols": [(lexer.has("dstring") ? {type: "dstring"} : dstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": [(lexer.has("sstring") ? {type: "sstring"} : sstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": [(lexer.has("tstring") ? {type: "tstring"} : tstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": ["hex"], "postprocess": id},
    {"name": "string$subexpression$1", "symbols": ["objectItem"]},
    {"name": "string$subexpression$1", "symbols": ["arrayItem"]},
    {"name": "string$subexpression$1", "symbols": ["variable"]},
    {"name": "string$subexpression$1", "symbols": ["function"]},
    {"name": "string", "symbols": ["string$subexpression$1"], "postprocess":  (d, l, reject) => {
        	if (!Type.isString(d[0][0]))
        		return reject;
        	return d[0][0];
        } },
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
    {"name": "string", "symbols": ["string", "_", {"literal":"["}, "_", "number", "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0];
        	let s = d[4];
        	return f[s];
        }
        },
    {"name": "string", "symbols": ["string", "_", {"literal":"["}, "_", {"literal":"]"}], "postprocess":  (d, l, reject) => {
        	let f = d[0];
        	let s = f.length-1
        	return f[s];
        } },
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
        	if (/\.json$/.test(d[0])) {
        		let read = readFile(d[0])
        		return JSON.parse(read.trim());
        	}
        	else {
        		console.error(`[File Error]: "${d[0]}" is not found or is not json formated.`)
        		return null
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
