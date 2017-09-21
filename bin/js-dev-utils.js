#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const getScripts = () =>
  fs
    .readdirSync(path.join(__dirname, '../scripts'))
    .map(filename => filename.replace(/\..+$/, ''))
    .sort();

const call = (script, args) =>
  spawnSync('node', [require.resolve(`../scripts/${script}.js`), ...args], {
    stdio: 'pipe',
    encoding: 'utf-8',
  });

/* istanbul ignore if */
if (require.main === module) {
  // Called as CLI.
  const script = process.argv[2] || '';

  if (!getScripts().includes(script)) {
    console.error(`"${script}" doesn't exist`);
    process.exit(1);
  }
  const code = call(script, process.argv.slice(3)).status;
  process.exit(code);
} else {
  module.exports = { getScripts, call };
}
