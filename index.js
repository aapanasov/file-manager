import { createInterface } from 'node:readline/promises';
import { homedir } from 'node:os';

const colors = {
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

const args = process.argv[2]?.split('=');

if (!(args[0] === '--username' && args[1])) {
  console.log('Please start in following way:', colors.yellow, 'npm run start -- --username=your_username', colors.reset);
  process.exit();
}

const userName = args[1];

let currentDir = homedir;

const commands = ['cd', 'ls', 'up', '.exit'];

const onExit = () => {
  console.log(`\nThank you for using File Manager, ${colors.yellow}${userName}${colors.reset}, goodbye!`);
  process.exit();
};

console.log(`Welcome to the File Manager, ${colors.yellow}${userName}!${colors.reset}`);

const readline = createInterface({ input: process.stdin, output: process.stdout });
readline.on('close', onExit);

while (true) {
  const answer = await readline.question(`You are currently in ${colors.green}${currentDir}\n$>${colors.reset} `);

  switch (answer.trim().split(' ')[0]) {
    case '.exit':
      onExit();
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }
}

