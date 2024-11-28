import lmdb from "npm:lmdb";

const getnewchange = (dbname: string) => {
  let db = lmdb.open({
    path: `./db/${dbname}`,
    compression: true,
  });

  let mrk = db.getKeys().asArray.at(-1);
  let m100rk = db.getKeys().asArray.slice(-100);
  //console.log(m100rk)
  if (mrk === undefined) {
    return undefined;
  }
  return db.get(mrk);
};

const update = async (dbname: string, key: string, content: object) => {
  try {
    let db = lmdb.open({
      path: `./db/${dbname}`,
      compression: true,
    });

    let val = db.get(key);
    val[key] = content;

    await db.put(key, val);

    return true;
  } catch (err) {
    return false;
  }
};

update("sd", "n1", {});

console.log(getnewchange("sd"));
let db = lmdb.open({
  path: `./db/sd`,
  compression: true,
});
console.log(
  db.getKeys().forEach((i) => {
    console.log(i);
  }),
);
