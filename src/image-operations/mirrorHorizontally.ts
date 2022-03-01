import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

export function mirrorHorizontally(
  image: Image,
  numberOfChannels: number
): Image {
  const rows: Buffer[] = [];
  for (let i = 0; i < image.height; i++) {
    let row = image.data.slice(
      i * image.width * numberOfChannels,
      i * image.width * numberOfChannels + image.width * numberOfChannels
    );
    let rowOfPixels = fromBufferToPixels(row, numberOfChannels);
    rows.push(Buffer.concat(rowOfPixels.reverse()));
  }

  return {
    width: image.width,
    height: image.height,
    data: Buffer.concat(rows),
  };
}
