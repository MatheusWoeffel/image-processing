import { Image } from "./types";
import { convert2dto1dPosition } from "./utility";

export function rotateLeft(image: Image, numberOfChannels: number) : Image{
    const newImageWidth = image.height;
    const newImageHeight = image.width;

    const newImageBuffer = Buffer.alloc(image.data.byteLength);

    for(let i = 0; i < image.height; i ++){
        for(let j = 0; j < image.width; j ++){
            const startIndexOfPixel = convert2dto1dPosition({x: i, y: j}, image.width, numberOfChannels);
            const endIndexOfPixel = startIndexOfPixel + numberOfChannels;
            const pixel = image.data.slice(startIndexOfPixel, endIndexOfPixel);

            const newIOfImage = newImageHeight - j - 1;
            const newJOfImage = i;
            const newStartIndexOfPixel = convert2dto1dPosition({x: newIOfImage, y: newJOfImage}, newImageWidth, numberOfChannels);
            newImageBuffer.set(pixel, newStartIndexOfPixel);
        }
    }

    return {width: newImageWidth, height: newImageHeight, data: newImageBuffer};
}
