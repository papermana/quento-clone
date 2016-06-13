jest.unmock('@utils/getBackgroundColor');
jest.unmock('random-js');
jest.setMock('@src/constants', {
  BACKGROUNDCOLORS: [
    'rudimentaryMock',
  ],
});

const getBackgroundColorFactory = require('@utils/getBackgroundColor');



describe('`getBackgroundColorFactory()`', () => {
  it('should return a function', () => {
    expect(getBackgroundColorFactory() instanceof Function).toBe(true);
  });

  describe('`getBackgroundColor()`: function which returns a different background color for ViewPlayGame every time', () => {
    it('should return a string', () => {
      expect(typeof getBackgroundColorFactory()()).toBe('string');
    });

    it('should return a different color every time; no color will repeat for as many calls as there are colors in the imported array', () => {
      jest.setMock('@src/constants', {
        BACKGROUNDCOLORS: [
          'color1',
          'color2',
          'color3',
          'color4',
          'color5',
        ],
      });

      const getBackgroundColor = getBackgroundColorFactory();

      const colorsUsed = [];

      for (let i = 0; i < 5; i++) {
        const color = getBackgroundColor();

        expect(colorsUsed.includes(color)).toBe(false);

        colorsUsed.push(color);
      }
    });

    it('should always return a different color every time, even between cycles (i.e. first color of a cycle has to be different than the last color of a previous cycle', () => {
      jest.setMock('@src/constants', {
        BACKGROUNDCOLORS: [
          'color1',
          'color2',
        ],
      });

      const getBackgroundColor = getBackgroundColorFactory();

      let colorLastUsed;

      for (let i = 0; i < 20; i++) {
        const color = getBackgroundColor();

        expect(color).not.toBe(colorLastUsed);

        colorLastUsed = color;
      }
    });
  });

});
