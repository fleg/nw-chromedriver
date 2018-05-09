"use strict";

const fs = require("fs");
const path = require("path");

const AWS = require("aws-sdk");

const crypto = require("./crypto");

/*
 * Due to crypto miners scanning GitHub for AWS credentials, even though the IAM user is locked down
 * I want to make it a little bit harder for them ;)
 */
const secretAccessKey = "47Nh42pA8atn64AokCuSjU1G/6smcFLGBcC/C6FJ/nFUa1BDdGbq4FjdR3plK/vb";

AWS.config.update({
  accessKeyId: "AKIAJCANJBNBJZZC2O7A",
  secretAccessKey: crypto.decrypt(secretAccessKey, "cdf792a6-5026-11e8-ba6f-6c4008ad2980"),
  region: "ap-southeast-2"
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/**
 * @param version
 * @param platform
 * @param arch
 * @return {Promise}
 */
module.exports = function(version, platform, arch) {
  return new Promise(function(resolve, reject) {
    const params = {
      Bucket: "nw-chromedriver",
      Key: makeKey(version, platform, arch)
    };

    const destPath = path.resolve(path.join(__dirname, "chromedriver"));

    console.log("Downloading '" + params.Key + "' to '" + destPath + "'");

    const req = s3.getObject(params);

    req.on("httpHeaders", function(statusCode, headers, response) {
      if (statusCode === 200) {
        // the driver is being fetched, but we don't want to buffer it
        const body = response.httpResponse.createUnbufferedStream();
        const dest = fs.createWriteStream(destPath);

        body.pipe(dest);
      }
    });

    req.on("error", function(err) {
      reject(err);
    });

    req.on("success", function() {
      resolve(destPath);
    });

    req.send();
  });
};

function makeKey(version, platform, arch) {
  const suffix = platform === "win" ? ".exe" : "";

  return version + "/chromedriver-" + platform + "-" + arch + suffix;
}
