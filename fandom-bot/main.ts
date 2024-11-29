// deno-lint-ignore-file prefer-const
import { Mwn } from "npm:mwn";
import process from "node:process";
import dotenv from "npm:dotenv";
import { Buffer } from "node:buffer";
import axios from "npm:axios@1.7.7";
import { diff } from "npm:@bokuweb/image-diff-wasm";
import url from 'node:url'
import path from "node:path";
import chpr from 'node:child_process'
//import lmdb from "npm:lmdb";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdir = 'C:\\Users\\dabak\\Desktop\\Noobie-Bot-SRNGF'

type tcompdata = {
  [key: string]: boolean;
};

interface idevdata {
  name: string;
  file: string;
  userid: string;
}

dotenv.config();

const bot = await Mwn.init({
  apiUrl: "https://sol-rng.fandom.com/api.php",
  username: `NoobieAtCode's Bot@DevImgUpdate`,
  password: process.env.BOT_TOKEN_FD,
  defaultParams: {
    assert: "user",
  },
});

/* Unused bc I didn't end up needing a db
let db = lmdb.open({
  path: "./db/devdata",
  compression: true,
});
*/

let argv = Deno.args;

let pfproute = "https://thumbnails.roblox.com/v1/users/avatar?"; //?userIds=1154167051&size=420x420&format=Png&isCircular=false

let devdata = [
  { name: "54_xyz", file: "File:54_xyz.png", userid: "420685792" },
  { name: "53_Axis", file: "File:53_axis.png", userid: "419860256" },
  { name: "ep1k_solg", file: "File:Epik_solg.png", userid: "1390696522" },
  { name: "xcvbwer123", file: "File:Xcvbwer.png", userid: "361208413" },
  { name: "Rik0nya", file: "File:Rik0nya.png", userid: "1343308718" },
  { name: "2word7", file: "File:Word.png", userid: "2912484262" },
  { name: "hschu_hschu", file: "File:Hschu_hschu.png", userid: "1971714479" },
  { name: "dum_k1tten", file: "File:Nova.png", userid: "3929062638" },
  { name: "Gold_Octopus", file: "File:Gold_octopus.png", userid: "525498778" },
  { name: "dalUL7", file: "File:dalUL7.png", userid: "1913463034" },
];
//Unused Code
/*
await axios.get(pfproute + new URLSearchParams({
    userIds: "1154167051",
    size: "352x352",
    format: "Png",
    isCircular: "false"
})).then(r=>console.log(r.data.data[0].imageUrl))
*/

/*
const upddb = (data: Array<idevdata>, imagedata: ArrayBuffer | null) => {
  interface apd_idata {
    name: string;
    fileurl: string;
  }
  let apd_idata: Array<apd_idata> = [];

  data.forEach((k) => {
    console.log(k.name, ": ", k.file);
    apd_idata.push({ name: k.name, fileurl: "" });
  });

  return apd_idata;
};
*/

//console.log(upddb(devdata, null));

switch (argv[0]) {
  case "-p":
    console.log("P");
}

const iwrite = async (devdata: Array<idevdata>, dirname: string) => {
  for (let k of devdata) {
    let res = await axios.get(
      pfproute + new URLSearchParams({
        userIds: k.userid,
        size: "352x352",
        format: "Png",
        isCircular: "false",
      }),
    );
    //console.log(k.name, ":", res.data.data[0].imageUrl)
    let res2 = await fetch(res.data.data[0].imageUrl);
    let c = await res2.arrayBuffer();
    //console.log(k.file)
    //console.log(c)
    //console.log(r.data)
    Deno.writeFile(`./${dirname}/url-` + k.name + ".png", Buffer.from(c));
    bot.download(
      `${k.file}`,
      "./devicomp/db-" + k.name.replace("File:", "") + ".png",
    );
  };
};

const icomp = async (devdata: Array<idevdata>) => {
  let compdata: tcompdata = {
    "54_xyz": false,
    "53_Axis": false,
    "Rik0nya": false,
    "ep1k_solg": false,
    "xcvbwer123": false,
    "dum_k1tten": false,
    "2word7": false,
    "Gold_Octopus": false,
    "dalUL7": false,
    "hschu_hschu": false,
  };

  for (let k of devdata) {
    let urlfile = await Deno.readFile(path.join(__rootdir, `devicomp/url-${k.name}.png`));
    let dbfile = await Deno.readFile(path.join(__rootdir, `devicomp/db-${k.name}.png`));
    const r = diff(urlfile, dbfile, { enableAntiAlias: true, threshold: 0.01 });
    if (parseInt(r.diffCount) == 0) {
      compdata[k.name] = false;
    } else if (parseInt(r.diffCount) != 0) compdata[k.name] = true;
  }
  return compdata;
};

const update = async (devdata: Array<idevdata>, icomp: tcompdata) => {
  for (let k of devdata) {
    for (let v of Object.keys(icomp)) {
      if (v !== k.name) continue;
      if (!icomp[v]) continue;
      console.log(`Updated: ${v}`);
      await bot.upload(`./devicomp/url-${k.name}.png`, k.file, "Update", {
        ignorewarnings: true,
      }).catch((err)=>{
        if (err.code) {
          console.log(err.code)
          if (err.code === "fileexists-no-change") {
            console.log("No change? (try .refresh)");
          }
        }
      });
    }
  }
};
//update(devdata, await icomp(devdata));



//iwrite(devdata, "devicomp");
//console.log(await icomp(devdata));

const fclear = () => {
  chpr.execSync('del /q devicomp')
}

const help = () => {
  console.log(`
  List of commands:\n
  .help: Lists the commands/their functions\n
  .exit: Exits the program\n
  .devi: Runs Devi (Developer Image Updater)\n
  .iwrite: Gets the images and puts them into 'devicomp'\n
  .fclear: Deletes all the files in 'devicomp'\n
  .refresh: Refreshes the images in 'devicomp'
  `);
  prompt("Press Enter to continue");
};

const devi = async () => {
  let icompd = await icomp(devdata);
  if (Object.values(icompd).every((v) => v === false)) {console.log("No Files to Update"); return}
  await iwrite(devdata, "devicomp");
  console.log("The following images need to be updated: ");
  for (let k in icompd) {
    if (icompd[k]) console.log(k);
    if (!icompd[k]) continue;
  }
  let confupd = prompt("Confirm to update: [Y/y] -> yes | [N/n] -> no:");
  if (confupd?.toLocaleLowerCase() === 'y') await update(devdata, icompd);
  if (confupd?.toLocaleLowerCase() === 'n') return
  if (confupd?.toLocaleLowerCase() !== 'n' && confupd?.toLocaleLowerCase() !== 'y') {console.log("Invalid Input"); return}
  console.log("Updating db files")
  await iwrite(devdata, 'devicomp').finally(()=>{
    console.log("Update Complete")
  })
};

const CLI = async () => {
  while (true) {
    let input = prompt("Enter: ");

    switch (input) {
      case ".help":
        help();
        continue;
      // deno-lint-ignore no-fallthrough
      case ".exit":
        process.exit(0);
      case ".clear":
        process.stdout.write("\x1Bc");
        continue;
      case ".devi":
        await devi().catch(async (err) => {
          if (/^(NotFound\: The system cannot find the file specified\.)/g.test(err)) {await iwrite(devdata, 'devicomp')}
        })
        continue;
      case ".iwrite":
        await iwrite(devdata, 'devicomp')
        continue
      case ".fclear":
        fclear()
        continue
      case ".refresh":
        fclear()
        await iwrite(devdata, 'devicomp')
        continue
      default:
        console.log(
          `Command of ${input} not recognized.\nRun .help for a list of commands`,
        );
    }
  }
};

CLI();

export { CLI };