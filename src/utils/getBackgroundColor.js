const Random = require('random-js');
const consts = require('@src/constants');


function getBackgroundColorFactory() {
  const r = new Random(Random.engines.mt19937().autoSeed());
  const defaultColors = consts.BACKGROUNDCOLORS;
  let colors = defaultColors.slice();

  return function getBackgroundColor() {
    const selectedColorId = r.integer(0, colors.length - 1);
    const selectedColor = colors[selectedColorId];

    colors.splice(selectedColorId, 1);

    if (colors.length === 0) {
      colors = defaultColors.slice();
    }

    return selectedColor;
  };
}


module.exports = getBackgroundColorFactory;
