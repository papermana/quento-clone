jest.unmock('@stores/boardStoreUtils');
jest.unmock('random-js');
jest.unmock('immutable');

const Immutable = require('immutable');
const boardStoreUtils = require('@stores/boardStoreUtils');

describe('A set of utility functions for the BoardStore', () => {

  describe('A function which generates a board layout together with a set of solutions for it', () => {
    it('should create a new `Immutable.js` object containing a `boardLayout` and `solutions` properties', () => {
      const result = boardStoreUtils.createNewBoard();

      expect(Immutable.Map.isMap(result)).toBe(true);
      expect(result.get('boardLayout')).toBeDefined();
      expect(result.get('solutions')).toBeDefined();
    });

    describe('An object which contains a layout for the board', () => {
      it('should be an `Immutable.List` containing 9 values; values with indices of `1`, `3`, `5`, `7` should be strings containing either "+" or "-", while the rest should be integers', () => {
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

      // ISSUE: this is random! So no way of testing it well:
      it('should contain all unique numbers', () => {
        const layout = boardStoreUtils.createNewBoard().get('boardLayout');
        let allNumbersUnique = true;
        const numbersSoFar = [];

        layout.forEach(value => {
          if (!allNumbersUnique) {
            return;
          }
          else if (value === '+' || value === '-') {
            return;
          }
          else if (numbersSoFar.includes(value)) {
            allNumbersUnique = false;

            return;
          }
          else {
            numbersSoFar.push(value);
          }
        });

        expect(allNumbersUnique).toBe(true);
      });

      it('should return a new, random `boardLayout` every time it is called', () => {
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

    describe('An object containing solutions for the board that serve as challenges to the player', () => {
      it('should be an `Immutable.Map` containing properties called `length2` and `length3`; each of those should be an `Immutable.List` containing `Immutable.Map` objects having a `sum` property, which is an integer, and a `path` property, which is an `Immutable.List` of a `size` indicated by the name of the `lengthX` parent property', () => {
        const result = boardStoreUtils.createNewBoard();
        const solutions = result.get('solutions');
        const length2 = solutions.get('length2');
        const length3 = solutions.get('length3');

        expect(Immutable.Map.isMap(solutions)).toBe(true);

        [{
          ref: length2,
          size: 3,
        },
        {
          ref: length3,
          size: 5,
        }]
        .forEach(({ref, size}) => {
          expect(ref).toBeDefined();
          expect(Immutable.List.isList(ref)).toBe(true);

          ref.forEach(solution => forEachSolution(solution, size));
        });

        function forEachSolution(solution, size) {
          const sum = solution.get('sum');
          const path = solution.get('path');

          expect(Immutable.Map.isMap(solution)).toBe(true);
          expect(sum).toBeDefined();
          expect(Number.isInteger(sum)).toBe(true);
          expect(path).toBeDefined();
          expect(Immutable.List.isList(path)).toBe(true);
          expect(path.size).toBe(size);
        }
      });
    });

  });

});
