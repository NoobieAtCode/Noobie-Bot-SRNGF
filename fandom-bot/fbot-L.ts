/**
 * EOL as of 11/27/2024 7:23 PM PST
 */

import { Mwn } from "npm:mwn";
import process from "node:process";
import dotenv from "npm:dotenv";
// deno-lint-ignore no-unused-vars
import { awebhookreport } from "../modules/misc.ts";
import { fetchMostRecentChange } from "../modules/wikiRC.ts";
import { Filter } from "npm:bad-words";
import { open } from "npm:lmdb";
import lmdb from "npm:lmdb";
import { Buffer } from "node:buffer";

const filter = new Filter();

const db = open({
  path: "./db/logs",
  compression: true,
});

const dbg = open({
  path: "./db/wl_list",
  compression: true,
});

dotenv.config();

const bot = await Mwn.init({
  apiUrl: "https://sol-rng.fandom.com/api.php",
  username: `NoobieAtCode's Bot@VandalFilter`,
  password: process.env.BOT_TOKEN_F,
  defaultParams: {
    assert: "user",
  },
});

const block = async (target: string, length: string, reason: string) => {
  if (typeof target !== "string") {
    return;
  }
  if (typeof length !== "string") {
    return;
  }
  if (typeof reason !== "string") {
    return;
  }

  bot.request({
    action: "block",
    user: target,
    expiry: length,
    reason: reason,
    nocreate: "",
    autoblock: "",
    token: await bot.getCsrfToken(),
  }).catch((err) => {
    const tregex: boolean = /(alreadyblocked)/.test(err);
    if (tregex) {
      console.log(
        `User: (https://sol-rng.fandom.com/wiki/User:${target}) already blocked`,
      );
    }
  });
};

await dbg.put("whitelist", {
  whitelist: [
    "NoobieAtCode",
    "NoobieAtCode's Bot",
    "Silpherant",
    "NiRex2002",
    "MaybeNotMewo",
    "YourLocalNøøb",
    "Idk what life is or what the meaning is",
    "AndromedaIsNice",
    "Teradactyl Lord",
    "Gamemasterj12",
    "CraftyCookie",
    "TheGoodmanThatIsSaul",
    "Reruure",
    "Zzombie Noel",
    "GreylagGoose",
    "00rtz",
    "Kimberton",
    "LucyKuranSKYDOME",
    "I make userpages",
    "SOAP Bot",
    "Moonwatcher x Qibli",
    "FANDOM",
    "Laundry Machine",
    "GotenSakurauchi",
    "Trustharri",
    "Miss_Toki",
  ],
});
const checkuserwl = (username: string | boolean | number) => {
  if (typeof username !== "string") {
    return;
  }
  const data = dbg.get("whitelist");
  // deno-lint-ignore prefer-const
  let rmap: Array<boolean> = data.whitelist.map((user: string) => {
    return username.toLocaleLowerCase() === user.toLocaleLowerCase()
      ? true
      : false;
  });
  let result = false;

  // deno-lint-ignore prefer-const
  for (let detbool in rmap) {
    if (rmap[detbool]) {
      result = true;
      break;
    }
  }
  return result;
};

class Tests {
  test1_1: number;
  test1_2: number;
  test2_1: object;
  test3_1: string;
  test4_1: string;
  prbyteDiff: number;
  constructor(
    test1_1: number,
    test1_2: number,
    test2_1: {
      bc: boolean;
      id?: undefined;
      title?: undefined;
      user?: undefined;
      time?: undefined;
      comment?: undefined;
      err?: undefined;
    },
    test3_1: string,
    test4_1: string,
    prbyteDiff: number,
  ) {
    this.test1_1 = test1_1;
    this.test1_2 = test1_2;
    this.test2_1 = test2_1;
    this.test3_1 = test3_1;
    this.test4_1 = test4_1;
    //this.byteDiffPercent = byteDiffPercent
    this.prbyteDiff = prbyteDiff;
  }
  byteDiffPercent = (bD: number, pbD: number) => {
    if (pbD == 0) {
      return 100;
    }

    const bDP = Math.round((Math.abs(bD) / pbD) * 1000) / 10;
    return bDP;
  };

  get flag1() {
    if (
      this.byteDiffPercent(this.test1_1, this.test1_2) >= 85 &&
      this.prbyteDiff != 0
    ) {
      return true;
    } else return false;
  }

  get flag2() {
    return this.test2_1;
  }

  get flag4() {
    return 0;
  }
}

const getmrc_createlog = async () => {
  try {
    let lrc = await bot.request({
      action: "query",
      list: "logevents",
      letype: "create",
      lenamespace: 0,
      lelimit: 1,
      format: "json",
    });
    if (
      lrc.batchcomplete !== true || lrc === undefined ||
      lrc.query === undefined || lrc.query.logevents === undefined
    ) {
      return {
        bc: false,
      };
    }
    let items = await lrc.query.logevents[0];
    let robj = {
      bc: true,
      id: items.logid as number,
      title: items.title,
      user: items.user,
      time: items.timestamp,
      comment: items.comment,
      err: undefined,
    };
    return robj;
  } catch (err) {
    return {
      bc: false,
      id: undefined,
      title: undefined,
      user: undefined,
      time: undefined,
      comment: undefined,
      err: undefined,
    };
  }
};

//console.log(await getmrc_createlog())

let dupecheck: number | boolean;
let logdupecheck: number | boolean;
let t12ndcheck: number | boolean | string;
let errcheck: number | boolean = false;

const logset: Set<object | string> = new Set();

type bot = () => void;

const nbot: bot = () => {
  setInterval(async () => {
    try {
      // deno-lint-ignore prefer-const
      let newchange = await fetchMostRecentChange();
      let newlogchange = await getmrc_createlog();
      if (newlogchange === undefined) throw "Creation log undefined";

      if (!newlogchange.bc || newlogchange.err !== undefined) {
        throw newlogchange.err;
      }
      if (newchange.err) throw newchange.err;
      if (newchange.item === undefined || newchange.item === null) {
        return;
      }
      // deno-lint-ignore prefer-const
      let nrc = newchange.item;
      if (nrc.revid === dupecheck) {
        //console.log(1)
        return;
      }
      // deno-lint-ignore prefer-const
      let mostrc = await bot.read(nrc.title, {
        rvprop: ["content", "timestamp", "user", "comment", "size", "ids"],
      });
      //console.log(mostrc)
      if (mostrc.revisions === undefined) {
        return;
      }
      if (
        mostrc.revisions.length === undefined ||
        mostrc.revisions.length === 0 || mostrc.revisions[0] === null
      ) {
        return;
      }
      //deno-lint-ignore prefer-const
      let revision: { [key: string]: number | string | boolean } = {};
      Object.entries(mostrc.revisions[0]).forEach(
        ([key, val]: [string, number | string | boolean]) => {
          revision[key] = val;
        },
      );

      revision.link = nrc.link;
      //byteDiff for determining the byte difference of the previous-current revisions
      revision.byteDiff = nrc.byteDiff;
      //rbyteDiff for determining the byte size of the previous revision
      revision.rbyteDiff = nrc.rbyteDiff;
      revision.title = nrc.title;

      //Prelimitary checks (eg. namespace, does page exist, etc)
      if (revision.revid === dupecheck) {
        return;
      }
      if (mostrc.missing) {
        console.log(`Page: "${mostrc.title}" was deleted`);
        return;
      }
      if (revision.title === undefined) {
        return;
      }
      if (/^(Macros\/)/.test(revision.title as string)) {
        return;
      }
      let checkrevuser = checkuserwl(revision?.user);
      if (checkrevuser) {
        //console.log("User Whitelisted")
        return;
      }
      //Previous Page Revision Byte Amount
      let prbyteDiff = revision.rbyteDiff + (revision.size as number);
      //Byte % Difference from Previous to Current

      let testobj = {
        //For Flag 1
        t1_1: revision.byteDiff,
        t1_2: prbyteDiff,
        t2_1: newlogchange,
        //For Flag 3
        t3_1: revision.comment,
        t4_1: revision.content,
      };
      let ct = new Tests(
        testobj.t1_1,
        testobj.t1_2,
        //temp any
        // deno-lint-ignore no-explicit-any
        testobj.t2_1 as any,
        testobj.t3_1 as string,
        testobj.t4_1 as string,
        prbyteDiff,
      );

      if (revision.size as number <= 2000 && revision.byteDiff <= 1750) {
        return;
      }

      //--------------------------------------------------------------------------------
      //Above is setting values
      //Below is actual actions
      let sregexstr = /s+o+n+z+i+l+(i[a-h,j-z]*)?/i;
      let sdect = sregexstr.test(revision.username as string);
      if (sdect) {
        bot.rollback(revision.title as string, revision.username as string);
        block(revision.user as string, "1 day", "Suspected Sonzili Sockpuppet");
        dupecheck = revision.revid as number;
        logdupecheck = newlogchange.id as number;
        return;
      }
      if (revision.title !== newlogchange.title && ct.flag1 && !checkrevuser) {
        bot.rollback(revision.title as string, revision.user as string);
        block(
          revision.username as string,
          "1 day",
          "Suspected vandalism: Mass Blanking/Spam",
        );
        awebhookreport({
          "Blocked User: ": revision.user,
          "Reason:": "Suspected mass content removal",
          "Byte removal %: ": ct.byteDiffPercent(revision.byteDiff, prbyteDiff),
          "Revision: ": revision.id,
        });
        dupecheck = revision.revid as number;
        logdupecheck = newlogchange.id as number;
        return;
      }

      console.log(ct.flag1);
      console.log(revision.title);
      console.log("Revision by: ", revision.user);
      console.log("CurrentPageSize: ", revision.size);
      console.log(
        "Byte Difference from Previous to Current: ",
        revision.byteDiff,
      );
      console.log("rByteDiff (not really important): ", revision.rbyteDiff);
      console.log("Previous Page Byte Amount: ", prbyteDiff);
      console.log("%: ", ct.byteDiffPercent(revision.byteDiff, prbyteDiff));
      console.log("Trips Flag 1 (spam+blanking): ", ct.flag1);
      console.log("Comment: ", revision.comment);
      console.log("noerr");
      console.log("logdupeid: ", logdupecheck);
      console.log("newlogchange.title: ", newlogchange.title);
      //console.log(testobj.t2_1)
      console.log(
        "\n-------------------------------------------------------------------------------------------------\n",
      );
      if (errcheck) errcheck = false;
      dupecheck = revision.revid as number;
      logdupecheck = newlogchange.id as number;
    } catch (err) {
      if (errcheck) {
        return;
      }
      const cerr = err + "\n" +
        (new Date().toLocaleString() + "\n" + (`-`.repeat(40)) + "\n");
      if (logset.has(cerr)) {
        return;
      }
      logset.add(cerr);
      Deno.writeFile(
        "./tlogs.txt",
        Buffer.from(("index.ts:\n" + cerr).toString()),
        {
          append: true,
        },
      );
      errcheck = true;
      return;
    }
  }, 5000);
};

nbot();
export { nbot };
