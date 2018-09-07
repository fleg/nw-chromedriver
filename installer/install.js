"use strict";

const fs = require("fs");

const utils = require("./utils");

const download = require("./downloader");

const platform = utils.mapPlatform(process.env.CHROMEDRIVER_PLATFORM || process.platform);
const arch = utils.mapArch(process.env.CHROMEDRIVER_ARCH || process.arch);

utils.readVersion()
  .then(function(version) {
    return download(version, platform, arch)
  })
  .then(fixFilePermissions)
  .then(function(path) {
    console.log("Chromedriver binary available at '" + path + "'");
  })
  .catch(function(err) {
    console.error(err);

    process.exit(1);
  });

// borrowed from node-chromedriver
function fixFilePermissions(path) {
  // Check that the binary is user-executable
  if (platform !== "win") {
    const stat = fs.statSync(path);

    // 64 == 0100 (no octal literal in strict mode)
    if (!(stat.mode & 64)) { // eslint-disable-line no-bitwise
      console.log("Making Chromedriver executable");
      fs.chmodSync(path, "755");
    }
  }

  return path;
}
