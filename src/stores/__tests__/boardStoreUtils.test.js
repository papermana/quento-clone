jest.unmock('@stores/boardStoreUtils');
jest.unmock('random-js');
jest.unmock('immutable');

const Immutable = require('immutable');
const boardStoreUtils = require('@stores/boardStoreUtils');

describe('A set of utility functions for the BoardStore', () => {

  describe('A function which generates a board layout together with a set of solutions for it', () => {
    it('should create a new `Immutable.js` object containing a `boardLayout` and `challenges` properties', () => {
      const result = boardStoreUtils.createNewBoard();

      expect(Immutable.Map.isMap(result)).toBe(true);
      expect(result.get('boardLayout')).toBeDefined();
      expect(result.get('challenges')).toBeDefined();
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
      it('should be an `Immutable.List` containing a number of `Immutable.Map` objects, each with a `length` property, which is numerical, and a `solutions` property, which is another `Immutable.List`; the `solutions` property contains 3 `Immutable.Map` objects having a `sum` property, which is an integer, and a `path` property, which is an `Immutable.List` of a `size` indicated by the aforementioned `length` property', () => {
        const result = boardStoreUtils.createNewBoard();
        const challenges = result.get('challenges');

        expect(Immutable.List.isList(challenges)).toBe(true);

        /*
          challenges: [
            {
              length: number,
              solutions: [solution, solution, solution],
            },
            ...
          ]

          solution: {
            sum: number,
            path: [...],
          }
        */

        challenges.forEach(challenge => {
          const length = challenge.get('length');
          const solutions = challenge.get('solutions');

          expect(challenge).toBeDefined();
          expect(Immutable.Map.isMap(challenge)).toBe(true);

          expect(length).toBeDefined();
          expect(Number.isInteger(length)).toBe(true);

          expect(solutions).toBeDefined();
          expect(Immutable.List.isList(solutions)).toBe(true);
          expect(solutions.size).toBe(3);

          solutions.forEach(solution => forEachSolution(solution, length));
        });

        function forEachSolution(solution, size) {
          const sum = solution.get('sum');
          const path = solution.get('path');

          expect(Immutable.Map.isMap(solution)).toBe(true);
          expect(sum).toBeDefined();
          expect(Number.isInteger(sum)).toBe(true);
          expect(sum > 0).toBe(true);
          expect(path).toBeDefined();
          expect(Immutable.List.isList(path)).toBe(true);
          expect(path.size).toBe(size);
        }
      });

      it('should have a `path` property, which should start and end with a number, and use a number for all even indices and an operator for uneven ones', () => {
        const result = boardStoreUtils.createNewBoard();
        const boardLayout = result.get('boardLayout');
        const challenges = result.get('challenges');

        challenges.forEach(challenge => {
          challenge.get('solutions').forEach(solution => {
            const path = solution.get('path');

            expect(Number.isInteger(path.get(0))).toBe(true);
            expect(Number.isInteger(path.get(path.size - 1))).toBe(true);

            path.forEach((value, key) => {
              value = boardLayout.get(value);

              if (key % 2 === 0) {
                expect(Number.isInteger(value)).toBe(true);
              }
              else {
                expect(value === '+' || value === '-').toBe(true);
              }
            });
          });
        });
      });
    });

  });

  describe('A function that sums values located in a path', () => {
    it('should accept an array of numbers and strings "+" and "-", and return a sum of those values', () => {
      const sumFunc = boardStoreUtils.generateSum;
      const path1 = [1, '+', 1];
      const path2 = [2, '-', 3];
      const path3 = [4, '+', 5, '-', 6];
      const path4 = [1, '+', 2, '+', 3, '-', 4, '-', 5];

      expect(sumFunc(path1)).toBe(2);
      expect(sumFunc(path2)).toBe(-1);
      expect(sumFunc(path3)).toBe(3);
      expect(sumFunc(path4)).toBe(-3);
    });
  });

});
