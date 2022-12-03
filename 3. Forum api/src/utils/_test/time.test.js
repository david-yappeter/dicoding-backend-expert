const { currentDateIso, currentDate } = require('../time');

describe('time function', () => {
  it('should not error', () => {
    // Action & Assert
    expect(() => currentDate()).not.toThrow();
    expect(currentDate()).toBeInstanceOf(Date);

    expect(() => currentDateIso()).not.toThrow();
    expect(typeof currentDateIso()).toBe('string');
  });
});
