import { createInterface } from 'node:readline/promises';
import { homedir } from 'node:os';
import { join, sep } from 'node:path';
import { readdir, stat } from 'node:fs/promises';
import { colors } from './constants.js';


const args = process.argv[2]?.split('=');

if (!(args && args[0] === '--username' && args[1])) {
  console.log('Please start in following way:', colors.yellow, 'npm run start -- --username=your_username', colors.reset);
  process.exit();
}

const userName = args[1];

let currentDir = homedir();

console.log(`Welcome to the File Manager, ${colors.yellow}${userName}!${colors.reset}`);

const readline = createInterface({ input: process.stdin, output: process.stdout });
readline.on('close', onExit);

while (true) {
  const answer = await readline.question(`You are currently in ${colors.green}${currentDir}\n$>${colors.reset} `);

  switch (answer.trim().split(' ')[0]) {
    case '.exit':
      onExit();
      break;

    case 'up':
      currentDir = onUp(currentDir);
      break;

    case 'ls':
      await onLs(currentDir);
      break;

    default:
      console.log(colors.red, 'Invalid input', colors.reset);
      break;
  }
}

function onExit() {
  console.log(`\nThank you for using File Manager, ${colors.yellow}${userName}${colors.reset}, goodbye!`);
  process.exit();
};

function onUp(dir) {
  if (dir.length === 2 && dir[1] === ':') return dir;
  if (dir === '/') return dir;

  return dir.split(sep).slice(0, -1).join(sep);
}

async function onLs(dir) {
  try {
    const dirContent = await readdir(dir);

    const dirContentPromises = dirContent.map(async (item) => {
      const path = join(dir, item);

      try {
        const itemStats = await stat(path);
        return {
          Name: item,
          Type: itemStats.isDirectory() ? 'directory' : 'file'
        };
      } catch (error) {
        return {
          Name: item,
          Type: 'file'
        };
      }
    });

    const result = await Promise.all(dirContentPromises);
    console.table(result);

  } catch (error) {
    console.log(colors.red, 'Operation failed', colors.reset);
  }
}

