import { Image } from "./types";

export function rotateRight(image: Image, numberOfChannels: number) : Image{
    const newImageWidth = image.height;
    const newImageHeight = image.width;

    const newImageBuffer = Buffer.alloc(image.data.byteLength);

    for(let i = 0; i < image.height; i ++){
        for(let j = 0; j < image.width; j ++){
            const startIndexOfPixel = convert2dto1dPosition({x: i, y: j}, image.width, numberOfChannels);
            const endIndexOfPixel = startIndexOfPixel + numberOfChannels;
            const pixel = image.data.slice(startIndexOfPixel, endIndexOfPixel);

            const newIOfImage = j;
            const newJOfImage = newImageWidth - i -1;
            const newStartIndexOfPixel = convert2dto1dPosition({x: newIOfImage, y: newJOfImage}, newImageWidth, numberOfChannels);
            newImageBuffer.set(pixel, newStartIndexOfPixel);
        }
    }

    return {width: newImageWidth, height: newImageHeight, data: newImageBuffer};
}

type Position = {
    x : number;
    y : number;
};

function convert2dto1dPosition(position: Position, width: number, numberOfChannels: number) : number{
    const startIndexOfPixel = position.x * width * numberOfChannels + position.y * numberOfChannels;

    return startIndexOfPixel;
}