import { rename as rn } from "node:fs/promises";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const oldFilePath = getAbsolutePath(cwd, cmd.split(" ")[1]);
  const newFilePath = getAbsolutePath(cwd, cmd.split(" ")[2]);

  await rn(oldFilePath, newFilePath);

  parentPort.postMessage("OK");
};

await sendResult();
