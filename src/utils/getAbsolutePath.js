import { join, isAbsolute } from "node:path";

export default (cwd, path) => (isAbsolute(path) ? path : join(cwd, path));
