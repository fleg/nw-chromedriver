# nw-chromedriver

Installs the version of ChromeDriver that is distributed with [NW.js](https://nwjs.io/)

## Why this module?

Due to the issue of [the bundled ChromeDriver not being compatible](https://github.com/nwjs/nw.js/issues/6062) with the version of NW.js that it is distributed with, if you want to run automated tests against your application (eg: with [Protractor](https://www.protractortest.org/#/)) you're stuck.

This module versions the "NW Chromedriver" binary (and records the NW.js version it came from) to overcome this issue.

To find the correct version of the driver, first determine the version of Chromium in the NW.js version, either from the release notes or `process.versions`

Find the [corresponding](https://sites.google.com/a/chromium.org/chromedriver/downloads) Chromedriver version and install.

## Usage

```javascript
$ npm install nw-chromedriver --save-dev

$ ./node_modules/.bin/chromedriver --version
```
