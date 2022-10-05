#!/usr/bin/env node
import { program } from "commander";
import { JsonGenerator } from "./index.js";

program
  .option("--contents-dir <string>", "contents dir", "./contents")
  .option("--json-dir <string>", "json dir", "json")
  .option("--md-dir <string>", "md dir", "md")
  .option("--static-dir <string>", "static dir", "./static/")
  .option("--img-dir <string>", "image dir", "img/post");
program.parse(process.argv);

const main = async () => {
  await JsonGenerator.generate(program.opts());
};
main();
