var fs = require('fs');
var assert = require('assert');
var results = require('../../test-results.json');

/**
 * Checks for errors and logs result.
 */
module.exports = function(testName, err, res) {
  assert.ifError(err);
  assert.ok(res[testName][0].isWithinMisMatchTolerance);

  if (res[testName][0].message.indexOf('first image') === -1) {
    results[testName] = {
      "datetime": Date.now(),
      "passed": res[testName][0].isWithinMisMatchTolerance
    };
    fs.writeFile('test-results.json', JSON.stringify(results));
  }
}

