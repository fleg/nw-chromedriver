"use strict";

const fs = require("fs");

const download = require("./downloader");
const nwChromedriverVersion = require("./nw-chromedriver-version");

var version = null;
const platform = mapPlatform(process.env.NW_PLATFORM || process.platform);
const arch = mapArch(process.env.NW_ARCH || process.arch);

readVersion()
  .then(function(v) {
    version = v;

    return download(version, platform, arch)
  })
  .then(fixFilePermissions)
  .then(function(path) {
    console.log("Chromedriver binary available at '" + path + "'");
  })
  .catch(function(err) {
    if (err.statusCode === 404) {
      console.error("Chromedriver '" + version + ":" + platform + ":" + arch + "' doesn't exist")
    }
    else {
      console.error(err);
    }

    process.exit(1);
  });

function mapPlatform(platform) {
  switch(platform) {
    case "win32":
    case "win":
      return "win";

    case "darwin":
    case "osx":
    case "mac":
      return "mac";

    case "linux":
      return "linux";

    default:
      throw new Error("ERROR_UNKNOWN_PLATFORM");
  }
}

function mapArch(arch) {
  switch (arch) {
    case "ia32":
      return "x86";

    case "x64":
      return "x64";

    default:
      throw new Error("UNKNOWN ARCH");
  }
}

function readVersion() {
  return new Promise(function(resolve, reject) {
    if (process.env.NW_VERSION) {
      return resolve(process.env.NW_VERSION);
    }

    nwChromedriverVersion().then(resolve, reject);
  })
}

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
