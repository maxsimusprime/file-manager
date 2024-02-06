import { writeFile, access } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";
import { createBrotliDecompress } from "zlib";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const src = getAbsolutePath(cwd, cmd.split(" ")[1]);
  const dest =
    getAbsolutePath(cwd, cmd.split(" ")[2]) + "/" + cmd.split(" ")[1].split('.gz')[0];

  await access(src).catch(() => {
    throw new Error();
  });

  await writeFile(dest, "");

  const rstream = createReadStream(src);
  const wstream = createWriteStream(dest);

  rstream.pipe(createBrotliDecompress()).pipe(wstream);

  parentPort.postMessage("OK");
};

await sendResult();
