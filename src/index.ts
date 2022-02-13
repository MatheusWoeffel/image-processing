import {readFileSync, writeFileSync} from "fs";
import {decode, encode} from "jpeg-js";
import { convertToGrayScale } from "./image-operations/convertToGrayscale";
import { quantizeImage } from "./image-operations/quantizeImage";

async function main(){
  const data = readFileSync("C:/git/image-processing/assets/photo_2022-02-13_00-18-35.jpg");
  const result  = decode(data);

  const newImage = quantizeImage(result,2, 4);
  const encodedJpeg = encode(newImage);
  writeFileSync("./assets/foo.jpg", encodedJpeg.data);
}

main();