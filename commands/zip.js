import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { makePath, splitArgs } from '../helpers.js';
import { pipeline } from 'node:stream/promises';


export async function zip(compress, currentDir, args) {
  const [src, dest] = splitArgs(args);
  const filePath = makePath(currentDir, src);
  const compressedFilePath = makePath(currentDir, dest);

  const zipFunc = compress ? createBrotliCompress() : createBrotliDecompress();

  try {
    await pipeline(
      createReadStream(filePath),
      zipFunc,
      createWriteStream(compressedFilePath, { flags: 'wx' })
    );

  } catch (error) {
    throw error;
  }
}