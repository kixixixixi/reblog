var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "util", "parse-md", "dayjs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const util_1 = require("util");
    const parse_md_1 = __importDefault(require("parse-md"));
    const dayjs_1 = __importDefault(require("dayjs"));
    const build = async (articlePath, encoding) => {
        const files = await util_1.promisify(fs_1.default.readdir)(articlePath, {
            withFileTypes: true
        });
        const markdownFiles = files.filter(f => !f.isDirectory() && /.*\.(md|MD)$/.test(f.name));
        console.log("File count is", markdownFiles.length);
        let articleIds = [];
        const publishArticles = {};
        const authorArticles = {};
        const tagArticles = {};
        const articles = await Promise.all(markdownFiles.map(async (file) => {
            const [fileName, ..._] = file.name.split(".");
            console.log("Loading...", fileName);
            const [articleIdStr, ...names] = fileName.split("_");
            const articleId = parseInt(articleIdStr);
            const articleName = names.join(" ");
            const text = await util_1.promisify(fs_1.default.readFile)(articlePath + "/" + file.name, encoding);
            const { metadata, content } = parse_md_1.default(text);
            const { author, publish, tags, description, title } = metadata;
            const article = {
                id: articleId,
                name: articleName,
                publish: publish,
                title: title,
                description: description,
                author: author,
                tags: [tags].flat()
            };
            if (publish) {
                const year = dayjs_1.default(publish).year();
                const month = dayjs_1.default(publish).month() + 1;
                if (!publishArticles[year])
                    publishArticles[year] = {};
                if (!publishArticles[year][month])
                    publishArticles[year][month] = [];
                publishArticles[year][month] = [
                    ...publishArticles[year][month],
                    article
                ];
            }
            if (author) {
                const authorArticle = authorArticles[author] || [];
                authorArticles[author] = [...authorArticle, article];
            }
            ;
            [tags].flat().forEach((tag) => {
                const tagArticle = tagArticles[tag] || [];
                tagArticles[tag] = [...tagArticle, article];
            });
            articleIds = [...articleIds, articleId];
            return {
                metadata: article,
                content: content
            };
        }));
        if (new Set(articleIds).size != articleIds.length)
            throw "Duplicated article Id";
        return {
            articleIds: [...articleIds].sort(),
            publishArticles,
            authorArticles,
            tagArticles,
            articles
        };
    };
    exports.build = build;
});
