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
    const fs_1 = require("fs");
    const mkdirp_1 = __importDefault(require("mkdirp"));
    const util_1 = require("util");
    const path_1 = require("path");
    const build_1 = require("./build");
    (async () => {
        const configFileName = "reblog.config.json";
        const defaultConfig = {
            articlePath: "./articles",
            encoding: "utf-8",
            outputPath: "./dist"
        };
        const isExistsFile = async (file) => {
            try {
                await util_1.promisify(fs_1.stat)(file);
                return true;
            }
            catch {
                return false;
            }
        };
        const loadConfig = async (file) => {
            if (await isExistsFile(file)) {
                const text = await util_1.promisify(fs_1.readFile)(file, "utf-8");
                const { articlePath, encoding, outputPath } = JSON.parse(text);
                return {
                    articlePath: articlePath || defaultConfig.articlePath,
                    encoding: encoding || defaultConfig.encoding,
                    outputPath: outputPath || defaultConfig.outputPath
                };
            }
            else {
                return defaultConfig;
            }
        };
        try {
            const { articlePath, encoding, outputPath } = await loadConfig(configFileName);
            const result = await build_1.build(articlePath, encoding);
            console.info("Generated");
            const path = outputPath + "/aritcle__list.json";
            await mkdirp_1.default(path_1.dirname(path));
            const { articles, ...list } = result;
            console.log(articles.map(a => `${a.metadata.id} - ${a.metadata.title}`).join("\n"));
            await util_1.promisify(fs_1.writeFile)(path, JSON.stringify(list));
            await Promise.all(articles.map(async (article) => {
                const path = `${outputPath}/article_${("0000" + article.metadata.id).slice(-4)}.json`;
                await util_1.promisify(fs_1.writeFile)(path, JSON.stringify(article));
            }));
        }
        catch (error) {
            console.error("Error:", error);
        }
    })();
});
