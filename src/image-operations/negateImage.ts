import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

export function negateImage(
    image: Image,
    numberOfChannels: number
  ): Image {
    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);
  
    pixels.forEach((pixel) => {
        pixel.forEach((channel, index) => {
            const isOpacityChannel = index > 2;
            if(isOpacityChannel)
                return;
            pixel.set([255 - channel], index);   
        })
    });
  
    return {
      width: image.width,
      height: image.height,
      data: Buffer.concat(pixels),
    };
  }
  