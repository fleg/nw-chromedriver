"use strict";

const path = require("path");

const nwChromedriverVersion = require("./nw-chromedriver-version");

exports.readVersion = function() {
  return new Promise(function(resolve, reject) {
    if (process.env.CHROMEDRIVER_VERSION) {
      return resolve(process.env.CHROMEDRIVER_VERSION);
    }

    nwChromedriverVersion().then(resolve, reject);
  })
};

exports.mapPlatform = function(platform) {
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
};

exports.mapArch = function(arch) {
  switch (arch) {
    case "ia32":
      return "x86";

    case "x64":
      return "x64";

    default:
      throw new Error("UNKNOWN ARCH");
  }
};

exports.makeFilename = function(version, platform, arch) {
  const suffix = platform === "win" ? ".exe" : "";

  return path.join(version, "chromedriver-" + platform + "-" + arch + suffix);
};

exports.makeDestDir = function(filename) {
  return path.join(".nwchromedriver", filename);
};
