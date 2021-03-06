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
  const params = clone(DEFAULT_PARAMS, false);
  params.Key = makeKey(version, platform, arch);

  return checkIfFileAlreadyExists(params)
    .then(function(exists) {
      if (!exists) {
        return uploadFile(params, filepath)
      }

      console.log("'" + params.Key + "' already exists");
    });
};

function makeKey(version, platform, arch) {
  const suffix = platform === "win" ? ".exe" : "";

  return version + "/chromedriver-" + platform + "-" + arch + suffix;
}

function determineFileSize(filepath) {
  return new Promise(function(resolve, reject) {
    fs.stat(filepath, function(err, stats) {
      if (err) {
        return reject(err);
      }

      resolve(stats.size);
    })
  })
}

function checkIfFileAlreadyExists(params) {
  return new Promise(function(resolve, reject) {
    s3.headObject(params, function(err) {
      if (err) {
        if (err.code === "NotFound") {
          return resolve(false);
        }

        return reject(err);
      }

      return resolve(true);
    })
  })
}

function uploadFile(params, filepath) {
  return determineFileSize(filepath)
    .then(function(size) {
      params.ContentType = "application/octet-stream";
      params.ContentLength = size;
      params.Body = fs.createReadStream(filepath);
    })
    .then(putDriverIntoBucket.bind(null, params));
}

function putDriverIntoBucket(params) {
  return new Promise(function(resolve, reject) {
    console.log("Uploading '" + params.Key + "'");

    s3.putObject(params, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}
