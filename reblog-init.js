var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "mkdirp", "util", "path", "./config", "./file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = require("fs");
    const mkdirp_1 = __importDefault(require("mkdirp"));
    const util_1 = require("util");
    const path_1 = require("path");
    const config_1 = require("./config");
    const file_1 = require("./file");
    (async () => {
        if (!file_1.isExistsFile(config_1.configFileName)) {
            console.log("Config file exists");
        }
        else {
            await util_1.promisify(fs_1.writeFile)(config_1.configFileName, JSON.stringify(config_1.defaultConfig, null, 2));
            console.log("Created", config_1.configFileName);
        }
        if (file_1.isExistsDirectory(config_1.defaultConfig.articlePath)) {
            console.log("Aritcles directory exists");
        }
        else {
            await mkdirp_1.default(path_1.dirname(config_1.defaultConfig.articlePath));
            console.log("Created", config_1.defaultConfig.articlePath);
        }
    })();
});
