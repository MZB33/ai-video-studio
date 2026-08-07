/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const blockedPath = path.resolve(process.cwd(), "app/api/prompts/image-api-v11/.next/types");

function isBlocked(inputPath) {
  if (!inputPath) return false;
  const full = path.resolve(String(inputPath));
  return full === blockedPath || full.startsWith(`${blockedPath}${path.sep}`);
}

function wrapSync(original) {
  return function wrapped(pathArg, ...rest) {
    try {
      return original.call(this, pathArg, ...rest);
    } catch (error) {
      if (error && (error.code === "EPERM" || error.code === "EACCES")) {
        return [];
      }
      throw error;
    }
  };
}

function wrapAsync(original) {
  return function wrapped(pathArg, ...rest) {
    const callback = rest[rest.length - 1];
    if (typeof callback !== "function") {
      return original.call(this, pathArg, ...rest);
    }

    const guardedCb = (error, data) => {
      if (error && (error.code === "EPERM" || error.code === "EACCES")) {
        callback(null, []);
        return;
      }
      callback(error, data);
    };

    rest[rest.length - 1] = guardedCb;
    return original.call(this, pathArg, ...rest);
  };
}

const originalReaddirSync = fs.readdirSync;
const originalReaddir = fs.readdir;

fs.readdirSync = wrapSync(originalReaddirSync);
fs.readdir = wrapAsync(originalReaddir);

if (fs.promises && typeof fs.promises.readdir === "function") {
  const originalPromisesReaddir = fs.promises.readdir.bind(fs.promises);
  fs.promises.readdir = async (pathArg, ...rest) => {
    try {
      return await originalPromisesReaddir(pathArg, ...rest);
    } catch (error) {
      if (error && (error.code === "EPERM" || error.code === "EACCES")) {
        return [];
      }
      throw error;
    }
  };
}
