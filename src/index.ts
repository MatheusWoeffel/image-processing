import {
  QMainWindow,
  QWidget,
  QPushButton,
  FlexLayout,
  QLabel,
  QPixmap,
  QFileDialog,
  FileMode,
  InputDialogOptions,
  QInputDialog,
  InputMode,
} from "@nodegui/nodegui";
import { readFileSync, writeFileSync } from "fs";
import { decode, encode } from "jpeg-js";
import { Image } from "./image-operations/types";
import { convertToGrayScale } from "./image-operations/convertToGrayscale";
import { mirrorHorizontally } from "./image-operations/mirrorHorizontally";
import { mirrorVertically } from "./image-operations/mirrorVertically";
import { quantizeImage } from "./image-operations/quantizeImage";

const NUMBER_OF_CHANNELS = 4;

const win = new QMainWindow();
const center = new QWidget();
const getPictureBtn = new QPushButton();
const savePictureBtn = new QPushButton();
const convertToGreyscaleBtn = new QPushButton();
const flipHorizontallyBtn = new QPushButton();
const flipVerticallyBtn = new QPushButton();
const quantizeBtn = new QPushButton();

let imageData: Image | undefined;
let lastImageTransformed: Image | undefined;

//----------
getPictureBtn.setText("Select a photo");
getPictureBtn.addEventListener("clicked", () => {
  const fileDialog = new QFileDialog();
  fileDialog.setFileMode(FileMode.AnyFile);
  fileDialog.setNameFilter("Images (*.jpg)");
  fileDialog.exec();

  const selectedFiles = fileDialog.selectedFiles();
  const imageSelected = selectedFiles[0];
  const imageBuffer = readFileSync(imageSelected);
  imageData = decode(imageBuffer);

  const originalPictureWin = new QMainWindow();
  const label = new QLabel();
  const image = new QPixmap();
  image.load(imageSelected);
  label.setPixmap(image);
  originalPictureWin.setCentralWidget(label);
  originalPictureWin.show();
});

//--------------
convertToGreyscaleBtn.setText("Convert to greyscale");
convertToGreyscaleBtn.addEventListener("clicked", () => {
  if (imageData) {
    const newImage = convertToGrayScale(imageData, NUMBER_OF_CHANNELS);
    const newImageEncoded = encode(newImage);
    displayNewImageWindow(newImageEncoded);
    lastImageTransformed = newImageEncoded;
  }
});

flipHorizontallyBtn.setText("Flip horizontally");
flipHorizontallyBtn.addEventListener("clicked", () => {
  if (imageData) {
    const newImage = mirrorHorizontally(imageData, NUMBER_OF_CHANNELS);
    const newImageEncoded = encode(newImage);
    displayNewImageWindow(newImageEncoded);
    lastImageTransformed = newImageEncoded;
  }
});

flipVerticallyBtn.setText("Flip Vertically");
flipVerticallyBtn.addEventListener("clicked", () => {
  if (imageData) {
    const newImage = mirrorVertically(imageData, NUMBER_OF_CHANNELS);
    const newImageEncoded = encode(newImage);
    displayNewImageWindow(newImageEncoded);
    lastImageTransformed = newImageEncoded;
  }
});

quantizeBtn.setText("Change number of shades");
quantizeBtn.addEventListener("clicked", () => {
  const inputDialog = new QInputDialog();
  inputDialog.setIntMinimum(1);

  let numberOfShades = 1;
  inputDialog.addEventListener("intValueChanged", (value) => {
    numberOfShades = value;
  });
  inputDialog.setInputMode(InputMode.IntInput);
  inputDialog.exec();

  const newImage = quantizeImage(imageData, numberOfShades, NUMBER_OF_CHANNELS);
  const newImageEncoded = encode(newImage);
  displayNewImageWindow(newImageEncoded);
  lastImageTransformed = newImageEncoded;
});

savePictureBtn.setText("Save last transformed picture");
savePictureBtn.addEventListener("clicked", () => {
  if (lastImageTransformed) {
    const fileDialog = new QFileDialog();
    fileDialog.setFileMode(FileMode.Directory);
    fileDialog.exec();

    const selectedFiles = fileDialog.selectedFiles();
    const path = selectedFiles[0] + "/newPicture.jpeg";
    writeFileSync(path, lastImageTransformed.data);
  }
});

center.setLayout(new FlexLayout());
center.layout?.addWidget(getPictureBtn);
center.layout?.addWidget(flipVerticallyBtn);
center.layout?.addWidget(flipHorizontallyBtn);
center.layout?.addWidget(convertToGreyscaleBtn);
center.layout?.addWidget(quantizeBtn);
center.layout?.addWidget(savePictureBtn);
center.setInlineStyle(`width: 400; height: 400;`);
win.setCentralWidget(center);
win.show();
win.setFixedSize(400, 400);
(global as any).win = win;

function displayNewImageWindow(imageData: Image) {
  const originalPictureWin = new QMainWindow();

  const label = new QLabel();
  const image = new QPixmap();
  image.loadFromData(imageData.data);
  label.setPixmap(image);
  originalPictureWin.setCentralWidget(label);
  originalPictureWin.show();
}
