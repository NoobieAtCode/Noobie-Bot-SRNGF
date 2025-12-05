import { devi } from "./fandom-bot/devi.ts";
import { status } from "./modules/status.ts";
import cp from 'node:child_process'

//console.log("Run deno task bot")

//console.log(/(kms)|(kys)|(kill your self)|(kill my self)|(kill you're self)/ig.test("kMs"))
const random = (max: number, min: number) =>
    Math.floor(Math.random() * (max - min)) + min;
const tsamp = (l:any) => {
    let i = 0
    let k = []
    while (i < 1000) {
      k.push(l.at(random(0,l.length)))
      i++
    }
    let slist:any = {}
    for (let g of k) {        
        if (!(slist[g])) {
            slist[g] = 1
        } else {
            slist[g] += 1
        }}
    return slist
}

console.log(tsamp(["1", "2", "3", "4"]))
console.log(tsamp(["Red", "Orange", "Yellow", "Green", "Blue", "Purple"]))
console.log(tsamp(["a", "e", "i", "o", "u"]))