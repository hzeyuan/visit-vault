import { readFileSync } from "fs";
import *  as path from "path";

// import { getConfig } from "../config";

export function libraryPath(str: string): string {
  return path.join('public', str);
}

export const isDocker = (function (): boolean {
  try {
    return readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch (_) {
    // Will only have error if not in a docker environment
    return false;
  }
})();

export function configPath(...paths: string[]): string {
  if (isDocker) {
    return path.resolve(path.join("/config", ...paths));
  }
  return path.resolve(process.cwd(), ...paths);
}
