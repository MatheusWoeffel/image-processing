import { Image } from "./types";

export function mirrorVertically(
  image: Image,
  numberOfChannels: number
): Image {
  const rows: Buffer[] = [];
  for (let i = 0; i < image.height; i++) {
    let row = image.data.slice(
      i * image.width * numberOfChannels,
      i * image.width * numberOfChannels + image.width * numberOfChannels
    );
    rows.push(row);
  }

  return {
    width: image.width,
    height: image.height,
    data: Buffer.concat(rows.reverse()),
  };
}
