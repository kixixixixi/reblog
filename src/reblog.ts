#! /usr/bin/env node

import program from "commander"
;(async (): Promise<void> => {
  program
    .version("0.0.3")
    .command("init", "create config file")
    .command("new <title>", "create article")
    .command("build", "generate json")

  await program.parseAsync(process.argv)
})()
