import { writeFile } from "node:fs/promises";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const filePath = getAbsolutePath(cwd, cmd.split(" ")[1]);

  await writeFile(filePath, "");

  parentPort.postMessage("File created");
};

await sendResult();
