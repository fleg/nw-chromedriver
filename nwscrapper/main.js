"use strict";

const scrapper = require("./scrapper");

scrapper("http://dl.nwjs.io/")
  .then(function(body) {
    console.log(body);
  });
