"use strict";

const builder = require("nwjs-builder-phoenix");

/**
 * Fetches a version of NW.js.
 *
 * @param nwVersion {String} The version of NW.js to fetch.
 * @param platform {String} Either 'win', 'mac', or 'linux'
 * @param arch {String} Either 'x86' or 'x64'
 * @return A {Promise} that resolves to the path to the nwjs binary, or rejects with an Error.
 */
module.exports = function(nwVersion, platform, arch) {
  if (!nwVersion) {
    throw new Error("Missing version of NW");
  }

  validatePlatform(platform);
  validateArch(arch);

  console.log("Downloading '" + nwVersion + ":" + platform + ":" + arch + "'");

  return (new builder.Downloader({
    platform: platform,
    arch: arch,
    version: nwVersion,
    flavor: "sdk",
    useCaches: true,
    showProgress: true
  }))
  /* eslint-disable indent */
  .fetchAndExtract()
  .then(function(extracted) {
    return builder.findExecutable(platform, extracted);
  })
  .then(function(filename) {
    switch (platform) {
      case "linux":
        return filename.replace(/nw$/, "chromedriver");
      case "mac":
        return filename.replace("nwjs.app/Contents/MacOS/nwjs", "chromedriver");
      case "win":
        return filename.replace(/nw.exe$/, "chromedriver.exe");
    }
  })
  .then(function(filename) {
    return {
      nwVersion: nwVersion,
      platform: platform,
      arch: arch,
      path: filename
    }
  })
  .catch(function(err) {
    console.error("Can't download '" + nwVersion + ":" + platform + ":" + arch + "' because: " + err.message);
  });
  /* eslint-enable indent */
};

function validatePlatform(platform) {
  if (!(platform === "win" || platform === "mac" || platform === "linux")) {
    throw new Error("Invalid platform '" + platform + "'");
  }
}

function validateArch(arch) {
  if (!(arch === "x86" || arch === "x64")) {
    throw new Error("Invalid arch '" + arch + "'");
  }
}
