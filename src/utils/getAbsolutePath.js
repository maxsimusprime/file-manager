import { join, isAbsolute, normalize } from "node:path";

export default (cwd, path) => normalize(isAbsolute(path) ? path : join(cwd, path));
