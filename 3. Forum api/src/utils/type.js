const isString = (val) => typeof val === 'string';
const isNotString = (val) => !isString(val);

module.exports = { isString, isNotString };
