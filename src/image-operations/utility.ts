import { Image } from "./types";

export function fromBufferToPixels(
  row: Buffer,
  number_of_channels: number
): Buffer[] {
  const pixels: Buffer[] = [];
  for (let i = 0; i < row.length / number_of_channels; i++) {
    let pixel = row.slice(
      i * number_of_channels,
      i * number_of_channels + number_of_channels
    );
    pixels.push(pixel);
  }
  return pixels;
}

export function copyBuffer(buffer : Buffer) : Buffer{
  const newBuffer = Buffer.alloc(buffer.byteLength);
  buffer.copy(newBuffer);

  return newBuffer;
}

export function isGrayscaleImage(image: Image, numberOfChannels: number) : boolean{
  const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);

  return pixels[0][0] === pixels[0][1] && pixels[0][1] === pixels[0][2];
}