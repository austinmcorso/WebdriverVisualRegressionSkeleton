var capture = require('./inc/capture.js');

describe("Homepage Component Tests", function() {
  this.timeout(60000);

  it('should display the homepage as expected', function(done) {
    var testName = 'homepage';
    browser
      .url(browser.options.baseUrl)
      .execute(function() {
        //jQuery('#page-wrapper .block').css('background', 'gray').css('border', '1px solid black');
      })
      .webdrivercss('homepage', {
        name: testName,
        elem: '#content-wrapper'
      }, function(err, res) { capture(testName, err, res) })
      .call(done);
  });

});
