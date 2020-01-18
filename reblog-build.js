var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "mkdirp", "util", "path", "./build", "./config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = require("fs");
    const mkdirp_1 = __importDefault(require("mkdirp"));
    const util_1 = require("util");
    const path_1 = require("path");
    const build_1 = require("./build");
    const config_1 = require("./config");
    (async () => {
        try {
            const { articlePath, encoding, outputPath } = await config_1.loadConfig(config_1.configFileName);
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
