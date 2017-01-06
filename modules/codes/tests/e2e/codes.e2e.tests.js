'use strict';

describe('Codes E2E Tests:', function () {
  describe('Test Codes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/codes');
      expect(element.all(by.repeater('code in codes')).count()).toEqual(0);
    });
  });
});
