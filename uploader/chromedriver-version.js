"use strict";

const spawn = require("child_process").spawn;

const semver = require("semver");

module.exports = function(drivers) {
  const bin = findBin(drivers);

  return executeDriver(bin)
    .then(splitVersion)
    .then(standardiseVersion)
    .then(function(version) {
      return drivers.map(function(driver) {
        driver.driverVersion = version.version;
        driver.driverHash = version.hash;

        return driver;
      });
    });
};

function executeDriver(path) {
  return new Promise(function(resolve, reject) {
    const args = [ "--version" ];
    const opts = {
      stdio: "pipe",
      detached: false
    };

    const child = spawn(path, args, opts);
    var stdout = new Buffer("");
    var stderr = new Buffer("");
    var error = null;

    if (child.stdout) {
      child.stdout.on("data", function(buf) {
        stdout = Buffer.concat([stdout, new Buffer(buf)]);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", function(buf) {
        stderr = Buffer.concat([stderr, new Buffer(buf)]);
      });
    }

    child.on("error", function(err) {
      error = err;

      reject(err);
    });

    child.on("close", function(code) {
      if (!error) {
        if (code !== 0) {
          return reject(new Error(stderr.toString()));
        }

        resolve(stdout.toString().trim());
      }
    });
  });
}

function findBin(drivers) {
  const platform = mapPlatform(process.platform);
  const arch = mapArch(process.arch);

  const bins = drivers
    .filter(function(driver) {
      return driver.platform === platform && driver.arch === arch;
    })
    .map(function(driver) {
      return driver.path
    });

  return bins[0];
}

function mapPlatform(platform) {
  switch(platform) {
    case "win32":
    case "win":
      return "win";

    case "darwin":
    case "osx":
    case "mac":
      return "mac";

    case "linux":
      return "linux";

    default:
      throw new Error("ERROR_UNKNOWN_PLATFORM");
  }
}

function mapArch(arch) {
  switch (arch) {
    case "ia32":
      return "x86";

    case "x64":
      return "x64";

    default:
      throw new Error("UNKNOWN ARCH");
  }
}

function splitVersion(version) {
  const pieces = version.split(/ /);

  return {
    version: pieces[1],
    hash: pieces[2].replace("(", "").replace(")", "")
  };
}

function standardiseVersion(version) {
  /*
   * If the version isn't a valid semver, then fix it
   */
  if (semver.valid(version.version) === null) {
    version.version = semver.coerce(version.version).version;
  }

  return version;
}
