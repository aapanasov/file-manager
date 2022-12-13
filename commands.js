import { colors } from './constants.js';
import { basename, join, sep } from 'node:path';
import { access, constants, readdir, stat, open, rename, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { makePath, splitArgs } from './helpers.js';


export function exit(name) {
  console.log(`\nThank you for using File Manager, ${colors.yellow}${name}${colors.reset}, goodbye!`);
  process.exit();
};