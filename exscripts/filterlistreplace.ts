import { Buffer } from "node:buffer";
import process from "node:process";
import dotenv from 'dotenv'
import path from "node:path";

dotenv.config()
const __rootdir = process.env.DEVI_ROOT_DIR as string;

const cfile = await Deno.readFile(path.join(__rootdir, "exscripts/lang.ts"))

await Deno.writeFile(path.join(__rootdir, "node_modules/bad-words/src/lang.ts"), cfile)