// const Immutable = require('immutable');
// const Random = require('random-js');
//
//
// // Polyfill:
// Number.isInteger = Number.isInteger || function isInteger(value) {
//   return typeof value === 'number' &&
//     isFinite(value) &&
//     Math.floor(value) === value;
// };
//
//
// /*
//   Board layout is:
//     0 1 2
//     3 4 5
//     6 7 8
//   where id's 1, 3, 5, 7 are operators, and rest are numbers.
// */
//
// function isOperator(value) {
//   if (value === '+' || value === '-') {
//     return true;
//   }
//   else {
//     return false;
//   }
// }
//
// function isNumber(value) {
//   return Number.isInteger(value);
// }
//
// function generateBoardLayout(seed) {
//   let r = new Random();
//
//   if (seed) {
//     r = r.seed(seed);
//   }
//
//   const operators = ['+', '-', '-', '+'];
//   const numbers = (() => {
//     const result = [];
//
//     for (let i = 0; i < 5; i++) {
//       result.push(r.integer(0, 9));
//     }
//
//     return result;
//   })();
//
//   return Immutable.fromJS([
//     numbers.shift(),
//     operators.shift(),
//     numbers.shift(),
//
//     operators.shift(),
//     numbers.shift(),
//     operators.shift(),
//
//     numbers.shift(),
//     operators.shift(),
//     numbers.shift(),
//   ]);
// }
//
// function generateAnswers({boardLayout, length, seed, numberOfAnswers}) {
//   let r = new Random();
//
//   if (seed) {
//     r = r.seed(seed);
//   }
//
//   const answers = [];
//   let i = 0;
//
//   while (i < numberOfAnswers) {
//     const answer = generateOneAnswer();
//
//     if (answer.sum < 1) {
//       continue;
//     }
//
//     if (answers.find(a => a.sum === answer.sum)) {
//       continue;
//     }
//
//     answers.push(answer);
//
//     i++;
//   }
//
//   return Immutable.fromJS(answers);
//
//   function generateOneAnswer() {
//     const path = [];
//     const startingPoint = r.pick([0, 2, 4, 6, 8]);
//
//     path.push(startingPoint);
//
//     let i = 0;
//
//     while (i < length - 1) {
//       //  Equals: move left, move right, move up, move left:
//       const move = r.pick([-1, 1, -3, 3]);
//       const currentPosition = path[path.lenght - 1];
//       const nextPosition = currentPosition + move;
//       const currentValue = boardLayout.get(currentPosition);
//       const nextValue = boardLayout.get(nextPosition);
//
//       if (path.find(id => id === nextPosition)) {
//         continue;
//       }
//
//       if (!boardLayout.get(nextPosition)) {
//         continue;
//       }
//
//       if (
//         (isNumber(currentValue) && isNumber(nextValue)) ||
//         (isOperator(currentValue) && isOperator(nextValue))
//       ) {
//         continue;
//       }
//
//       path.push(nextValue);
//
//       i++;
//     }
//
//     return {
//       path,
//       sum: makeSumForAnswer(path),
//     };
//   }
//
//   function makeSumForAnswer(path) {
//     path = path.slice();
//
//     const length = path.length;
//     let sum = 0;
//     let num1;
//     let num2;
//     let operator;
//
//     for (let i = 0; i < length - 1; i++) {
//       if (!num1) {
//         num1 = path.shift();
//
//         continue;
//       }
//       else if (!operator) {
//         operator = path.shift();
//
//         continue;
//       }
//       else if (!num2) {
//         num2 = path.shift();
//
//         if (operator === '+') {
//           sum += add(num1, num2);
//         }
//         else if (operator === '-') {
//           sum += subtract(num1, num2);
//         }
//
//         num1 = sum;
//
//         num2 = operator = undefined;
//       }
//     }
//
//     return sum;
//
//     function add(num1, num2) {
//       return num1 + num2;
//     }
//
//     function subtract(num1, num2) {
//       return num1 - num2;
//     }
//   }
// }
//
// function createNewBoard(seed) {
//   const boardLayout = generateBoardLayout(seed);
//   const answersLength2 = generateAnswers({
//     boardLayout,
//     length: 2,
//     numberOfAnswers: 3,
//     seed,
//   });
//
//   return Immutable.fromJS({
//     boardLayout,
//     answersLength2,
//   });
// }
//
//
// module.exports = {
//   createNewBoard,
// };

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


function generateBoardLayout(random) {
  const r = random || new Random();

  const operators = ['+', '-', '-', '+'];
  const numbers = [];
  let i = 0;

  while (i < 5) {
    const newNumber = r.integer(0, 9);

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

function generateSolutions(boardLayout, random) {
  const r = random || new Random();

  /*  Lengths are:
      - 3 for 2 numbers and 1 operator,
      - 5 for 3 numbers and 2 operators.
  */
  const solutions = {
    length2: generateSolutionsOfGivenLength(3, boardLayout, r),
    length3: generateSolutionsOfGivenLength(5, boardLayout, r),
  };

  return Immutable.fromJS(solutions);
}

function generateSolutionsOfGivenLength(length, boardLayout, r) {
  const solutions = [];
  let i = 0;

  while (i < 3) {
    const solution = generateOneSolution(length, boardLayout, r);

    solutions.push(solution);

    i++;
  }

  return solutions;
}

function generateOneSolution(length, boardLayout, r) {
  // const path = generatePath(length, boardLayout, r);
  const path = new Array(length);

  // console.log(path.map(x => boardLayout.get(x)));

  return {
    sum: 0,
    path,
  };
}

function generatePath(length, boardLayout, r) {
  const path = [];
  const startingPoint = r.pick([0, 2, 4, 6, 8]);

  path.push(startingPoint);

  let i = 0;

  while (i < length) {
    const move = r.pick([-1, 1, -3, 3]);
    const currentPosition = path[path.length - 1];
    const nextPosition = currentPosition + move;
    const currentValue = boardLayout.get(currentPosition);
    const nextValue = boardLayout.get(nextPosition);

    // Check whether the next field even exists:
    if (!nextValue) {
      continue;
    }

    // Don't visit already visited fields:
    if (path.find(id => id === nextPosition)) {
      continue;
    }

    // Don't visit two numbers or two operators in a row:
    if (
      (isNumber(currentValue) && isNumber(nextValue)) ||
      (isOperator(currentValue) && isOperator(nextValue))
    ) {
      continue;
    }

    path.push(nextPosition);

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
    throw new Error('Invalid path!');
  }
}

function createNewBoard(seed) {
  let random;

  if (seed) {
    random = new Random(Random.engines.mt19937().seed(seed));
  }

  const boardLayout = generateBoardLayout(random);
  const solutions = generateSolutions(boardLayout, random);

  return Immutable.fromJS({
    boardLayout,
    solutions,
  });
}


module.exports = {
  createNewBoard,
  generateSum,
  __testing: {
    generateBoardLayout,
  },
};
