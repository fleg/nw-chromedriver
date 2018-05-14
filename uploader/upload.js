"use strict";

const driverVersion = require("./chromedriver-version");
const uploader = require("./uploader");

module.exports = function(drivers) {
  return driverVersion(drivers)
    .then(function(drivers) {
      const uploads = drivers.map(function(driver) {
        return uploader(driver.driverVersion, driver.platform, driver.arch, driver.path);
      });

      return Promise.all(uploads).then(function() {
        return drivers;
      });
    });
};
