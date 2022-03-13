import { Image } from "./types";
import { convert2dto1dPosition } from "./utility";

export function zoomIn2x(image: Image, numberOfChannels: number) : Image{
    const newImageWidth = image.width * 2;
    const newImageHeight = image.height * 2;

    const newImageBuffer = Buffer.alloc(image.data.byteLength * 4);

    for(let i = 0; i < image.height; i ++){
        for(let j = 0; j < image.width; j++){
            const startIndexOfPixel = convert2dto1dPosition({x: i, y: j}, image.width, numberOfChannels);
            const endIndexOfPixel = startIndexOfPixel + numberOfChannels;
            const pixel = image.data.slice(startIndexOfPixel, endIndexOfPixel);

            const newIOfImage = i * 2;
            const newJOfImage = j * 2;
            const newStartIndexOfPixel = convert2dto1dPosition({x: newIOfImage, y: newJOfImage}, newImageWidth, numberOfChannels);
            newImageBuffer.set(pixel, newStartIndexOfPixel);
        }
    }

    for(let i = 1; i < newImageHeight; i+= 2){
        for(let j = 0; j < newImageWidth; j+= 2){
            const startIndexOfPixel = convert2dto1dPosition({x: Math.floor(i/2), y: Math.floor(j/2)}, image.width, numberOfChannels);
            const endIndexOfPixel = startIndexOfPixel + numberOfChannels;
            const firstPixel = image.data.slice(startIndexOfPixel, endIndexOfPixel);
            
            const startIndexOfSecondPixel = convert2dto1dPosition({x: Math.floor(i/2) + 1, y: Math.floor(j/2)}, image.width, numberOfChannels);
            const endIndexOfSecondPixel = startIndexOfSecondPixel + numberOfChannels;
            const secondPixel = image.data.slice(startIndexOfSecondPixel, endIndexOfSecondPixel);

            const newPixel = interpolatePixels(firstPixel, secondPixel);

            const newIOfImage = i;
            const newJOfImage = j;
            const newStartIndexOfPixel = convert2dto1dPosition({x: newIOfImage, y: newJOfImage}, newImageWidth, numberOfChannels);
            newImageBuffer.set(newPixel, newStartIndexOfPixel);
        }
    }

    for(let i = 0; i < newImageHeight; i++ ){
        for(let j = 1; j < newImageWidth; j+= 2){
            const startIndexOfPixel = convert2dto1dPosition({x: i, y: j - 1}, newImageWidth, numberOfChannels);
            const endIndexOfPixel = startIndexOfPixel + numberOfChannels;
            const firstPixel = newImageBuffer.slice(startIndexOfPixel, endIndexOfPixel);
            
            const startIndexOfSecondPixel = convert2dto1dPosition({x: i, y: j + 1}, newImageWidth, numberOfChannels);
            const endIndexOfSecondPixel = startIndexOfSecondPixel + numberOfChannels;
            const secondPixel = newImageBuffer.slice(startIndexOfSecondPixel, endIndexOfSecondPixel);

            const newPixel = interpolatePixels(firstPixel, secondPixel);

            const newIOfImage = i;
            const newJOfImage = j;
            const newStartIndexOfPixel = convert2dto1dPosition({x: newIOfImage, y: newJOfImage}, newImageWidth, numberOfChannels);
            newImageBuffer.set(newPixel, newStartIndexOfPixel);
        }
    }


    return {width: newImageWidth, height: newImageHeight, data: newImageBuffer};
}

function interpolatePixels(pixel1: Buffer, pixel2: Buffer) : Buffer{
    const newPixel = Buffer.alloc(pixel1.byteLength);

    newPixel[0] = Math.floor((pixel1[0] + pixel2[0])/2);
    newPixel[1] = Math.floor((pixel1[1] + pixel2[1])/2);
    newPixel[2] = Math.floor((pixel1[2] + pixel2[2])/2);
    newPixel[3] = 1;

    return newPixel;
}

