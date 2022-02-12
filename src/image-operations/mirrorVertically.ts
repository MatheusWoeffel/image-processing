import { Image } from "./types";

export function mirrorVertically(image: Image, number_of_channels: number): Image{
  const rows : Buffer[] = [];
  for(let i = 0; i < image.height; i++){
      let row =  image.data.slice(i * image.width * number_of_channels, (i * image.width * number_of_channels) + (image.width * number_of_channels));
      rows.push(row);
  }

  return {width: image.width, height: image.height, data: Buffer.concat(rows.reverse())};
}