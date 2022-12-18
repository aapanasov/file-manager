import { arch, cpus, EOL, homedir, userInfo } from 'node:os';

export function osInfo(arg) {
  let info;

  switch (arg) {
    case '--EOL':
      info = EOL.split('').length === 2 ? "\\r\\n" : "\\n";
      break;

    // TODO: format output
    case '--cpus':
      const cpusRaw = cpus();
      info = cpusRaw.map(cpu => ({
        model: cpu.model.slice(0, 25),
        speed: (cpu.speed / 1000) + ' GHz'
      }));
      break;

    case '--homedir':
      info = homedir();
      break;

    case '--username':
      info = userInfo().username;
      break;

    case '--architecture':
      info = arch();
      break;

    default:
      throw new Error();
  }

  console.table(info);
  // console.log(info);
}