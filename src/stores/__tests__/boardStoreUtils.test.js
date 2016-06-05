jest.unmock('@stores/boardStoreUtils');
jest.unmock('random-js');
jest.unmock('immutable');

const Immutable = require('immutable');
const boardStoreUtils = require('@stores/boardStoreUtils');

describe('A set of utility functions for the BoardStore', () => {

  describe('A function which generates a board layout together with a set of answers for it', () => {

    it('should create a new Immutable object containing a boardLayout, answersLength2 and answersLength3 properties', () => {
      const result = boardStoreUtils.createNewBoard();

      expect(Immutable.Map.isMap(result)).toBe(true);
      expect(result.get('boardLayout')).toBeDefined();
      expect(result.get('answersLength2')).toBeDefined();
      expect(result.get('answersLength3')).toBeDefined();
    });

    it('should contain a boardLayout property, which is an Immutable.List containing 9 values; values with indices of 1, 3, 5, 7 should be strings containing either "+" or "-", while the rest should be integers', () => {
      const result = boardStoreUtils.createNewBoard();
      const layout = result.get('boardLayout');
      const operators = layout.filter((value, key) => {
        return key === 1 || key === 3 || key === 5 || key === 7;
      });
      const numbers = layout.filter((value, key) => {
        return key !== 1 && key !== 3 && key !== 5 && key !== 7;
      });

      expect(Immutable.List.isList(layout)).toBe(true);
      expect(layout.size).toBe(9);
      expect(operators.every(value => value === '+' || value === '-')).toBe(true);
      expect(numbers.every(value => Number.isInteger(value))).toBe(true);
    });

    it('should return a new, random boardLayout every time it is called', () => {
      const result1 = boardStoreUtils.createNewBoard().get('boardLayout');
      const result2 = boardStoreUtils.createNewBoard().get('boardLayout');

      expect(result1.equals(result2)).toBe(false);
    });

    it('should accept a numerical seed value, and ensure that every boardLayout generated with the same seed is the same', () => {
      const seed = 123456;
      const result1 = boardStoreUtils.createNewBoard(seed).get('boardLayout');
      const result2 = boardStoreUtils.createNewBoard(seed).get('boardLayout');

      expect(result1.equals(result2)).toBe(true);
    });

  });

});
