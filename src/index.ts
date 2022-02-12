import {readFileSync, writeFileSync} from "fs";

async function main(){
  const data = readFileSync("C:/git/image-processing/assets/Space_187k.jpg");
  writeFileSync("./assets/foo.jpg", data);
}

main();