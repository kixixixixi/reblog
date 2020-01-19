var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "mkdirp", "util", "path", "dayjs", "./config", "./file"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = require("fs");
    const mkdirp_1 = __importDefault(require("mkdirp"));
    const util_1 = require("util");
    const path_1 = require("path");
    const dayjs_1 = __importDefault(require("dayjs"));
    const config_1 = require("./config");
    const file_1 = require("./file");
    (async () => {
        const { articlePath } = await config_1.loadConfig(config_1.configFileName);
        if (!file_1.isExistsDirectory(articlePath)) {
            await mkdirp_1.default(path_1.dirname(articlePath));
            console.log("Created", articlePath);
        }
        const files = await util_1.promisify(fs_1.readdir)(articlePath, {
            withFileTypes: true
        });
        const markdownFiles = files.filter(f => !f.isDirectory() && /.*\.(md|MD)$/.test(f.name));
        let articleId = 1;
        if (markdownFiles.length > 0) {
            const lastFileName = [...markdownFiles].sort().reverse()[0].name;
            const articleIdStr = lastFileName.split("_")[0];
            articleId = parseInt(articleIdStr) + 1;
        }
        const index = process.argv.findIndex(a => /reblog-new\.js$/.test(a));
        const title = process.argv.slice(index + 1).join(" ");
        const nospaceTitle = title.replace(/ /g, "_");
        const path = `${articlePath}/${("0000" + articleId).slice(-4)}_${nospaceTitle}.md`;
        const content = `---
publish: ${dayjs_1.default().format("YYYY-MM-DD")}
title: ${title}
author:
description:
tags:
 - tag1
 - tag2
---
# Conetent Section Title
Content
`;
        await util_1.promisify(fs_1.writeFile)(path, content);
        console.log("Created", path);
    })();
});
