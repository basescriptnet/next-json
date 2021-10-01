// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	//console.clear()
	const lexer = require('./lexer');
	let log = console.log.bind(console)



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
    {"name": "json", "symbols": ["_", "myNull", "_"], "postprocess": d => null},
    {"name": "html", "symbols": [(lexer.has("htmlContent") ? {type: "htmlContent"} : htmlContent)], "postprocess": d => d[0].value},
    {"name": "varName", "symbols": [(lexer.has("variableName") ? {type: "variableName"} : variableName)], "postprocess": d => d[0].value},
    {"name": "variable", "symbols": ["varName"], "postprocess":  (d, l, reject) => {
        	if (getValue(d[0]) === undefined) return reject;
        	return getValue(d[0])
        } },
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
    {"name": "number", "symbols": ["function"], "postprocess":  (d, l, reject) => {
        	if (!Type.isNumber(d[0]))
        		return reject;
        	return d[0];
        } },
    {"name": "number", "symbols": [{"literal":"("}, "_", "number", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "number", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isNumber(d[0]))
        		return d[0]
        	return reject;
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
    {"name": "myNull", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (d[0] === null)
        		return null
        	return reject;
        } },
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
    {"name": "object", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isObject(d[0]))
        		return d[0]
        	return reject;
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
    {"name": "array", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isArray(d[0]))
        		return d[0]
        	return reject;
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
    {"name": "function", "symbols": [(lexer.has("functionName") ? {type: "functionName"} : functionName), "arguments"], "postprocess":  d => {
        	if (!functions[d[0]])
        		Type.Error('Function is not defined.')
        	return functions[d[0]](...d[1]);
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
    {"name": "value", "symbols": ["objectItem"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["arrayItem"], "postprocess": id},
    {"name": "value", "symbols": ["import"], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["hex"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": d => null},
    {"name": "hex", "symbols": [(lexer.has("hexLong") ? {type: "hexLong"} : hexLong)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": [(lexer.has("hexShort") ? {type: "hexShort"} : hexShort)], "postprocess": d => d[0].value},
    {"name": "hex", "symbols": [{"literal":"("}, "_", "hex", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "hex", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isHex(d[0]))
        		return d[0]
        	return reject;
        } },
    {"name": "string", "symbols": [(lexer.has("dstring") ? {type: "dstring"} : dstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": [(lexer.has("sstring") ? {type: "sstring"} : sstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": [(lexer.has("tstring") ? {type: "tstring"} : tstring)], "postprocess": d => d[0].value},
    {"name": "string", "symbols": ["hex"], "postprocess": id},
    {"name": "string", "symbols": ["function"], "postprocess":  (d, l, reject) => {
        	if (!Type.isString(d[0]))
        		return reject;
        	return d[0];
        } },
    {"name": "string", "symbols": [{"literal":"("}, "_", "string", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "string", "symbols": ["variable"], "postprocess":  (d, l, reject) => {
        	if (Type.isString(d[0]))
        		return d[0]
        	return reject;
        } },
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
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
