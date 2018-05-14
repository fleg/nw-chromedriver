"use strict";

const crypto = require("crypto");
const algorithm = "bf-ecb";

const UTF8_ENCODING = "utf8";
const BINARY_ENCODING = "binary";

exports.encrypt = function(str, key) {
  const cipher = crypto.createCipheriv(algorithm, new Buffer(key), "");
  cipher.setAutoPadding(false);

  try {
    var data = new Buffer(cipher.update(pad(str), UTF8_ENCODING, BINARY_ENCODING) + cipher.final(BINARY_ENCODING), BINARY_ENCODING);
    data = data.toString("base64");

    return data;
  }
  catch (e) {
    throw new Error("Can't encrypt data");
  }
};

exports.decrypt = function(enc, key) {
  const decipher = crypto.createDecipheriv(algorithm, new Buffer(key), "");
  decipher.setAutoPadding(false);

  try {
    var data = new Buffer(enc, "base64").toString("binary");

    data = decipher.update(data, "binary", UTF8_ENCODING);
    data += decipher.final(UTF8_ENCODING);
    data.replace(/\x00+$/g, ""); // eslint-disable-line no-control-regex

    return data;
  }
  catch (e) {
    throw new Error("Can't decrypt data");
  }
};

function pad(text) {
  const padBytes = 8 - (text.length % 8);

  for (var i = 1; i <= padBytes; i++) {
    text = text + String.fromCharCode(0);
  }

  return text;
}
