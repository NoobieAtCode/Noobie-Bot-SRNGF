import { Mwn } from "npm:mwn";
import dotenv from "dotenv";
import process from "node:process";
import axios from "npm:axios";

dotenv.config();

const bot = await Mwn.init({
  apiUrl: "https://sol-rng.fandom.com/api.php",
  username: `NoobieAtCode's Bot@MWall`,
  password: process.env.BOT_TOKEN_MWALL,
  defaultParams: {
    assert: "user",
  },
});

const BASEURL = "https://sol-rng.fandom.com/wikia.php?"; //?

console.log(await bot.getCsrfToken());
bot.csrfToken = await bot.getCsrfToken();
console.log(bot.csrfToken);

const payload = {
  token: bot.csrfToken,
  wallOwnerId: "48938858",
  title: "Test",
  rawContent: "TestTest",
  jsonModel: JSON.stringify({
    "type": "doc",
    "content": [{
      "type": "paragraph",
      "content": [{ "type": "text", "text": "TestTest" }],
    }],
  }),
  attachments: JSON.stringify({
    "contentImages": [],
    "openGraphs": [],
    "atMentions": [],
  }),
};

const searchParams = new URLSearchParams({
  controller: "MessageWall",
  method: "createThread",
  format: "json",
});

axios.post(BASEURL + searchParams.toString(), {
  body: {
    token: bot.csrfToken,
    wallOwnerId: "48938858",
    title: "Test",
    rawContent: "TestTest",
    jsonModel: JSON.stringify({
      "type": "doc",
      "content": [{
        "type": "paragraph",
        "content": [{ "type": "text", "text": "TestTest" }],
      }],
    }),
    attachments: JSON.stringify({
      "contentImages": [],
      "openGraphs": [],
      "atMentions": [],
    }),
  },
}, {
  headers: {
    "Accept": "application/hal+json",
    "Content-Type": "application/json",
    "User-Agent": "NoobieAtCode/Bot",
  },
})
  .then((response) => console.log(response.data))
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error));
