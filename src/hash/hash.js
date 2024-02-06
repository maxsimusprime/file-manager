import { access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { workerData, parentPort } from "node:worker_threads";
import getAbsolutePath from "../utils/getAbsolutePath.js";

const sendResult = async () => {
  const { cmd, cwd } = workerData;

  const filePath = getAbsolutePath(cwd, cmd.split(" ")[1]);

  await access(filePath).catch(() => {
    throw new Error();
  });

  let content = "";

  const rstream = createReadStream(filePath, "utf-8");

  rstream.on("data", (chunk) => (content += chunk));
  rstream.on("end", () =>
    parentPort.postMessage(
      createHash("sha256").update(content, "utf-8").digest("hex")
    )
  );
};

await sendResult();
