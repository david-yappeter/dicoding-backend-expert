const { isNumber } = require('./utils/number');

class FigureCalculator {
  constructor(mathBasic) {
    this._mathBasic = mathBasic;
  }

  calculateRectanglePerimeter(...args) {
    if (args.length !== 2) {
      throw new Error('fungsi hanya menerima dua parameter');
    }

    const [length, width] = args;

    if (!isNumber(length) || !isNumber(width)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    // formula: (2 * (length + width))
    return this._mathBasic.multiply(2, this._mathBasic.add(length, width));
  }

  calculateRectangleArea(...args) {
    if (args.length !== 2) {
      throw new Error('fungsi hanya menerima dua parameter');
    }

    const [length, width] = args;

    if (!isNumber(length) || !isNumber(width)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    // formula: (length * width)
    return this._mathBasic.multiply(length, width);
  }

  calculateTrianglePerimeter(...args) {
    if (args.length !== 3) {
      throw new Error('fungsi hanya menerima tiga parameter');
    }

    const [a, b, c] = args;

    if (!isNumber(a) || !isNumber(b) || !isNumber(c)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    // formula: (a + b + c)
    return this._mathBasic.add(a, this._mathBasic.add(b, c));
  }

  calculateTriangleArea(...args) {
    if (args.length !== 2) {
      throw new Error('fungsi hanya menerima dua parameter');
    }

    const [a, b] = args;

    if (!isNumber(a) || !isNumber(b)) {
      throw new Error('fungsi hanya menerima parameter number');
    }

    // formula: (a * b) / 2
    return this._mathBasic.divide(this._mathBasic.multiply(a, b), 2);
  }
}

module.exports = FigureCalculator;
