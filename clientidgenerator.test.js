const generator = require("./clientidgenerator");

beforeEach(() => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
});

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

test("generate id", () => {
  expect(generator()).toBe(`mqtt_f9add3739635f`);
});
