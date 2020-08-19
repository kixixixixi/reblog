(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isExistsDirectory = exports.isExistsFile = void 0;
    const fs_1 = require("fs");
    const util_1 = require("util");
    const isExistsFile = async (file) => {
        try {
            await util_1.promisify(fs_1.stat)(file);
            return true;
        }
        catch {
            return false;
        }
    };
    exports.isExistsFile = isExistsFile;
    const isExistsDirectory = async (file) => {
        try {
            const stats = await util_1.promisify(fs_1.stat)(file);
            return stats.isDirectory() ? true : false;
        }
        catch {
            return false;
        }
    };
    exports.isExistsDirectory = isExistsDirectory;
});
