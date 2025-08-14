import { Mwn } from "npm:mwn";
import process from "node:process";
import { Buffer } from "node:buffer";
import axios from "npm:axios@1.7.7";
import dotenv from 'dotenv'

dotenv.config()

const bot = await Mwn.init({
  apiUrl: "https://sol-rng.fandom.com/api.php",
  username: `NoobieAtCode's Bot@Miscellaneous`,
  password: process.env.BOT_TOKEN_M,
  defaultParams: {
    assert: "user",
  },
});

