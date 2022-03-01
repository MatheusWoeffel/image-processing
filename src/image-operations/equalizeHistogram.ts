import { calculateHistogram, getNewHistogram, Histogram } from "./calculateHistogram";
import { convertToGrayScale } from "./convertToGrayscale";
import { Image } from "./types";
import { fromBufferToPixels, isGrayscaleImage } from "./utility";

export function equalizeHistogram(image: Image, numberOfChannels: number) : Image{
    let imageInGrayscale = image;
    if(!isGrayscaleImage(image, numberOfChannels)){
        imageInGrayscale = convertToGrayScale(image, numberOfChannels);
    }

    const histogram = calculateHistogram(imageInGrayscale, numberOfChannels);
    const cumulativeHistogram = calculateCumulativeHistogram(histogram, imageInGrayscale.width * imageInGrayscale.height);

    const newImageBuffer = Buffer.alloc(image.data.byteLength);
    const imageInPixels = fromBufferToPixels(image.data, numberOfChannels);
    imageInPixels.forEach((pixel, index) => {
        const newRValue = cumulativeHistogram[pixel[0]];
        const newGValue = cumulativeHistogram[pixel[1]];
        const newBValue = cumulativeHistogram[pixel[2]];

        newImageBuffer.set([newRValue, newGValue, newBValue], pixel.byteLength * index);
    });

    return {width: image.width, height: image.height, data: newImageBuffer};
}


function calculateCumulativeHistogram(histogram: Histogram, numberOfPixels: number) :  Histogram{
    const cumulativeHistogram = getNewHistogram();
    const alpha = 255 / numberOfPixels;

    cumulativeHistogram[0] = histogram[0] * alpha;

    for(let i = 1; i < 255; i++){
        cumulativeHistogram[i] = cumulativeHistogram[i -1] + (alpha * histogram[i]);
    }

    for(let i = 0; i < 255; i++){
        cumulativeHistogram[i] = Math.trunc(cumulativeHistogram[i]);
    }

    return cumulativeHistogram;
}