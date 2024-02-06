import { workerData, parentPort } from "node:worker_threads";
import { readdir, stat } from "node:fs/promises";
import getAbsolutePath from '../utils/getAbsolutePath.js';

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const path = cmd.split(" ")[1];
  const newCwd = getAbsolutePath(cwd, path);

  await readdir(newCwd)
    .then(() => parentPort.postMessage(newCwd))
    .catch(() => {
      throw new Error();
    });
};

await sendResult();
