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

let ptitles = [
    'User:NoobieAtCode/Sandbox/TextColorBases',
    'User:NoobieAtCode/Sandbox/Page1',
    'User:NoobieAtCode/MOS Draft'
]

/*
await bot.edit("User:NoobieAtCode/Sandbox/Test1", ()=>{
    return ""
})
    */

//deno run -A fandom-bot/temp.ts

for (let i in ptitles) {
    let content = await bot.read(ptitles[i], {
        rvprop: ["content", "timestamp", "user", "comment", "size", "ids"],
    })
    console.log(ptitles[i])
    
    if (content.revisions === undefined) {
        console.log("Content is undefined")
        process.exit()
    }
    if (
        content.revisions.length === undefined ||
        content.revisions.length === 0 || content.revisions[0] === null
      ) {
        console.log("Content is undefined")
        process.exit()
    }
    let c = content?.revisions
    await bot.edit(ptitles[i], ()=>{
        return "{{User:NoobieAtCode/UM}}\n\n"+c[0].content
    })
}