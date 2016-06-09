jest.unmock('@utils/getActiveGoal');
jest.unmock('immutable');

const Immutable = require('immutable');
const getActiveGoal = require('@utils/getActiveGoal');

describe('`getActiveGoal()`', () => {
  it('should accept an `Immutable.Map` object with a `solutions` property and return the first solution whose `completed` property is false, or undefined if none is false', () => {
    const result1 = getActiveGoal(Immutable.fromJS({
      solutions: [
        {id: 0, completed: false},
        {id: 1, completed: false},
      ],
    }));
    const result2 = getActiveGoal(Immutable.fromJS({
      solutions: [
        {id: 0, completed: true},
        {id: 1, completed: false},
      ],
    }));
    const result3 = getActiveGoal(Immutable.fromJS({
      solutions: [
        {id: 0, completed: true},
        {id: 1, completed: true},
      ],
    }));

    expect(result1.get('id')).toBe(0);
    expect(result2.get('id')).toBe(1);
    expect(result3).toBe(undefined);
  });
});
