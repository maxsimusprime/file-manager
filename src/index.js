import { EOL, homedir } from "node:os";
import { stdin as input, stdout as output, exit } from "node:process";
import { createInterface } from "node:readline/promises";
import getUserNameFromArgs from "./utils/getUserNameFromArgs.js";
import { Worker } from "node:worker_threads";
import getAbsolutePath from "./utils/getAbsolutePath.js";
import { sep, join, normalize } from "node:path";

const run = async () => {
  const userName = getUserNameFromArgs();

  let cwd = homedir();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${cwd + EOL}`
  );

  process.on("exit", () => {
    readlineInterface.write(
      `${EOL}Thank you for using File Manager, ${userName}, goodbye!👻`
    );
    exit();
  });

  while (true) {
    const cmd = await readlineInterface.question(
      "Print commands and wait → → →  "
    );
    const operationName = cmd.split(" ")[0];
    let workerPath;

    switch (operationName) {
      case ".exit":
        exit();

      case "up":
        if (cmd.split(" ").length !== 1) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          const arrFromPath = cwd.split(sep);
          if (arrFromPath.length > 1) {
            cwd = join(...arrFromPath.slice(0, -1));
          }
          if (arrFromPath.length === 2) {
            cwd = normalize(cwd.replace(".", "\\"));
          }
        }
        break;

      case "cd":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          await new Promise((response) => {
            const worker = new Worker("./src/nav/getNewCwd.js", {
              workerData: { cmd, cwd },
            });
            worker.on("message", (data) => {
              cwd = data;
              response("OK");
            });
            worker.on("error", () => response("Operation failed"));
          })
            .then((data) => readlineInterface.write(data + EOL))
            .catch((err) => readlineInterface.write(err));
        }
        break;

      case "ls":
        if (cmd.split(" ").length !== 1) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/nav/getDirList.js"
          );
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
          workerPath = getAbsolutePath(process.cwd(), "./src/fs/renameFile.js");
        }
        break;

      case "cp":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/fs/copyFile.js");
        }
        break;

      case "mv":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/fs/moveFile.js");
        }
        break;

      case "rm":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/fs/deleteFile.js");
        }
        break;

      case "os":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/os/os.js");
        }
        break;

      case "hash":
        if (cmd.split(" ").length !== 2) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/hash/hash.js");
        }
        break;

      case "compress":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(process.cwd(), "./src/zip/compress.js");
        }
        break;

      case "decompress":
        if (cmd.split(" ").length !== 3) {
          readlineInterface.write("Invalid input" + EOL);
        } else {
          workerPath = getAbsolutePath(
            process.cwd(),
            "./src/zip/decompress.js"
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

await run();
