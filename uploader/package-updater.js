"use strict";

const fs = require("fs");
const path = require("path");

const filename = path.resolve(path.join(__dirname, "../package.json"));
const encoding = { encoding: "utf8" };

module.exports = function(driverVersion, nwVersion, hash) {
  return new Promise(function(resolve, reject) {
    readPackageJson()
      .then(function(json) {
        json.version = driverVersion;
        json.hash = hash;
        json.engines.nw = nwVersion;

        return json;
      })
      .then(writePackageJson)
      .then(resolve)
      .catch(reject)
  });
};

function readPackageJson() {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, encoding, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve(JSON.parse(data));
    });
  });
}

function writePackageJson(json) {
  return new Promise(function(resolve, reject) {
    json = JSON.stringify(json, null, 2);

    fs.writeFile(filename, json, encoding, function(err) {
      if (err) {
        return reject(err);
      }

      resolve();
    })
  });
}
