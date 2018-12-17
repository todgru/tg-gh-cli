#!/usr/bin/env node
"use strict";
const chalk = require("chalk");
const Table = require("cli-table3");
const log = require("console-log-level")({});
const gh = require("tg-gh-lib");

const table = new Table({
  chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
  head: ["pr#", "feature branch", "user", "labels", "title"],
});

const tableRow = a => [
  chalk.red.bold(a.number),
  chalk.green(a.head.ref),
  a.user.login,
  a.labels.map(l => l.name).join(", "),
  a.title.slice(0, 40),
];

Promise.resolve()
  .then(() => {
    // @TODO make the cli arg requirement logic shareable
    if (!process.argv[2] || process.argv[2].split("/").length !== 2)
      throw new Error(`Usage: tg-gh-prs username/repository`);
    const nameRepo = process.argv[2].split("/");
    return { name: nameRepo[0], repo: nameRepo[1] };
  })
  .then(nameRepoObj =>
    gh(nameRepoObj)
      .pulls()
      .then(rows => {
        rows.map(r => table.push(tableRow(r)));
        log.info(table.toString());
        log.info(`${chalk.bold.keyword("green")(`pr count: ${rows.length}`)}`);
      })
  )
  .catch(e => log.info(`${chalk.red(e.message)}`));
