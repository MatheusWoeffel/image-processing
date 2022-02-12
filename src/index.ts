import {readFileSync, writeFileSync} from "fs";
import {decode, encode} from "jpeg-js";
import { mirrorVertically } from "./image-operations/mirrorVertically";

async function main(){
  const data = readFileSync("C:/git/image-processing/assets/Underwater_53k.jpg");
  const result  = decode(data);

  const newImage = mirrorVertically(result, 4);
  const encodedJpeg = encode(newImage);
  writeFileSync("./assets/foo.jpg", encodedJpeg.data);
}

main();