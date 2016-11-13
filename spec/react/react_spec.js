// @flow

// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('A suite', () => {
  it('contains spec with an expectation', () => {
    expect(true).toBe(true);
  });

  it('should pass this test', () => {
    expect(1).toBe(1);
  });
});
