"use strict";

const cheerio = require("cheerio");
const semver = require("semver");

const scraper = require("./scraper");

const RELEASE = /^v\d+\.\d+\.\d+\/$/;
const MIN_VERSION = "0.13.0";

scraper("http://dl.nwjs.io/")
  .then(function(body) {
    const $ = cheerio.load(body);

    const versions = $("a")
      .map(function(i, link) {
        return $(link).text();
      })
      .get()
      .filter(function(version) {
        return RELEASE.test(version);
      })
      .map(function(version) {
        return version.replace("v", "").replace("/", "");
      })
      .filter(function(version) {
        return semver.gte(version, MIN_VERSION);
      });

    versions.forEach(function(version) {
      console.log(version);
    })
  });
