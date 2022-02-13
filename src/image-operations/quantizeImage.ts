import { convertToGrayScale } from "./convertToGrayscale";
import { Image } from "./types";
import { fromBufferToPixels } from "./utility";

type ShadesData =  {
  mostLuminanceShade: number;
  lessLuminanceShade: number;
};

type ShadesBin = {
  start: number;
  end: number;
}

type ShadesSpectrum = ShadesBin[];


export function quantizeImage(image: Image, numberOfShadesDesired: number, numberOfChannels: number) : Image{
  image = convertToGrayScale(image, numberOfChannels);

  const shadesData = getShadesDataFromImage(image);
  const numberOfShadesFromImage = (shadesData.mostLuminanceShade - shadesData.lessLuminanceShade) + 1;
  if(numberOfShadesFromImage <= numberOfShadesDesired)
    return image;
  
  const shadesSpectrum = generateShadesSpectrum(shadesData, numberOfShadesDesired);

  const imageInPixels = fromBufferToPixels(image.data, numberOfChannels);
  imageInPixels.forEach(pixel => {
    const pixelValue = pixel[0];
    const quantizedShade = getQuantizedShade(shadesSpectrum, pixelValue);
    pixel.set([quantizedShade, quantizedShade, quantizedShade]);
  });
  
  return { width: image.width, height: image.height, data: Buffer.concat(imageInPixels)};
}

function getShadesDataFromImage(image: Image) : ShadesData{
  const tempCopyOfImage = Buffer.alloc(image.data.length);
  image.data.copy(tempCopyOfImage);
  const sortedPixels = tempCopyOfImage.sort((a,b) => a - b);

  const lessLuminanceShade = sortedPixels[0];
  const mostLuminanceShade = sortedPixels[sortedPixels.length - 1];
  return {lessLuminanceShade, mostLuminanceShade};
}

function generateShadesSpectrum(shadesData: ShadesData, numberOfShadesDesired: number) : ShadesSpectrum{
  const shadesSpectrum : ShadesBin[] = [];
  
  const numberOfShadesFromImage = (shadesData.mostLuminanceShade - shadesData.lessLuminanceShade) + 1;
  const binGap =  numberOfShadesFromImage / numberOfShadesDesired;
  for(let i = 0; i < numberOfShadesDesired; i++){
    const newShadesBin : ShadesBin = {
      start: shadesData.lessLuminanceShade -0.5 + binGap * i,
      end:  shadesData.lessLuminanceShade -0.5 + binGap * (i + 1)
    };
    shadesSpectrum.push(newShadesBin); 
  }

  return shadesSpectrum;
}

function getQuantizedShade(shadesSpectrum: ShadesBin[], pixelValue: number) : number{
  const isInShadeBin = (pixelValue: number, shadesBin: ShadesBin) => {
    return pixelValue >= shadesBin.start && pixelValue < shadesBin.end;
  };
  
  for (const shadesBin of shadesSpectrum){
    if(isInShadeBin(pixelValue, shadesBin)){
      return calculateShadeBinCenter(shadesBin);
    }
  }

  return calculateShadeBinCenter(shadesSpectrum[shadesSpectrum.length - 1]);
}

function calculateShadeBinCenter(shadesBin: ShadesBin) : number{
  return Math.round((shadesBin.end + shadesBin.start) /2);
}
