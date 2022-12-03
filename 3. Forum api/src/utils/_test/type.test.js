const { currentDateIso, currentDate } = require('../time');
const { isString, isNotString } = require('../type');

describe('type function', () => {
  it('should success', () => {
    // Action & Assert
    expect(isString('')).toBe(true);
    expect(isString('asd')).toBe(true);
    expect(isString(false)).toBe(false);

    expect(isNotString('')).toBe(false);
    expect(isNotString('asd')).toBe(false);
    expect(isNotString(false)).toBe(true);
  });
});
