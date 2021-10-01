function Type(item) {
	switch (typeof item) {
		case 'string':
			if (/^(#[A-Za-z0-9]{3}|#[A-Za-z0-9]{6})$/gi.test(item))
				return 'hex';
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
Type.isHex = (item) => {
	return Type(item) === 'hex'
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
// --- errors ---
Type.TypeError = (expectedType, recieved) => {
	console.error(`[TypeError]: Unexpected input type. Expected "${expectedType}", recieved "${typeof recieved}".`);
	throw '[Output]: File is skipped.'
}
Type.Error = (message) => {
	console.error('[Error]: '+message)
	throw '[Output]: File is skipped.'
}
Type.ArgumentError = (message) => {
	console.error('[Argument TypeError]: '+message)
	throw '[Output]: File is skipped.'
}

Type.isFalsy = (item) => {
	return item === null || item === undefined || item === 0 || item === false
}
Type.mayBeBoolean = item => {
	let type = Type(item)
	return ['string', 'number', 'boolean', 'null'].includes(type)
}
Type.isJson = item => {
	let type = Type(item)
	return ['string', 'object', 'number', 'array', 'boolean', 'null'].includes(type)
}
module.exports = Type