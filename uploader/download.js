"use strict";

const downloader = require("./downloader");

module.exports = function(version) {
  const platforms = [ "win", "mac", "linux" ];
  const architectures = [ "x86", "x64" ];

  const downloads = flatMap(platforms.map(function(platform) {
    return architectures.map(function(arch) {
      return downloader(version, platform, arch);
    })
  }));

  return Promise.all(downloads)
    .then(function(downloads) {
      /*
       * If a version couldn't be fetched (probably because of a 404)
       * then there will be nulls in the array.
       */
      return downloads.filter(function(download) {
        return download != null;
      });
    })
    .catch(function(err) {
      console.error(err, err.stack);
    });
};

function flatMap(arr) {
  const flatten = function(arr, value) {
    return arr.concat(value);
  };

  return arr.reduce(flatten, [])
}
