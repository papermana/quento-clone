const Immutable = require('immutable');
const Random = require('random-js');


// Polyfill:
Number.isInteger = Number.isInteger || function isInteger(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
};


/*
  Board layout is:
    0 1 2
    3 4 5
    6 7 8
  where id's 1, 3, 5, 7 are operators, and rest are numbers.
*/

function isOperator(value) {
  if (value === '+' || value === '-') {
    return true;
  }
  else {
    return false;
  }
}

function isNumber(value) {
  return Number.isInteger(value);
}

function generateBoardLayout(seed) {
  let r = new Random();

  if (seed) {
    r = r.seed(seed);
  }

  const operators = ['+', '-', '-', '+'];
  const numbers = (() => {
    const result = [];

    for (let i = 0; i < 5; i++) {
      result.push(r.integer(0, 9));
    }

    return result;
  })();

  return Immutable.fromJS([
    numbers.unshift(),
    operators.unshift(),
    numbers.unshift(),

    operators.unshift(),
    numbers.unshift(),
    operators.unshift(),

    numbers.unshift(),
    operators.unshift(),
    numbers.unshift(),
  ]);
}

function generateAnswers({boardLayout, length, seed, numberOfAnswers}) {
  let r = new Random();

  if (seed) {
    r = r.seed(seed);
  }

  const answers = [];
  let i = 0;

  while (i < numberOfAnswers) {
    const answer = generateOneAnswer();

    if (answers.find(a => a.equals(answer))) {
      continue;
    }

    answers.push(answer);

    i++;
  }

  return Immutable.fromJS(answers);

  function generateOneAnswer() {
    const path = [];
    const startingPoint = r.pick([0, 2, 4, 6, 8]);

    path.push(startingPoint);

    let i = 0;

    while (i < length - 1) {
      //  Equals: move left, move right, move up, move left:
      const move = r.pick([-1, 1, -3, 3]);
      const currentPosition = path[path.lenght - 1];
      const nextPosition = currentPosition + move;
      const currentValue = boardLayout.get(currentPosition);
      const nextValue = boardLayout.get(nextPosition);

      if (path.find(id => id === nextPosition)) {
        continue;
      }

      if (!boardLayout.get(nextPosition)) {
        continue;
      }

      if (
        (isNumber(currentValue) && isNumber(nextValue)) ||
        (isOperator(currentValue) && isOperator(nextValue))
      ) {
        continue;
      }

      path.push(nextValue);

      i++;
    }

    return Immutable.fromJS(path);
  }
}

function createNewBoard(seed) {
  const boardLayout = generateBoardLayout(seed);
  const answersLength2 = generateAnswers({
    boardLayout,
    length: 2,
    numberOfAnswers: 3,
    seed,
  });

  return Immutable.fromJS({
    boardLayout,
    answersLength2,
  });
}


module.exports = {
  createNewBoard,
};
