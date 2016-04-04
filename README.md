# Visual Regression Tests

## Installation:
1. install X virtual framebuffer (xvfb)
1. install GraphicsMagick
1. install Firefox
1. install Gulp CLI
  * npm install -g gulp-cli
1. install dependencies
  * npm install
  * selenium-standalone install
1. Define enviornment URL's in environments.json
  * Keys are the environment name, value is the url
  * Note: If the environment requires auth use the following pattern to define the URL:"http://user:pass@domain.com"

## Start Selenium:
1. Start Selenium
  * Check if selenium and/or xvfb is already running and kill process if necessary
1. Start selenium through x-frame in separate terminal or as background process
  * xvfb-run --server-args="-screen 0, 1366x768x24" selenium-standalone start

## Usage:
  * gulp => runs visual regression tests against production environment
  * gulp --env=stage => runs visual regression tests against stage environment
  * gulp reset-baselines --env=dev => resets baselines for the dev environment

## Test Examples:
  * global.js - Basic testing of components
  * homepage.js - Testing pages with dynamic content. Here we execute jQuery prior to screenshots to hide dynamic content that could throw off our tests
  * office_hompeages.js - Executing tests against a set of pages. Here we have a list of office pages and we run a single test against each.


When originally starting my dive into visual regression testing last year I utilized PhantomCSS, a wrapper around PhantomJS, CasperJS, and ResembleJS. After implementing visual regression testing on a handful of client projects and noticing recurring issues with PhatnomJS's ability to render web fonts, I have since switched to Webdriver. Webdriver is a set of NodeJS bindings for Selenium, which when used in tandem with GulpJS and Jenkins CI provide a powerful testing apperatus. Below are a few blog posts I wrote last year regarding testing with PhantomCSS. They may provide useful context into the kind of visual regression testing this setup is being used to achieve.
  * [Visual Regression Testing: How to Test Dynamic Content with PhantomCSS](https://www.phase2technology.com/blog/visual-regression-testing-how-to-test-dynamic-content-with-phantomcss/)
  * [Visual Regression Testing Part 2: Extending Grunt-PhantomCSS for Multiple Environments](https://www.phase2technology.com/blog/visual-regression-testing-part-2-extending-grunt-phantomcss-for-multiple-environments/)
  * [Visual Regression Testing Part 3: Integrating PhantomCSS and Grunt with Jenkins](https://www.phase2technology.com/blog/visual-regression-testing-part-3-integrating-phantomcss-and-grunt-with-jenkins/)

