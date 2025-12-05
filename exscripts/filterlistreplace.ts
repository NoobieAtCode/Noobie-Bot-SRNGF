import { Buffer } from "node:buffer";
import process from "node:process";
import dotenv from 'dotenv'
import path from "node:path";

dotenv.config()
const __rootdir = process.env.DEVI_ROOT_DIR as string;

const cfile = await Deno.readFile(path.join(__rootdir, "exscripts\\lang.ts"))
const crfile = await Deno.readFile(path.join(__rootdir, "exscripts\\array.ts"))

await Deno.writeFile(path.join(__rootdir, "node_modules\\bad-words\\src\\lang.ts"), cfile)
await Deno.writeFile(path.join(__rootdir, "node_modules\\.deno\\badwords-list@2.0.1-4\\node_modules\\badwords-list\\dist\\array.js"), crfile)
await Deno.writeFile(path.join(__rootdir, "node_modules\\.deno\\bad-words@4.0.0\\node_modules\\bad-words\\dist\\lang.js"), crfile)

