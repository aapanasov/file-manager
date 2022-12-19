import { isAbsolute, join, normalize } from 'node:path';
import { access } from 'fs/promises';

/**
 Split args string by ", ' or space.
 Return array -> [arg0, arg1]
  */
export function splitArgs(args) {
  const sep = (args[0] === '"' || args[0] === "'") ? args[0] : ' ';

  return args
    .split(sep)
    .map(item => item.trim())
    .filter(item => item)
    .slice(0, 2);
}

export function makePath(currentDir, path) {
  const pathToGo = isAbsolute(path + '/') ? join(path, '/') : join(currentDir, path, '/');
  const normalPath = normalize(pathToGo);
  return normalPath === '\\' ? currentDir.slice(0, 3) : normalPath;
}

export function makeFilePath(currentDir, path) {
  return makePath(currentDir, path).slice(0, -1);
}

export const isExist = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};