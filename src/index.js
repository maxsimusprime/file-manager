import { EOL, homedir } from "node:os";
import { stdin as input, stdout as output, exit } from "node:process";
import { createInterface } from "node:readline/promises";
import getUserNameFromArgs from "./utils/getUserNameFromArgs.js";
import InvalidInputError from "./types/InvalidInputError.js";
// import readFile from "./fs/readFile.js";
import { spawn } from "node:child_process";
import { Worker } from "node:worker_threads";
import getAbsolutePath from "./utils/getAbsolutePath.js";

const run1 = async () => {
  const userName = getUserNameFromArgs();

  const cwd = homedir();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${cwd + EOL}`
  );

  process.on("exit", () => {
    readlineInterface.write(
      `${EOL}Thank you for using File Manager, ${userName}, goodbye!`
    );
    exit();
  });

  while (true) {
    await new Promise(async (resolve, reject) => {
      const cmd = await readlineInterface.question(">_ ");

      if (cmd === ".exit") exit();

      if (cmd.startsWith("cat")) {
        const argsArray = cmd.split(" ");
        if (argsArray.length !== 2) reject(new InvalidInputError());
        resolve(readFile());
      }

      if (cmd === "error") resolve(new Error());

      reject(new InvalidInputError());
    })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error(data);
        } else {
          readlineInterface.write(data + EOL);
        }
      })
      .catch((error) => {
        console.log("promise catch");
        if (error instanceof InvalidInputError) {
          readlineInterface.write(error.message + EOL);
        } else {
          readlineInterface.write("Operation failed" + EOL);
        }
      })
      .finally(() => {
        readlineInterface.write(`You are currently in ${cwd + EOL}`);
      });
  }
};

// switch case
const run2 = async () => {
  const userName = getUserNameFromArgs();

  const cwd = homedir();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${cwd + EOL}`
  );

  process.on("exit", () => {
    readlineInterface.write(
      `${EOL}Thank you for using File Manager, ${userName}, goodbye!`
    );
    exit();
  });

  while (true) {
    const cmd = await readlineInterface.question(">_ ");
    const operationName = cmd.split(" ")[0];

    switch (operationName) {
      case ".exit":
        exit();
      case "cat":
        await readFile(cmd, cwd, readlineInterface);
        break;
      default:
        readlineInterface.write("Invalid input" + EOL);
        break;
    }
    readlineInterface.write(`You are currently in ${cwd + EOL}`);
  }
};

// child process
const run = async () => {
  const userName = getUserNameFromArgs();

  const cwd = homedir();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${cwd + EOL}`
  );

  process.on("exit", () => {
    readlineInterface.write(
      `${EOL}Thank you for using File Manager, ${userName}, goodbye!`
    );
    exit();
  });

  while (true) {
    const cmd = await readlineInterface.question(">_ ");
    const operationName = cmd.split(" ")[0];

    const spawnChildProcess = async (args) => {
      const command = "node";
      spawn(command, [...args], {
        stdio: ["inherit", "inherit", "inherit"],
      });
    };

    switch (operationName) {
      case ".exit":
        exit();
      case "cat":
        await spawnChildProcess(["./src/fs/readFile.js", cmd, cwd]);

        break;
      default:
        readlineInterface.write("Invalid input" + EOL);
        readlineInterface.write(`You are currently in ${cwd + EOL}`);
        break;
    }
  }
};

const runWT = async () => {
  const userName = getUserNameFromArgs();

  const cwd = homedir();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${cwd + EOL}`
  );

  process.on("exit", () => {
    readlineInterface.write(
      `${EOL}Thank you for using File Manager, ${userName}, goodbye!`
    );
    exit();
  });

  while (true) {
    const cmd = await readlineInterface.question(">_ ");
    const operationName = cmd.split(" ")[0];
    let workerPath;

    switch (operationName) {
      case ".exit":
        exit();
      case "wt":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = "./src/worker.js";
        }
        break;
      case "cat":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/fs/readFile.js");
        }
        break;
      case "add":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/fs/createEmptyFile.js"
          );
        }
        break;
      case "rn":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/fs/renameFile.js"
          );
        }
        break;
      case "cp":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/fs/copyFile.js"
          );
        }
        break;
      case "mv":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/fs/moveFile.js"
          );
        }
        break;
      case "rm":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/fs/deleteFile.js"
          );
        }
        break;
      case "os":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/os/os.js"
          );
        }
        break;
      case "hash":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/hash/hash.js"
          );
        }
        break;
      default:
        readlineInterface.write("Invalid input" + EOL);
        break;
    }

    if (workerPath) {
      await new Promise((response) => {
        const worker = new Worker(workerPath, { workerData: { cmd, cwd } });
        worker.on("message", (data) => response(data));
        worker.on("error", () => response("Operation failed"));
      })
        .then((data) => readlineInterface.write(data + EOL))
        .catch((err) => readlineInterface.write(err));
    }

    readlineInterface.write(`You are currently in ${cwd + EOL}`);
  }
};

await runWT();
