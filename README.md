# Visual Regression Tests

## Installation:
1. install GraphicsMagick
1. install Firefox
1. install Gulp CLI
  * npm install -g gulp-cli
1. install dependencies
  * npm install
1. Define enviornment URL's in environments.json
  * Note: If the environment requires auth use the following pattern to define the URL:"http://user:pass@domain.com"

## Start Selenium:
1. Check if selenium is already running
  * ps aux | grep selenium
1. Start selenium through x-frame in separate terminal
  * xvfb-run --server-args="-screen 0, 1366x768x24" selenium-standalone start

## Usage:
  * gulp => runs visual regression tests against production environment
  * gulp --env=stage => runs visual regression tests against stage environment
