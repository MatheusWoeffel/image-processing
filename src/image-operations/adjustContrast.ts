import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

export function adjustContrast(
    image: Image,
    contrastScalar: number,
    numberOfChannels: number
  ): Image {
    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);
  
    pixels.forEach((pixel) => {
        pixel.forEach((channel, index) => {
            const isOpacityChannel = index > 2;
            if(isOpacityChannel)
                return;
            pixel.set([normalizePixelValue(channel * contrastScalar)], index);   
        })
    });
  
    return {
      width: image.width,
      height: image.height,
      data: Buffer.concat(pixels),
    };
  }
  
  function normalizePixelValue(value: number){
    if (value >= 255)
        return 255;
    else if(value <= 0)
        return 0;
    return Math.floor(value);
  }

