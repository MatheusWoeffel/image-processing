import { convertToGrayScale } from "./convertToGrayscale";
import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

export type Histogram = {[id: number] : number}

export function calculateHistogram(image: Image, numberOfChannels: number) : Histogram{
    if(!isGrayscaleImage(image, numberOfChannels))
        image = convertToGrayScale(image, numberOfChannels);

    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);

    const histogram : Histogram = getNewHistogram();

    for(const pixel of pixels){
        let pixelValue = pixel[0];
        histogram[pixelValue] += 1;
    }

    return histogram;
}

export function getNewHistogram() : Histogram{
    const histogram : Histogram = {};
    for(let i = 0; i < 255; i++){
        histogram[i] = 0;
    }

    return histogram;
}

function isGrayscaleImage(image: Image, numberOfChannels: number) : boolean{
    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);

    return pixels[0][0] === pixels[0][1] && pixels[0][1] === pixels[0][2];
}
