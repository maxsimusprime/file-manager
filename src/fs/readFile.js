import { createReadStream } from "node:fs";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from '../utils/getAbsolutePath.js';

const sendResult = () => {
  const { cmd, cwd } = workerData;

  const filePath = getAbsolutePath(cwd, cmd.split(" ")[1]);

  let res = "";

  const rstream = createReadStream(filePath, "utf-8");

  rstream.on("data", (chunk) => (res += chunk));
  rstream.on("end", () => parentPort.postMessage(res));
};

sendResult();
