import { writeFile, access, rm } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const src = getAbsolutePath(cwd, cmd.split(" ")[1]);
  const dest =
    getAbsolutePath(cwd, cmd.split(" ")[2]) + "/" + cmd.split(" ")[1];

  await access(src).catch(() => {
    throw new Error();
  });

  await writeFile(dest, "");

  const rstream = createReadStream(src, "utf-8");
  const wstream = createWriteStream(dest, "utf-8");

  rstream.pipe(wstream);

  await rm(src);

  parentPort.postMessage("OK");
};

await sendResult();
