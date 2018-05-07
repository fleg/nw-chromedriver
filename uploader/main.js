"use strict";

const version = "0.13.0";

const download = require("./download");
const upload = require("./upload");

const downloads = download(version);

const uploads = downloads.then(upload);

uploads
  .then(function(uploads) {
    console.log(JSON.stringify(uploads));
  })
  .catch(function(err) {
    console.error(err.message);
  });
