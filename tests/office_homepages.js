var capture = require('./inc/capture.js');

var offices = [
 // 'office_1',
  //'office_2',
  //'office_3'
  'eere/ssl',
  'eere/spo',
  'ehss'
];

describe("Office Homepage Component Tests", function() {
  this.timeout(60000);

  offices.forEach(function(office) {
    var officeName = office.replace(/\//g, '-');
    var testName = 'office_homepage_' + officeName.replace('-', '_');

    it('should display the ' + officeName + ' office homepage as expected', function(done) {  
      browser
        .url(browser.options.baseUrl + '/' + office)
        .execute(function() {
          //jQuery('#page-wrapper .block').css('background', 'gray').css('border', '1px solid black');
        })
        .webdrivercss('office-' + officeName + '-homepage', {
          name: testName,
          elem: '#content-wrapper',
        }, function(err, res) { capture(testName, err, res) })
        .call(done);
    });
  });

});
