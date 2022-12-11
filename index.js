import { createInterface } from 'node:readline/promises';
import { homedir } from 'node:os';
import { colors } from './constants.js';
import { dispatcher } from './dispatcher.js';
import { exit } from './commands.js';

const args = process.argv[2]?.split('=');

if (!(args && args[0] === '--username' && args[1])) {
  console.log('Please start in following way:', colors.yellow, 'npm run start -- --username=your_username', colors.reset);
  process.exit();
}

const userName = args[1];

let currentDir = homedir();

console.log(`Welcome to the File Manager, ${colors.yellow}${userName}!${colors.reset}`);
process.stdout.write(`\nYou are currently in ${colors.green}${currentDir}\n$>${colors.reset} `);

const readline = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
process.on('SIGINT', () => exit(userName));

readline.on('line', async (line) => {
  const input = line.trim();
  if (input === '.exit') exit(userName);

  const [command, ...tail] = input.split(' ');
  const commandArgs = tail.join(' ');

  currentDir = await dispatcher(currentDir, command, commandArgs);

  process.stdout.write(`\nYou are currently in ${colors.green}${currentDir}\n$>${colors.reset} `);
});
