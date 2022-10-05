import { program } from "commander";
import { JsonGenerator } from "./index.js";

program.parse(process.argv);
JsonGenerator.generate();
