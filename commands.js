import { colors } from './constants.js';
import { basename, join, sep } from 'node:path';
import { access, constants, readdir, stat, open, rename, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { makePath, splitArgs } from './helpers.js';


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

export async function cat(currentDir, filePath) {
  const path = makePath(currentDir, filePath);

  const syncPromise = new Promise((resolve, reject) => {
    const fileStream = createReadStream(path, { encoding: 'utf8' });
    fileStream.on('data', (chunk) => process.stdout.write(chunk));
    fileStream.on('error', reject);
    fileStream.on('end', resolve);
  });

  await syncPromise;
}

export async function add(currentDir, filePath) {
  const path = makePath(currentDir, filePath);

  try {
    const fileHandle = await open(path, 'ax');
    await fileHandle.close();

  } catch (error) {
    throw error;
  }
}

export async function rn(currentDir, args) {
  const [src, dest] = splitArgs(args);

  const filePath = makePath(currentDir, src);
  const newFilename = makePath(currentDir, dest);

  try {
    await rename(filePath, newFilename);
  } catch (error) {
    throw error;
  }
}

export async function cp(currentDir, args) {
  const [src, dest] = splitArgs(args);

  const filePath = makePath(currentDir, src);
  const newDirPath = makePath(currentDir, dest);
  const newFilePath = join(newDirPath, basename(filePath));

  const syncPromise = new Promise((resolve, reject) => {
    const streamToRead = createReadStream(filePath);
    const streamToWrite = createWriteStream(newFilePath, { flags: 'wx' });

    streamToRead.on('end', resolve);
    streamToRead.on('error', reject);
    streamToWrite.on('error', reject);

    streamToRead.pipe(streamToWrite);
  });

  await syncPromise;
}

export async function remove(currentDir, args) {
  const filePath = makePath(currentDir, args);

  try {
    await rm(filePath);
  } catch (error) {
    throw error;
  }
}
