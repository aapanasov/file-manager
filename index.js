import { createInterface } from 'node:readline/promises';
import { homedir } from 'node:os';
import { colors } from './constants.js';
import * as cmd from './commands.js';


const args = process.argv[2]?.split('=');

if (!(args && args[0] === '--username' && args[1])) {
  console.log('Please start in following way:', colors.yellow, 'npm run start -- --username=your_username', colors.reset);
  process.exit();
}

const userName = args[1];

let currentDir = homedir();

console.log(`Welcome to the File Manager, ${colors.yellow}${userName}!${colors.reset}`);

const readline = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
readline.on('close', () => cmd.exit(userName));

while (true) {
  const answer = await readline.question(`You are currently in ${colors.green}${currentDir}\n$>${colors.reset} `);
  const [command, ...last] = answer.trim().split(' ');
  const commandArgs = last.join(' ');

  switch (command) {
    case '.exit':
      cmd.exit(userName);
      break;

    case 'up':
      currentDir = cmd.up(currentDir);
      break;

    case 'ls':
      await cmd.ls(currentDir);
      break;

    case 'cd':
      currentDir = await cmd.cd(currentDir, commandArgs);
      break;

    case 'cat':
      cmd.cat(currentDir, commandArgs);
      break;

    case 'add':
      await cmd.add(currentDir, commandArgs);
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }
}
