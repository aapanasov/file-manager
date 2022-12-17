import { join, sep } from 'node:path';
import { access, constants, readdir, stat } from 'node:fs/promises';
import { makePath } from '../helpers.js';


export function up(currentDir) {
  return makePath(currentDir, '..');
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
    const sortedResult = result
      .sort((a, b) => a['Name'].toLowerCase() < b['Name'].toLowerCase() ? 1 : -1)
      .sort((a, b) => a['Type'] > b['Type'] ? 1 : -1);

    console.table(sortedResult);

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