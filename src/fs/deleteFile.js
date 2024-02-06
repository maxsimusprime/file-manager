import { rm } from "node:fs/promises";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const filPath = getAbsolutePath(cwd, cmd.split(" ")[1]);

  await rm(filPath);

  parentPort.postMessage("OK");
};

await sendResult();
