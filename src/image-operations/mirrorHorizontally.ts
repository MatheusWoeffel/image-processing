import { Image } from "./types";

export function mirrorHorizontally(image: Image, number_of_channels: number) : Image {
  const rows : Buffer[] = [];
  for(let i = 0; i < image.height; i++){
      let row =  image.data.slice(i * image.width * number_of_channels, (i * image.width * number_of_channels) + (image.width * number_of_channels));
      let rowOfPixels = fromBufferToPixels(row, number_of_channels);
      rows.push(Buffer.concat(rowOfPixels.reverse()));
  }

  return {width: image.width, height: image.height, data: Buffer.concat(rows)};
}

function fromBufferToPixels(row: Buffer, number_of_channels: number): Buffer[]{
  const pixels : Buffer[] = [];
  for(let i = 0; i < (row.length / number_of_channels); i++){
    let pixel = row.slice(i *number_of_channels, i*number_of_channels + number_of_channels);
    pixels.push(pixel);
  }
  return pixels;
}