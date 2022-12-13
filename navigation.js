import { join, sep } from 'node:path';
import { access, constants, readdir, stat } from 'node:fs/promises';
import { makePath } from './helpers.js';


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
    throw error;
  }
}

export async function cd(currentDir, destinationDir) {
  const dir = makePath(currentDir, destinationDir);

  try {
    await access(dir, constants.R_OK | constants.W_OK);
    return dir;
  } catch (error) {
    throw error;
  }
}