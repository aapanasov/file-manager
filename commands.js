import { colors } from './constants.js';
import { join, sep } from 'node:path';
import { readdir, stat } from 'node:fs/promises';


export function exit(name) {
  console.log(`\nThank you for using File Manager, ${colors.yellow}${name}${colors.reset}, goodbye!`);
  process.exit();
};

export function up(dir) {
  if (dir.length === 2 && dir[1] === ':') return dir;
  if (dir === '/') return dir;

  return dir.split(sep).slice(0, -1).join(sep);
}

export async function ls(dir) {
  try {
    const dirContent = await readdir(dir);

    const dirContentPromises = dirContent.map(async (item) => {
      const path = join(dir, item);

      try {
        const itemStats = await stat(path);
        return {
          Name: item,
          Type: itemStats.isDirectory() ? 'directory' : 'file'
        };
      } catch (error) {
        return {
          Name: item,
          Type: 'file'
        };
      }
    });

    const result = await Promise.all(dirContentPromises);
    console.table(result);

  } catch (error) {
    console.log(colors.red, 'Operation failed', colors.reset, error);
  }
}

