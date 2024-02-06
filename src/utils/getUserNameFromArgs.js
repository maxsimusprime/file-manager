import { argv } from "node:process";

export default () => {
  const userNameArg = argv
    .slice(2)
    .filter((arg) => arg.startsWith("--username="));
  return userNameArg.length > 0 ? userNameArg[0].split("=")[1] : "";
};
