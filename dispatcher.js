import * as cmd from './commands.js';
import * as nwd from './navigation.js';
import { colors } from './constants.js';



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
      await cmd.cat(currentDir, commandArgs);
      break;

    case 'add':
      await cmd.add(currentDir, commandArgs);
      break;

    case 'rn':
      await cmd.rn(currentDir, commandArgs);
      break;

    case 'cp':
      await cmd.cp(currentDir, commandArgs);
      break;

    case 'mv':
      await cmd.mv(currentDir, commandArgs);
      break;

    case 'rm':
      await cmd.remove(currentDir, commandArgs);
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }

  return newCurrentDir;
}
