#!/usr/bin/env node
"use strict";
const chalk = require("chalk");
const Table = require("cli-table3");
const log = require("console-log-level")({});
const nameRepo = process.argv[2].split("/");
const gh = require("tg-gh")({ name: nameRepo[0], repo: nameRepo[1] });

const table = new Table({
  chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
  head: ["pr#", "feature branch", "status", "pr url", "info"],
});
const status = code => {
  if (code === 201) return chalk.bold.keyword("green")("updated");
  if (code === 204) return chalk.bold.keyword("blue")("noop");
  return chalk.bold.keyword("red")("error");
};
const tableRow = a => [
  chalk.red.bold(a.p.number),
  chalk.green(a.p.head.ref),
  status(a.status),
  a.p.html_url,
  chalk.grey(a.e),
];
let pullCount;

return gh
  .pulls()
  .then(pulls => {
    pullCount = pulls.length;
    return pulls.map(async p => {
      try {
        const status = await gh.merges(
          "master",
          p.head.ref,
          `Merge branch 'master' into ${p.head.ref}`
        );
        return { p, e: "", status };
      } catch (e) {
        return { p, e, status: "error" };
      }
    });
  })
  .then(u => Promise.all(u))
  .then(rows => {
    rows.map(r => table.push(tableRow(r)));
    log.info(table.toString());
    log.info(`${chalk.bold.keyword("green")(`pr count: ${pullCount}`)}`);
  })
  .catch(e => log.error(e));
