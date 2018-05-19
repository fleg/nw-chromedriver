# nw-chromedriver-installer

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/kdizzle777)

[![Bitcoin Donate Button**](https://www.drupal.org/files/project-images/bitcoindonate.png)](bitcoin:18xE1NZgT6SAigqTzgPJG4YDNJTygEDTQa)

npm module that downloads the `chromedriver` binary for `nw-chromedriver`

## Why a separate module?

The NW `chromedriver` binary has to be sourced from a version of NW.js where Chromedriver supports the desired version of Chromium (see https://github.com/nwjs/nw.js/issues/6062)

The binary is sourced and currently uploaded to AWS S3. The main `nw-chromedriver` is versioned  against the version of `chromedriver` (eg: 2.33) however the location of the binary may change in the future.

This module decouples the sourcing of the binary from the use of the binary.

# Please donate
