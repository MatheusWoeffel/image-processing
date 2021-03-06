import { Image } from "./types";
import { copyBuffer, fromBufferToPixels } from "./utility";

export function convertToGrayScale(
  image: Image,
  numberOfChannels: number
): Image {
  const pixels: Buffer[] = fromBufferToPixels(copyBuffer(image.data), numberOfChannels);

  pixels.map((pixel) => {
    let luminance = calculateLuminance(pixel);
    luminance = luminance > 255 ? 255 : luminance;
    pixel.set([luminance, luminance, luminance]);
  });

  return {
    width: image.width,
    height: image.height,
    data: Buffer.concat(pixels),
  };
}

function calculateLuminance(pixel: Buffer): number {
  return Math.round(0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]);
}
