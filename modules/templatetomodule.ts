import process from "node:process";
import axios from "npm:axios@1.7.7";
import dotenv from 'dotenv'
import type { auraBObj } from "./types.ts";
import { exit } from "node:process";

let sortregex = /\|([^<]+)=<span[^>]*style="([^"]*)">([^<]*)<\/span><!--\s*(.*?)\s*-->/

/*
let input = prompt("Enter the aura code from Template:Auras: ")
//Example: |Common=<span style="color:#ffffff;">{{{2|Common}}}</span><!-- 1/2 -->

console.log(input)
let sorted = input?.match(sortregex)

if (sorted === null || sorted === undefined) {
    exit()
}
*/
let c = (await Deno.readTextFile("./stuffs/out.txt", {})).split("\n")

/*
let aurastylessorted = sorted[2].split(";").map((i)=>i.trim())
*/

let aurastylesli = []

for (let i in c) {
    if (c[i] === null || c[i] === undefined) exit()
    let sorted2 = c[i]?.match(sortregex)
    if (sorted2 === null || sorted2 === undefined) {console.log("i"); continue}
    let aurastylessorted = sorted2[2].split(";").map((i)=>i.trim()).map((i)=>i.split(":"))
    let auraBaseObj: auraBObj = {
        auraname: sorted2[1],
        aurastyles: aurastylessorted,
        auratextopt: sorted2[3]
    }
    aurastylesli.push(auraBaseObj)
}

let uniquestylesli: string[] = []

for (let j of aurastylesli) {
    for (let k of j.aurastyles) {
        let stylename = k[0]
        if (!uniquestylesli.includes(stylename)) {
            uniquestylesli.push(stylename)
        }
        if (uniquestylesli.includes(stylename) || k[0] === "") {
            continue
        }
    }
}

console.log(uniquestylesli)

//console.log(auraBaseObj)

let li = [
    "color", //color
    "font-family", //font
    "background", //gradient or background
    "-webkit-background-clip", //clip
    "-webkit-text-fill-color", //clip
    "{{Outline}}", //o
    "{{Outline|.2}}", //o
    "text-shadow", //ts
    "display", //display
    "width", //width
    "font-weight", //fontw
    "background-image", //bgimg
    "-webkit-text-stroke", //wts
    "font-size", //fontsize
    "{{Outline|.3}}", //o
    "{{Outline|.5}}", //o
    "font-style", //fontstyle
    "letter-spacing", //ls
    "padding", //pad
    "{{Outline|.1}}", //o
    "{{Outline|.0}}", //o
    "Font-Style", //fontstyle
    "{{Outline|0.5=#2b1f05}}", //o
    "{{Outline|.4}}", //o
    "text-decoration-line", //tdl
    "text-decoration-color", //tdc
    "text-decoration-thickness", //tdt
    "paint-order", //paintorder
    "{{Outline|.001}}", //o
    "!important", //imp
    "{{Outline|2}}", //o
    "-webkit-text-stroke-width",
    "{{Outline|.5}}",
    "{{Outline|0}}",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "stroke-linejoin",
    "Background",
    "text-decoration",
    "webkit-text-stroke",
    "-webkit-text-stroke-color",
    "background-clip",
    "text-transform"
]