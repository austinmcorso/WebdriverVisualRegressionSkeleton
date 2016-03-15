var assert = require('assert');

describe("Homepage Component Tests", function() {
  this.timeout(60000);

  it('should display the homepage as expected', function(done) {
    browser
      .url(browser.options.baseUrl)
      .execute(function() {
        //jQuery('#page-wrapper .block').css('background', 'gray').css('border', '1px solid black');
      })
      .webdrivercss('homepage', {
        name: 'homepage',
        elem: '#content-wrapper',
      }, function(err, res) {
        assert.ifError(err);
        assert.ok(res.homepage[0].isWithinMisMatchTolerance);
      })
      .call(done);
  });

});
