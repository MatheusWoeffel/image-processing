import { convertToGrayScale } from "./convertToGrayscale";
import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

type Histogram = {[id: number] : number}

function calculateHistogram(image: Image, numberOfChannels: number) : Histogram{
    if(!isGrayscaleImage(image, numberOfChannels))
        image = convertToGrayScale(image, numberOfChannels);

    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);

    const histogram : Histogram = {};

    for(const pixel of pixels){
        let pixelValue = pixel[0];
        
        const isInHistogram = Boolean(histogram[pixelValue]);
        if(isInHistogram){
            histogram[pixelValue] += 1;
        }
        else{
            histogram[pixelValue] = 1;
        }
    }

    return histogram;

}

function isGrayscaleImage(image: Image, numberOfChannels: number) : boolean{
    const pixels: Buffer[] = fromBufferToPixels(image.data, numberOfChannels);

    return pixels[0][0] === pixels[0][1] && pixels[0][1] === pixels[0][2];
}
