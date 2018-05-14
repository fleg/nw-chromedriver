"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Finds the closest nw-chromedriver module and returns the version
 */
module.exports = function() {
  return findNwChromeDriver()
    .then(function(modulePath) {
      return readJSON(path.join(modulePath, "package.json"));
    })
    .then(function(json) {
      return json.version;
    });
};

function findNwChromeDriver() {
  const startingPath = path.resolve(path.join(__dirname, ".."));

  return new Promise(function(resolve, reject) {
    const lookInDirFor = function(dirPath, dir) {
      fs.readdir(dirPath, function(err, files) {
        if (err) {
          return reject(err);
        }

        if (files.includes(dir)) {
          resolve(path.join(dirPath, dir))
        }
        else {
          lookInDirFor(path.resolve(path.join(dirPath, "..")), dir);
        }
      });
    };

    lookInDirFor(startingPath, "nw-chromedriver");
  });
}

function readJSON(filepath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filepath, { encoding: "utf8" }, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve(JSON.parse(data));
    })
  });
}
