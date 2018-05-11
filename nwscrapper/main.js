"use strict";

const cheerio = require("cheerio");
const semver = require("semver");

const scrapper = require("./scrapper");

const RELEASE = /^v\d+\.\d+\.\d+\/$/;
const MIN_VERSION = "0.13.0";

scrapper("http://dl.nwjs.io/")
  .then(function(body) {
    const $ = cheerio.load(body);

    var versions = $("a").map(function(i, link) {
      return $(link).text();
    }).get();

    versions = versions.filter(function(version) {
      return RELEASE.test(version);
    });

    versions = versions.map(function(version) {
      return version.replace("v", "").replace("/", "");
    });

    versions = versions.filter(function(version) {
      return semver.gte(version, MIN_VERSION);
    });

    versions.forEach(function(version) {
      console.log(version);
    })
  });
