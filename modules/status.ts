import { Mwn } from "npm:mwn";
import process from "node:process";
import dotenv from "npm:dotenv";

dotenv.config();

const bot = await Mwn.init({
  apiUrl: "https://sol-rng.fandom.com/api.php",
  username: `NoobieAtCode's Bot@Miscellaneous`,
  password: process.env.BOT_TOKEN_M,
  defaultParams: {
    assert: "user",
  },
});

let statusptitle = "User:NoobieAtCode's_Bot/IO";

let statuspage = await bot.read(statusptitle, {
  rvprop: ["content", "timestamp", "user", "comment", "size", "ids"],
});

if (statuspage.revisions === undefined) {
  console.log("Content is undefined");
  process.exit();
}
if (
  statuspage.revisions.length === undefined ||
  statuspage.revisions.length === 0 || statuspage.revisions[0] === null
) {
  console.log("Content is undefined");
  process.exit();
}

let scontent = statuspage.revisions[0].content as string;
let offregex = /(\{\{User\:NoobieAtCode\/Templates\/Off\}\})/g;
console.log(offregex.test(scontent));

const status = async () => {
  if (statuspage.revisions === undefined) {
    console.log("Content is undefined");
    process.exit();
  }
  let userg = await bot.request({
    action: "query",
    list: "users",
    ususers: statuspage.revisions[0].user as string,
    usprop: "groups",
  });
  console.log(userg.query?.users[0].groups);
  let usergroups = userg.query?.users[0].groups;
  let ugdet = false;
  console.log(usergroups.map((k: string) => {
    if (k === "sysop" || k === "bureaucrat") {
      ugdet = true;
    }
  }));

  if (ugdet) return true;
};

export { status };
