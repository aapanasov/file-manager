import { createHash } from 'node:crypto';
import { makeFilePath } from '../helpers.js';
import { createReadStream } from 'node:fs';


export async function calcHash(currentDir, args) {
  const filePath = makeFilePath(currentDir, args);

  const hashSum = (filePath) => new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const fileStream = createReadStream(filePath);

    fileStream.on('error', reject);
    fileStream.on('data', (chunk) => hash.update(chunk));
    fileStream.on('end', () => resolve(hash.digest('hex')));

  });

  try {
    const result = await hashSum(filePath);
    console.log(result);
  } catch (error) {
    throw error;
  }
}