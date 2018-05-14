"use strict";

const downloader = require("./downloader");

/**
 * Downloads all SDK flavours of a NW.js version.
 *
 * @param version
 * @return {Promise<any[]>}
 */
module.exports = function(version) {
  const platforms = [ "win", "mac", "linux" ];
  const architectures = [ "x86", "x64" ];

  const downloads = flatten(platforms.map(function(platform) {
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

function flatten(arr) {
  const accumulator = function(arr, value) {
    return arr.concat(value);
  };

  return arr.reduce(accumulator, [])
}
