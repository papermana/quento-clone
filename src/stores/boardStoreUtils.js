const Immutable = require('immutable');
const Random = require('random-js');


/*
  The board has a shape of a 3x3 square. A correctly generated board layout should be an Immutable.List whose indices will be laid out as follows:
    0 1 2
    3 4 5
    6 7 8

  This board is composed of 4 operators and 5 numbers, looking as such (n = number, o = operator):
    n o n
    o n o
    n o n

  Right now the operators can only be 'plus' and 'minus', and they're position on the board can only be as follows:
    n + n
    - n -
    n + n
*/


function isNumber(value) {
  // Polyfill for Number.isInteger:
  return (
    typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value
  );
}

function isOperator(value) {
  return value === '+' || value === '-';
}

function possibleMoves(position) {
  const possibleMoves = [];

  if (!(position % 3 === 0)) {
    possibleMoves.push(-1);
  }
  if (!(position % 3 === 2)) {
    possibleMoves.push(1);
  }
  if (!(position < 3)) {
    possibleMoves.push(-3);
  }
  if (!(position > 5)) {
    possibleMoves.push(3);
  }

  return possibleMoves;
}

function generateBoardLayout(random) {
  const r = random || new Random(Random.engines.mt19937().autoSeed());

  const operators = ['+', '-', '-', '+'];
  const numbers = [];
  let i = 0;

  while (i < 5) {
    const newNumber = r.integer(1, 9);

    if (numbers.indexOf(newNumber) === -1) {
      numbers.push(newNumber);

      i++;
    }
  }

  return Immutable.fromJS([
    numbers.shift(),
    operators.shift(),
    numbers.shift(),

    operators.shift(),
    numbers.shift(),
    operators.shift(),

    numbers.shift(),
    operators.shift(),
    numbers.shift(),
  ]);
}

function generateChallenges(boardLayout, random) {
  const r = random || new Random(Random.engines.mt19937().autoSeed());

  /*  Lengths are:
      - 3 for 2 numbers and 1 operator,
      - 5 for 3 numbers and 2 operators.
  */
  const challenges = [
    generateSolutions(3, boardLayout, r, 0),
    generateSolutions(5, boardLayout, r, 1),
  ];

  return Immutable.fromJS(challenges);
}

function generateSolutions(length, boardLayout, r, id) {
  const result = {
    id,
    length,
    solutions: [],
  };

  let i = 0;

  while (i < 3) {
    const solution = generateOneSolution(length, boardLayout, r, i);

    // No repeating solutions:
    if (
      result.solutions.some(sol => sol.sum === solution.sum)
    ) {
      continue;
    }

    // All solutions must have a sum of 1 or more:
    if (solution.sum <= 0) {
      continue;
    }

    result.solutions.push(solution);

    i++;
  }

  return result;
}

function generateOneSolution(length, boardLayout, r, id) {
  const path = generatePath(length, boardLayout, r);

  return {
    id,
    sum: generateSum(path.map(position => boardLayout.get(position))),
    path,
    completed: false,
  };
}

function generatePath(length, boardLayout, r) {
  const path = [];
  const startingPoint = r.pick([0, 2, 4, 6, 8]);

  path.push(startingPoint);

  let i = 0;
  let possibleMovesList = [];
  let lastMove;

  while (i < length - 1) {
    const currentPosition = path[path.length - 1];

    if (possibleMovesList.length === 0) {
      possibleMovesList = possibleMoves(currentPosition);

      if (lastMove) {
        possibleMovesList = possibleMovesList.filter(move => move !== lastMove * -1);
      }
    }

    const move = r.pick(possibleMovesList);
    const nextPosition = currentPosition + move;
    // const currentValue = boardLayout.get(currentPosition);
    // const nextValue = boardLayout.get(nextPosition);

    // Since the board is 3x3, only positions 0-8 are accepted:
    // if (nextPosition < 0 || nextPosition > 8) {
    //   continue;
    // }

    // Don't visit already visited fields:
    if (path.find(id => id === nextPosition)) {
      continue;
    }

    // Don't visit two numbers or two operators in a row:
    // if (
    //   (isNumber(currentValue) && isNumber(nextValue)) ||
    //   (isOperator(currentValue) && isOperator(nextValue))
    // ) {
    //   continue;
    // }

    path.push(nextPosition);

    possibleMovesList = [];
    lastMove = move;

    i++;
  }

  return path;
}

function generateSum(path) {
  path = path.slice();

  const length = path.length;
  let sum = 0;
  let number1;
  let operator;
  let number2;

  for (let i = 0; i < length; i++) {
    if (!number1) {
      number1 = path.shift();

      if (!isNumber(number1)) {
        throwError();

        return 0;
      }
    }
    else if (!operator) {
      operator = path.shift();

      if (!isOperator(operator)) {
        throwError();

        return 0;
      }
    }
    else if (!number2) {
      number2 = path.shift();

      if (!isNumber(number2)) {
        throwError();

        return 0;
      }

      const func = operator === '+' ? add : subtract;

      sum = func(number1, number2);

      number1 = sum;

      number2 = operator = undefined;
    }
  }

  return sum;

  function add(n1, n2) {
    return n1 + n2;
  }

  function subtract(n1, n2) {
    return n1 - n2;
  }

  function throwError() {
    throw new Error('Invalid path!\n' + path);
  }
}

function createNewBoard(seed) {
  let random;

  if (seed) {
    random = new Random(Random.engines.mt19937().seed(seed));
  }

  const boardLayout = generateBoardLayout(random);
  const challenges = generateChallenges(boardLayout, random);

  return Immutable.fromJS({
    boardLayout,
    challenges,
  });
}


module.exports = {
  createNewBoard,
  generateSum,
  isOperator,
  isNumber,
  possibleMoves,
};
