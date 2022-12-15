import { colors } from './constants.js';
import * as nwd from './commands/navigation.js';
import * as fo from './commands/file-operations.js';
import { osInfo } from './commands/os-info.js';
import { calcHash } from './commands/hash.js';
import { zip } from './commands/zip.js';



export async function dispatcher(currentDir, command, commandArgs) {
  let newCurrentDir = currentDir;

  // console.log('Command:', command);
  // console.log('Args:', commandArgs);

  switch (command) {

    case 'up':
      newCurrentDir = nwd.up(currentDir);
      break;

    case 'ls':
      await nwd.ls(currentDir);
      break;

    case 'cd':
      newCurrentDir = await nwd.cd(currentDir, commandArgs);
      break;

    case 'cat':
      await fo.cat(currentDir, commandArgs);
      break;

    case 'add':
      await fo.add(currentDir, commandArgs);
      break;

    case 'rn':
      await fo.rn(currentDir, commandArgs);
      break;

    case 'cp':
      await fo.cp(currentDir, commandArgs);
      break;

    case 'mv':
      await fo.mv(currentDir, commandArgs);
      break;

    case 'rm':
      await fo.remove(currentDir, commandArgs);
      break;

    case 'os':
      osInfo(commandArgs);
      break;

    case 'hash':
      await calcHash(currentDir, commandArgs);
      break;

    case 'compress':
      await zip(true, currentDir, commandArgs);
      break;

    case 'decompress':
      await zip(false, currentDir, commandArgs);
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }

  return newCurrentDir;
}
