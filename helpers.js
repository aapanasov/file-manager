import { isAbsolute, join } from 'node:path';

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
  return isAbsolute(path) ? path : join(currentDir, path);
}