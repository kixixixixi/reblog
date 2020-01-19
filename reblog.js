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
        define(["require", "exports", "commander"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commander_1 = __importDefault(require("commander"));
    (async () => {
        commander_1.default
            .version("0.0.3")
            .command("init", "create config file")
            .command("new <title>", "create article")
            .command("build", "generate json");
        await commander_1.default.parseAsync(process.argv);
    })();
});
