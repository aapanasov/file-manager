import { createHash } from 'node:crypto';
import { makePath } from '../helpers.js';
import { readFile } from 'node:fs/promises';


// TODO: fix to calc hash for files larger than 2Gb
export async function calcHash(currentDir, args) {

  const filePath = makePath(currentDir, args);

  try {
    const fileBuffer = await readFile(filePath);
    const hashSum = createHash('sha256').update(fileBuffer).digest('hex');
    console.log(hashSum);
  } catch (error) {
    throw error;
  }

};