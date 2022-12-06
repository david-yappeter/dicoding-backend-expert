const { currentDateIso, currentDate } = require('../time');

describe('time function', () => {
  it('should not error', () => {
    // Action & Assert
    expect(() => currentDate()).not.toThrow(Error);
    expect(currentDate()).toBeInstanceOf(Date);

    expect(() => currentDateIso()).not.toThrow(Error);
    expect(typeof currentDateIso()).toBe('string');
  });
});
