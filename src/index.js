import { EOL } from "node:os";
import { stdin as input, stdout as output, exit } from "node:process";
import { createInterface } from "node:readline/promises";
import getUserNameFromArgs from "./utils/getUserNameFromArgs.js";
import InvalidInputError from "./types/InvalidInputError.js";

const run = async () => {
  const userName = getUserNameFromArgs();

  const readlineInterface = createInterface({ input, output });

  readlineInterface.write(
    `Welcome to the File Manager, ${userName + "!" + EOL}` +
      `You are currently in ${"path_to_working_directory" + EOL}`
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

      if (cmd === "cat") resolve("OK");

      reject(new InvalidInputError());
    })
      .then((message) => {
        readlineInterface.write(message + EOL);
      })
      .catch((error) => {
        if (error instanceof InvalidInputError) {
          readlineInterface.write(error.message + EOL);
        } else {
          readlineInterface.write("Operation failed" + EOL);
        }
      })
      .finally(() => {
        readlineInterface.write(
          `You are currently in ${"path_to_working_directory" + EOL}`
        );
      });
  }
};

await run();
