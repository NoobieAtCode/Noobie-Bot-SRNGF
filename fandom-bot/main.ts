import { devi } from "./devi.ts";
import { status } from "../modules/status.ts";

let argv = Deno.args[0];
console.log(argv);

switch (argv) {
  case "-devi":
    devi();
    break;
  case "-status":
    status();
    break;
}
