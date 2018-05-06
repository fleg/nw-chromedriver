"use strict";

const version = "0.13.0";

const drivers = require("./fetch")(version);

drivers.then(function(downloads) {
  console.log(JSON.stringify(downloads));
});
