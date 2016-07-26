describe('Addoo', function() {
  it('should have a title', function() {
    browser.get('https://app.addoo.io/');

    expect(browser.getTitle()).toEqual('Addoo');
  });
});
