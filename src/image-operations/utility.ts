export function fromBufferToPixels(row: Buffer, number_of_channels: number): Buffer[]{
  const pixels : Buffer[] = [];
  for(let i = 0; i < (row.length / number_of_channels); i++){
    let pixel = row.slice(i *number_of_channels, i*number_of_channels + number_of_channels);
    pixels.push(pixel);
  }
  return pixels;
}