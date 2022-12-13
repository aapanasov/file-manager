import { basename, join } from 'node:path';
import { open, rename, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { makePath, splitArgs } from '../helpers.js';

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

export async function mv(currentDir, args) {
  await cp(currentDir, args);

  const [fileToRemove] = splitArgs(args);
  await remove(currentDir, fileToRemove);
}
