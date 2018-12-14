#!/usr/bin/env node
"use strict";

const log = require("console-log-level")({});
const chalk = require("chalk");
log.info(`${chalk.bold.keyword("green")(`try tg-gh-prs-update username/repo`)}`);
