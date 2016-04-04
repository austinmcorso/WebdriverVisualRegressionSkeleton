var capture = require('./inc/capture.js');

describe("Global Component Tests", function() {
  this.timeout(60000);

  it('should display the header as expected', function(done) {
    var testName = 'header';
    browser
      .url(browser.options.baseUrl)
      .webdrivercss('global', {
        name: testName,
        elem: '#header-wrapper'
      }, function(err, res) { capture(testName, err, res) })
      .call(done);
  });

  it('should display the footer as expected', function(done) {
    var testName = 'footer';
    browser
      .url(browser.options.baseUrl)
      .webdrivercss('global', {
        name: testName,
        elem: '#footer-nav-wrapper'
      }, function(err, res) { capture(testName, err, res) })
      .call(done);
  });

});
