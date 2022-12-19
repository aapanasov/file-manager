import { basename, dirname, join } from 'node:path';
import { open, rename, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { isExist, makePath, makeFilePath, splitArgs } from '../helpers.js';

export async function cat(currentDir, filePath) {
  const path = makeFilePath(currentDir, filePath);

  const syncPromise = new Promise((resolve, reject) => {
    const fileStream = createReadStream(path, { encoding: 'utf8' });
    fileStream.on('data', (chunk) => process.stdout.write(chunk));
    fileStream.on('error', reject);
    fileStream.on('end', resolve);
  });

  await syncPromise;
}

export async function add(currentDir, filePath) {
  const path = makeFilePath(currentDir, filePath);

  try {
    const fileHandle = await open(path, 'ax');
    await fileHandle.close();

  } catch (error) {
    throw error;
  }
}

export async function rn(currentDir, args) {
  const [src, dest] = splitArgs(args);

  const filePath = makeFilePath(currentDir, src);
  const basedir = dirname(filePath);
  const newFilename = basename(makePath(currentDir, dest));
  const newFilePath = join(basedir, newFilename);

  if (await isExist(newFilePath)) throw new Error('File already exist!');

  try {
    await rename(filePath, newFilePath);
  } catch (error) {
    throw error;
  }
}

export async function cp(currentDir, args) {
  const [src, dest] = splitArgs(args);

  const filePath = makeFilePath(currentDir, src);
  const newDirPath = makePath(currentDir, dest);
  const newFilePath = join(newDirPath, basename(filePath));

  const syncPromise = new Promise((resolve, reject) => {
    const streamToRead = createReadStream(filePath);

    streamToRead.on('ready', () => {
      const streamToWrite = createWriteStream(newFilePath, { flags: 'wx' });

      streamToWrite.on('error', () => {
        streamToRead.close();
        reject('write error');
      });

      streamToRead.pipe(streamToWrite);
    });

    streamToRead.on('end', resolve);
    streamToRead.on('error', () => {
      streamToRead.close();
      reject('read error');
    });
  });

  await syncPromise;
}

export async function remove(currentDir, args) {
  const filePath = makeFilePath(currentDir, args);

  try {
    await rm(filePath);
  } catch (error) {
    throw error;
  }
}

export async function mv(currentDir, args) {
  await cp(currentDir, args);

  const [fileToRemove] = splitArgs(args);
  await remove(currentDir, fileToRemove);
}
