"use strict";

const version = "0.13.0";

const downloads = require("./fetch")(version);
const uploader = require("./uploader");

downloads.then(function(drivers) {
  return drivers.map(function(driver) {
    return uploader(driver.version, driver.platform, driver.arch, driver.path);
  });
});
