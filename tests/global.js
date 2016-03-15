var assert = require('assert');

describe("Global Component Tests", function() {
  this.timeout(60000);

  it('should display the header as expected', function(done) {
    browser
      .url(browser.options.baseUrl)
      .webdrivercss('global', {
        name: 'header',
        elem: '#header-wrapper'
      }, function(err, res) {
        assert.ifError(err);
        assert.ok(res.header[0].isWithinMisMatchTolerance);
      })
      .call(done);
  });

  it('should display the footer as expected', function(done) {
    browser
      .url(browser.options.baseUrl)
      .webdrivercss('global', {
        name: 'footer',
        elem: '#footer-nav-wrapper'
      }, function(err, res) {
        assert.ifError(err);
        assert.ok(res.footer[0].isWithinMisMatchTolerance);
      })
      .call(done);
  });

});
