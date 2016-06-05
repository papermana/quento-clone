jest.unmock('@stores/boardStoreUtils');
jest.unmock('random-js');

const Immutable = require('immutable');
const boardStoreUtils = require('@stores/boardStoreUtils');

describe('A set of utility functions for the BoardStore', () => {

  describe('A function which generates a board layout together with a set of answers for it', () => {

    it('should create a new Immutable object containing a boardLayout property', () => {
      const result = boardStoreUtils.createNewBoard();

      expect(Immutable.Map.isMap(result)).toBe(true);
      expect(result.get('boardLayout')).toBeDefined();
    });

  });

});
