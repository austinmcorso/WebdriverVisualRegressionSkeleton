Visual Regression Tests

Installation:
# install GraphicsMagick
#* brew install graphicsmagick OR
#* sudo apt-get install graphicsmagick OR
#* yum install graphicsmagick
# install firefox
# install gulp cli
#* npm install -g gulp-cli (sometimes due to disk mounting may need to sudo su - to execute)
# install dependencies
#* npm install
# Define enviornment URL's in environments.json
#* Note: If the environment requires auth use the following pattern to define the URL: "http://user:pass@domain.com"

Start Selenium:
# Check if selenium is already running
#* ps aux | grep selenium
# Start selenium through x-frame in separate terminal
#* xvfb-run --server-args="-screen 0, 1366x768x24" <abs-path>/ui-testing/node_modules/selenium-standalone/bin/selenium-standalone start

Usage:
* gulp => runs visual regression tests against production environment
* gulp --env=stage => runs visual regression tests against stage environment
