import { buffer } from "stream/consumers";
import { Image } from "./types";
import { convert2dto1dPosition, fromBufferToPixels, Position } from "./utility";

export type KernelRow = [number, number, number];
export type Kernel = [KernelRow, KernelRow, KernelRow];

type Rect = Array<Array<Buffer>>;
type Pixel = [number, number, number];

export function convolveImage(
    image: Image,
    kernel: Kernel,
    clamp: boolean,
    numberOfChannels: number
  ): Image {
    const bufferCopy = copyBuffer(image.data);

    const kernelWidth = kernel[0].length;
    const kernelHeight = kernel.length;
    const kernelHalfWidth = Math.floor(kernelWidth / 2);
    const kernelHalfHeight = Math.floor(kernelHeight / 2);

    rotateKernelBy180Degrees(kernel);
  
    for(let i = kernelHalfHeight; i < image.height - kernelHalfHeight; i++){
        for(let j = kernelHalfWidth; j < image.width - kernelHalfWidth; j++){
            let rect = getRectPixels(image, {x: i, y: j}, numberOfChannels);

            let pixelPosition = convert2dto1dPosition({x: i, y: j}, image.width, numberOfChannels);
            let pixel = convolveRect(rect, kernel, clamp);
            bufferCopy.set(pixel, pixelPosition);
        }
    }
  
    return {
      width: image.width,
      height: image.height,
      data: bufferCopy,
    };
  }

  function copyBuffer(buffer: Buffer, ) : Buffer{
      const copiedBuffed = Buffer.allocUnsafe(buffer.byteLength);
      buffer.copy(copiedBuffed);

      return copiedBuffed;
  }

  function getPixelByPosition(image: Image, position: Position, numberOfChannels: number) : Buffer{
    const startIndexOfPixel = convert2dto1dPosition(position, image.width, numberOfChannels);
    const endIndexOfPixel = startIndexOfPixel + numberOfChannels;

    return image.data.slice(startIndexOfPixel, endIndexOfPixel);
  }

  function getRectPixels(image: Image, centerPosition: Position, numberOfChannels: number) : Rect{
      const rect = [];

      for(let i = centerPosition.x - 1; i < centerPosition.x + 2; i++){
          let rectRow = [];
          for(let j = centerPosition.y - 1; j < centerPosition.y + 2; j++){
            const pixel = getPixelByPosition(image, {x: i, y: j}, numberOfChannels);
            rectRow.push(pixel);
          }
          rect.push(rectRow);
      }

      return rect;
  }

  function rotateKernelBy180Degrees(kernel: Kernel){
      kernel.reverse();
      kernel.forEach((kernelRow) => kernelRow.reverse());
  }

  function convolveRect(rect: Rect, kernel: Kernel, clamp: boolean) : Pixel{
      let pixelSum : [number, number, number] = [0, 0 , 0];
      rect.forEach((row, i) => {
          row.forEach((pixel, j) => {
              const rValue = pixel[0] * kernel[i][j];
              const gValue = pixel[1] * kernel[i][j];
              const bValue = pixel[2] * kernel[i][j];

              pixelSum[0] += rValue;
              pixelSum[1] += gValue;
              pixelSum[2] += bValue;
          })
      })

      if(clamp){
          pixelSum[0] += 127;
          pixelSum[1] += 127;
          pixelSum[2] += 127;
      }
      
    return pixelSum.map(value => normalizePixelValue(value)) as Pixel;
  }
  
  function normalizePixelValue(value: number){
    if (value >= 255)
        return 255;
    else if(value <= 0)
        return 0;
    return Math.floor(value);
  }

