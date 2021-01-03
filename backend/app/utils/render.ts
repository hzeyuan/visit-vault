import Handlebars from "handlebars";

import { readFileAsync } from "../utils/fs/async";

export async function renderHandlebars<T>(file: string, context: T): Promise<string> {
  const text = await readFileAsync(file, "utf-8");
  return Handlebars.compile(text)(context);
}
