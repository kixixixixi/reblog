(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "util", "./file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadConfig = exports.configFileName = exports.defaultConfig = void 0;
    const fs_1 = require("fs");
    const util_1 = require("util");
    const file_1 = require("./file");
    const defaultConfig = {
        articlePath: "./articles",
        encoding: "utf-8",
        outputPath: "./dist",
    };
    exports.defaultConfig = defaultConfig;
    const configFileName = "reblog.config.json";
    exports.configFileName = configFileName;
    const loadConfig = async (file) => {
        if (await file_1.isExistsFile(file)) {
            const text = await util_1.promisify(fs_1.readFile)(file, "utf-8");
            const { articlePath, encoding, outputPath } = JSON.parse(text);
            return {
                articlePath: articlePath || defaultConfig.articlePath,
                encoding: encoding || defaultConfig.encoding,
                outputPath: outputPath || defaultConfig.outputPath,
            };
        }
        else {
            return defaultConfig;
        }
    };
    exports.loadConfig = loadConfig;
});
