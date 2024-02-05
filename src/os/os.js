import { workerData, parentPort } from "node:worker_threads";
import { EOL, cpus, homedir, userInfo, arch } from "node:os";

const sendResult = () => {
  const { cmd } = workerData;

  const operationArg = cmd.split(" ")[1];

  switch (operationArg) {
    case "--EOL":
      parentPort.postMessage(EOL === "\r\n" ? "\\r\\n" : "\\n");
      break;
    case "--cpus":
      parentPort.postMessage(JSON.stringify(cpus(), null, "  "));
      break;
    case "--homedir":
      parentPort.postMessage(homedir());
      break;
    case "--username":
      parentPort.postMessage(userInfo().username);
      break;
    case "--architecture":
      parentPort.postMessage(arch());
      break;
    default:
      parentPort.postMessage("Invalid input");
      break;
  }
};

sendResult();
