const { isNumber } = require('./utils/number');

const MathBasic = {
  add: (...args) => {
    if (args.length !== 2) {
      throw new Error('fungsi add hanya menerima dua parameter');
    }

    const [a, b] = args;

    if (!isNumber(a) || !isNumber(b)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    return a + b;
  },
  subtract: (...args) => {
    if (args.length !== 2) {
      throw new Error('fungsi substract hanya menerima dua parameter');
    }

    const [a, b] = args;

    if (!isNumber(a) || !isNumber(b)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    return a - b;
  },
  multiply: (...args) => {
    if (args.length !== 2) {
      throw new Error('fungsi multiply hanya menerima dua parameter');
    }

    const [a, b] = args;

    if (!isNumber(a) || !isNumber(b)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    return a * b;
  },
  divide: (...args) => {
    if (args.length !== 2) {
      throw new Error('fungsi divide hanya menerima dua parameter');
    }

    const [a, b] = args;

    if (b === 0) {
      throw new Error('Divide By Zero Error');
    }

    if (!isNumber(a) || !isNumber(b)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    return a / b;
  },
};

module.exports = MathBasic;
