#! /usr/bin/env node
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "mkdirp", "util", "path", "./build"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const mkdirp_1 = __importDefault(require("mkdirp"));
    const util_1 = require("util");
    const path_1 = require("path");
    const build_1 = require("./build");
    const articlePath = "./articles";
    const encoding = "utf-8";
    const outputPath = "./dist";
    build_1.build(articlePath, encoding)
        .then(async (result) => {
        const { articles } = result;
        console.info("Generated");
        console.log(articles.map(a => `${a.metadata.id} - ${a.metadata.title}`).join("\n"));
        const path = outputPath + '/reblog.json';
        await mkdirp_1.default(path_1.dirname(path));
        await util_1.promisify(fs_1.default.writeFile)(path, JSON.stringify(result));
    })
        .catch(error => {
        console.error("Error:", error);
    });
});
