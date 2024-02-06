import { workerData, parentPort } from "node:worker_threads";
import { readdir, stat } from "node:fs/promises";
import { EOL } from "node:os";
import { join } from "node:path";

const sendResult = async () => {
  const { cwd } = workerData;

  const files = await readdir(cwd);

  const result = [...files].map(async (el, i) => {
    return await stat(join(cwd, el)).then(
      (stat) =>
        `${i}\t\'${el}\'\t\t\t${stat.isDirectory() ? "'directory'" : "'file'"} `
    );
  });

  Promise.all(result)
    .then((res) => res.join(EOL))
    .then((message) => parentPort.postMessage(message));
};

await sendResult();
