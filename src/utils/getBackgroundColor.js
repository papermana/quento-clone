const Random = require('random-js');
const consts = require('@src/constants');


function getBackgroundColorFactory() {
  const r = new Random(Random.engines.mt19937().autoSeed());
  const defaultColors = consts.BACKGROUNDCOLORS;
  let colors = defaultColors.slice();
  let selectedColor;

  return function getBackgroundColor() {
    let previousColor;

    //  If starting a new cycle, temporarily remove the last color of the previous cycle, so as to not repeat it by chance:
    if (colors.length === 0) {
      previousColor = selectedColor;

      colors = defaultColors
      .slice()
      .filter(color => color !== previousColor);
    }

    const id = r.integer(0, colors.length - 1);

    selectedColor = colors[id];
    colors.splice(id, 1);

    if (previousColor) {
      colors.push(previousColor);
    }

    return selectedColor;
  };
}


module.exports = getBackgroundColorFactory;
