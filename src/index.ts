import {
  QMainWindow,
  QWidget,
  QPushButton,
  FlexLayout,
  QLabel,
  QPixmap,
  QFileDialog,
  FileMode,
} from "@nodegui/nodegui";
import { readFileSync, writeFileSync } from "fs";
import { decode, encode } from "jpeg-js";
import { Image } from "./image-operations/types";
import { convertToGrayScale } from "./image-operations/convertToGrayscale";

const win = new QMainWindow();
const center = new QWidget();
const getPictureBtn = new QPushButton();
const savePictureBtn = new QPushButton();
const convertToGreyscaleBtn = new QPushButton();

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
    const newImage = convertToGrayScale(imageData, 4);
    const newImageEncoded = encode(newImage);
    displayNewImageWindow(newImageEncoded);
    lastImageTransformed = newImageEncoded;
  }
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
center.layout?.addWidget(convertToGreyscaleBtn);
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
