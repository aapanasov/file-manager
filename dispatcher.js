import * as cmd from './commands.js';
import { colors } from './constants.js';



export async function dispatcher(currentDir, command, commandArgs) {
  let newCurrentDir = currentDir;

  switch (command) {

    case 'up':
      newCurrentDir = cmd.up(currentDir);
      break;

    case 'ls':
      await cmd.ls(currentDir);
      break;

    case 'cd':
      newCurrentDir = await cmd.cd(currentDir, commandArgs);
      break;

    case 'cat':
      await cmd.cat(currentDir, commandArgs);
      break;

    case 'add':
      await cmd.add(currentDir, commandArgs);
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }

  return newCurrentDir;
}
