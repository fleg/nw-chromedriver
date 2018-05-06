"use strict";

const fs = require("fs");

const clone = require("clone");
const AWS = require("aws-sdk");

// keys read from env vars
AWS.config.update({
  region: "ap-southeast-2"
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const DEFAULT_PARAMS = {
  Bucket: "nw-chromedriver"
};

/**
 * @param version {String} The version of Chromedriver
 * @param platform {String} The platform (win, mac, linux)
 * @param arch {String} The arch (x86, x64)
 * @param filepath {String} Where the file is.
 * @returns {Promise}
 */
module.exports = function(version, platform, arch, filepath) {
  return new Promise(function(resolve, reject) {
    const params = clone(DEFAULT_PARAMS, false);
    params.Key = makeKey(version, platform, arch);
    params.Body = fs.createReadStream(filepath);

    console.log("Uploading '" + params.Key + "'");

    s3.putObject(params, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data);
    })
  });
};

function makeKey(version, platform, arch) {
  const suffix = platform === "win" ? ".exe" : "";

  return version + "/chromedriver-" + platform + "-" + arch + suffix;
}
