//** Manual Version of Fandom's Discussion Abuse Filter */

//Threads api: https://sol-rng.fandom.com/wikia.php?controller=DiscussionThread&method=getThreads&limit=1&viewableOnly=true&format=json
//Posts (replies) api: https://sol-rng.fandom.com/wikia.php?controller=DiscussionPost&method=getPosts&limit=1&viewableOnly=true&format=json

import { awebhookreport } from "../modules/misc.ts";
import { localList } from "../exscripts/lang.ts";
import axios from "npm:axios@1.7.7";
import type { r_c } from '../modules/types.ts'

function nothing() {}

const urlbase = "https://sol-rng.fandom.com/f"

const tapi = "https://sol-rng.fandom.com/wikia.php?controller=DiscussionThread&method=getThreads&limit=1&viewableOnly=true&format=json"

const papi = "https://sol-rng.fandom.com/wikia.php?controller=DiscussionPost&method=getPosts&limit=5&viewableOnly=true&format=json"

const getThreadContent = async () => {
    const req = await axios.get(tapi)
    if (req === undefined) throw "req undef"
    if (!req) throw "req false"
    if (req?.status !== 200) throw "req status not 200"
    if (req?.data === undefined) throw "req.data undef"
    if (req?.data?._embedded === undefined) throw "req.data._embedded undef"
    if (req?.data?._embedded?.threads === undefined) throw "req.data._embedded.threads undef"
    if (req?.data?._embedded?.threads[0] === undefined) throw "req.data._embedded.threads[0] undef"
    const mdata = req?.data?._embedded?.threads[0]
    if (mdata?.createdBy === undefined || mdata?.createdBy.id === undefined || mdata?.createdBy.name === undefined) throw "user id/name undef"
    if (mdata?.id === undefined) throw "thread id undef"
    if (mdata?.rawContent === undefined) throw "thread raw content undef"
    if (mdata?.title === undefined) throw "thread title undef"
    let r = {
        userid: mdata.createdBy.id,
        username: mdata.createdBy.name,
        threadid: mdata.id,
        threadcontent: mdata.rawContent,
        threadtitle: mdata.title,
        postlink: `${urlbase}/${mdata.id}`
    }
    return r
}

const getPostContent = async () => {
    const req = await axios.get(papi)
    if (req === undefined) throw "req undef"
    if (!req) throw "req false"
    if (req?.status !== 200) throw "req status not 200"
    if (req?.data === undefined) throw "req.data undef"
    if (req?.data?._embedded === undefined) throw "req.data._embedded undef"
    if (req?.data?._embedded["doc:posts"] === undefined) throw "req.data._embedded.threads undef"
    if (req?.data?._embedded["doc:posts"][0] === undefined || req?.data?._embedded["doc:posts"][1] === undefined || req?.data?._embedded["doc:posts"][2] === undefined || req?.data?._embedded["doc:posts"][3] === undefined || req?.data?._embedded["doc:posts"][4] === undefined) throw "req.data._embedded.threads[0-4] undef"
    const mdata = req?.data?._embedded["doc:posts"]
    let c: any = []
    for (const i of mdata) {
        c.push({
        userid: i.createdBy.id,
        username: i.createdBy.name,
        threadid: i.threadId,
        postid: i.id,
        postcontent: i.rawContent,
        postlink: `${urlbase}/p/${i.threadId}/r/${i.id}`
        })
    }
    return c.reverse()
}

const fil = async (content: string) => {
    if (content === undefined) throw "content undef"
    let f1 =false, f2 = false
    for (let i of localList) {
        if ((content.split("").includes(i))) {f1=true}
    }
    if (/(kms)|(kys)|(kill your self)|(kill my self)|(kill myself)|(kill you're self)/ig.test(content)) {f2 = true}

    return { isProfaneSlur: f1, isDeathThreat: f2 }
}

let gpcinstancesrecorded: any = []
setInterval(async ()=>{
    try {
        let gpc = await getPostContent()
        let gtc = await getThreadContent()

        //gpc handling start
        /** 
         * 5 posts/replies per gpc instance
        */
        if (gpcinstancesrecorded.length === 0) nothing()
        for (let i in gpc) {
            //console.log(i)
            if (gpcinstancesrecorded.includes(gpc[i].postid)) {
                delete gpc[i]
                continue
            }
            if (!gpcinstancesrecorded.includes(gpc[i].postid)) {
                gpcinstancesrecorded.push(gpc[i].postid)
            }
        }
        //gpc content handling
        for (const i in gpc) {
            console.log(gpc[i].postlink, ": ", (await fil(gpc[i].postcontent)).isProfaneSlur)
            if ((await fil(gpc[i].postcontent)).isProfaneSlur || (await fil(gpc[i].postcontent)).isDeathThreat) {
                console.log(gpc[i])
                await awebhookreport({
                    "# Flagged Post(Reply)": "",
                    "### User": gpc[i].username,
                    "### Link": gpc[i].postlink
                });
            }
            //console.log(gpc[i])
        }

        //if (gpcinstancesrecorded.length > 5) gpcinstancesrecorded.shift()
        //gpc handling end

        //gtc handling start
        /**
         * 1 thread per gtc instance
         */
        //gtc handling end
    } catch (err) {
        console.log(err)
    }
}, 1000)

//console.log(await getPostContent())