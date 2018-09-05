"use strict";

const fs = require("fs");
const path = require("path");

const AWS = require("aws-sdk");
const home = require("user-home");

const crypto = require("./crypto");
const utils = require("./utils");

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
      Key: utils.makeFilename(version, platform, arch)
    };

    const destPath = createDestPath(params.Key);

    if (!fs.existsSync(destPath)) {
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
        if (err.statusCode === 404) {
          return reject(new Error("Chromedriver '" + version + ":" + platform + ":" + arch + "' doesn't exist"));
        }

        reject(err);
      });

      req.on("success", function() {
        resolve(destPath);
      });

      req.send();
    }
    else {
      console.log("'" + destPath + "' already exists");
      resolve(destPath);
    }
  });
};

function createDestPath(filename) {
  const dir = utils.makeDestDir(filename);

  createDestDir(home, dir);

  return path.join(home, dir);
}

function createDestDir(base, dir) {
  const mkdir = (dir, segment) => {
    const dest = path.join(dir, segment);

    createDirSync(dest);

    return dest;
  };

  return path.dirname(dir).split(path.sep).reduce(mkdir, base);
}

function createDirSync(dir) {
  try {
    fs.statSync(dir);
  }
  catch (e) {
    fs.mkdirSync(dir);
  }
}
