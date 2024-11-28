import xml2js from "npm:xml2js";

interface fwRCB {
  item: {
    title: string[];
    link: string[];
    guid: string[];
    description: string[];
    pubDate: string[];
    comments: string[];
  };
}

interface fwRCB2 {
  title: string[];
  link: string[];
  guid: string[];
  description: string[];
  pubDate: string[];
  comments: string[];
}

async function fetchRecentChangesB() {
  try {
    // Fetch data from the URL
    const response: Response = await fetch(
      "https://sol-rng.fandom.com/api.php?action=feedrecentchanges&limit=1",
    );
    const xmlData: string = await response.text(); // Get the response text
    // Parse XML data using xml2js
    const result = await xml2js.parseStringPromise(xmlData);
    // Accessing item elements
    const item = result.rss.channel[0].item[0];
    return { "item": item };
  } catch (error) {
    console.error(error);
    return null; // Return null in case of an error
  }
}

async function fetchMostRecentChange() {
  try {
    const fwRCB: fwRCB | null = await fetchRecentChangesB();
    if (!fwRCB) throw "Undefined fwRCB";
    const fwRCB2: fwRCB2 | null = fwRCB.item;
    // Fetch data from the URL
    const response: Response = await fetch(
      "https://sol-rng.fandom.com/api.php?action=query&list=recentchanges&rcprop=title%7Cids%7Csizes%7Cflags%7Cuser&rclimit=1&rcnamespace=0&format=json",
    );
    //console.log(await response.json())
    const data = await response.json(); // Get the response text
    response.headers.get("content-type")?.includes("application/json")
      ? undefined
      : (() => {
        throw "Data not recieved as json";
      })();
    //console.log(data)
    // Accessing item elements
    const datasum = data.query.recentchanges[0];

    const items = {
      pubDate: fwRCB2.pubDate[0],
      title: datasum.title,
      link: fwRCB2!.link[0],
      user: datasum.user,
      editType: datasum.type,
      byteDiff: datasum.newlen - datasum.oldlen,
      rbyteDiff: datasum.oldlen - datasum.newlen,
      revid: datasum.revid,
      oldrevid: datasum.old_revid,
      datasum: datasum,
    };
    //console.log("fwRCB: ", fwRCB)
    return { "item": items };
  } catch (error) {
    return { err: error }; // Return null in case of an error
  }
}

export { fetchMostRecentChange };
