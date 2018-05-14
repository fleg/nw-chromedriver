"use strict";

const http = require("http");

module.exports = function(url) {
  return new Promise(function(resolve, reject) {
    var body = "";

    const req = http.get(url, function(resp) {
      resp.setEncoding("utf8");

      resp.on("data", function(data) {
        body += data;
      });

      resp.on("end", function() {
        resolve(body);
      });

      resp.on("error", reject);
    });

    req.on("error", reject);
  });
};
