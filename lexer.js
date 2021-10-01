const moo = require('moo');

module.exports = moo.compile({
	htmlContent: {
		match: /\(\s*\(?:(?!>\s*\))*<[\s\S]+\>\s*\)/, lineBreaks: true
	},
	functionName: [
		{
			match: /error|log|Number|String|Boolean|Array|Object|isNull/,
		},
		{
			// functions with number output
			match: /sqrt|pow|length|join|random|invert|abs|round|sum|reduce|multiply|divide/
		}
	],
	// hexadecimals
	hexLong: /#[A-Za-z0-9]{6}/, // used for css colors
	hexShort: /#[A-Za-z0-9]{3}/, // used for css colors
	number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	property: /(?:--)?[A-Za-z_]+[A-Za-z0-9_-]*[A-Za-z0-9_]*/,
	comment: /\/\/.*/,
	operator: /\+|-|\/|\*|%/,
	// commentBlock: /\/\*[.*|\r?\n]\*\//, // /* ... */
    space: {match: /\s+/, lineBreaks: true},
	random: "random",
	// join: "join",
	PI: 'PI',
	// length: "length",
	//log: "log",
	dstring: {match: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/},
	sstring: {match: /'(?:\\['fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/, value: x => x.slice(1, -1)},
	tstring: {match: /`(?:\\[`fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/, lineBreaks: true, value: x => x.slice(1, -1)},
	htmlContent: {match: /html`(?:\\[`fnrt\/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/, lineBreaks: true, value: x => x.slice(4)},
	variableName: /\$[A-Za-z_0-9\$]+/,
	'?': /\?|than/,
    'else': /else|\:/,
	'>': '>',
	'<': '<',
	'>=': '>=',
	'<=': '<=',
	'!=': '!=',
	// '!==': '!==',
	'==': '==',
	// '===': '===',
	'logical_and': /^and$|&&/,
	'logical_or': /or|\|\|/,
	'not': /^not$/,
	'is': /^is$/,
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
})