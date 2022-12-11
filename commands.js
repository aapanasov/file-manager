import { colors } from './constants.js';
import { isAbsolute, join, sep } from 'node:path';
import { access, constants, readdir, stat, open } from 'node:fs/promises';
import { createReadStream } from 'node:fs';


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
    console.log(colors.red, 'Operation failed', colors.reset);
  }
}

export async function cd(currentDir, destinationDir) {

  const dir = isAbsolute(destinationDir) ? destinationDir : join(currentDir, destinationDir);

  try {
    await access(dir, constants.R_OK | constants.W_OK);
    return dir;
  } catch (error) {
    console.log(colors.red, 'Operation failed', colors.reset);
    return currentDir;
  }

}

// TODO: fix cat async output
export function cat(currentDir, filePath) {
  const path = isAbsolute(filePath) ? filePath : join(currentDir, filePath);

  const fileStream = createReadStream(path, { encoding: 'utf8' });
  fileStream.on('data', (chunk) => process.stdout.write(chunk));
  fileStream.on('error', (err) => {
    console.log(colors.red, 'Operation failed', colors.reset);
  });
}

export async function add(currentDir, filePath) {
  const path = isAbsolute(filePath) ? filePath : join(currentDir, filePath);
  try {
    const fileHandle = await open(path, 'ax');
    await fileHandle.close();

  } catch (error) {
    console.log(colors.red, 'Operation failed', colors.reset);
  }
}

