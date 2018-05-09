"use strict";

const fs = require("fs");
const path = require("path");

const pkgUp = require("pkg-up");

const download = require("./downloader");

const version = process.env.NW_VERSION || readVersion();
const platform = mapPlatform(process.env.NW_PLATFORM || process.platform);
const arch = mapArch(process.env.NW_ARCH || process.arch);

download(version, platform, arch)
  .catch(function(err) {
    if (err.statusCode === 404) {
      console.error("Chromedriver '" + version + ":" + platform + ":" + arch + "' doesn't exist")
    }
    else {
      console.error(err);
    }

    process.exit(1);
  });

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

function readVersion() {
  const cwd = path.resolve(path.join(__dirname, ".."));
  const pkgPath = pkgUp.sync(cwd);

  const pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: "utf8" }));

  return pkg.version;
}
