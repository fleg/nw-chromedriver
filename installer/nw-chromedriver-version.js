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
  const searchPath = path.resolve(path.join(__dirname, ".."));

  return new Promise(function(resolve, reject) {
    const readdir = function(searchPath) {
      fs.readdir(searchPath, function(err, files) {
        if (err) {
          return reject(err);
        }

        if (files.includes("nw-chromedriver")) {
          resolve(path.join(searchPath, "nw-chromedriver"))
        }
        else {
          readdir(path.resolve(path.join(searchPath, "..")));
        }
      });
    };

    readdir(searchPath);
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
