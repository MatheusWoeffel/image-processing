import {
  QMainWindow,
  QWidget,
  QPushButton,
  FlexLayout,
  QLabel,
  QPixmap,
  QFileDialog,
  FileMode,
  QInputDialog,
  InputMode,
  WidgetEventTypes,
  QPainter,
  QColor,
  CompositionMode,
} from "@nodegui/nodegui";
import { readFileSync, writeFileSync } from "fs";
import { BufferRet, decode, encode } from "jpeg-js";
import { Image } from "./image-operations/types";
import { convertToGrayScale } from "./image-operations/convertToGrayscale";
import { mirrorHorizontally } from "./image-operations/mirrorHorizontally";
import { mirrorVertically } from "./image-operations/mirrorVertically";
import { quantizeImage } from "./image-operations/quantizeImage";
import { adjustBrightness } from "./image-operations/adjustBrightness";
import { adjustContrast } from "./image-operations/adjustContrast";
import { negateImage } from "./image-operations/negateImage";
import { calculateHistogram, Histogram } from "./image-operations/calculateHistogram";

const NUMBER_OF_CHANNELS = 4;

const win = new QMainWindow();
const center = new QWidget();
const getPictureBtn = new QPushButton();
const savePictureBtn = new QPushButton();
const convertToGreyscaleBtn = new QPushButton();
const flipHorizontallyBtn = new QPushButton();
const flipVerticallyBtn = new QPushButton();
const adjustContrastBtn = new QPushButton();
const adjustBrightnessBtn = new QPushButton();
const negateImageBtn = new QPushButton();
const quantizeBtn = new QPushButton();
const showHistogramBtn = new QPushButton();

let imageData: Image | undefined;
let lastImageTransformed: BufferRet | undefined;

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

negateImageBtn.setText("Negate image");
negateImageBtn.addEventListener("clicked", () => {
  if (imageData) {
    const newImage = negateImage(imageData, NUMBER_OF_CHANNELS);
    const newImageEncoded = encode(newImage);
    displayNewImageWindow(newImageEncoded);
    lastImageTransformed = newImageEncoded;
  }
});

showHistogramBtn.setText("Show histogram");
showHistogramBtn.addEventListener("clicked", () => {
  if (imageData) {
    const histogram = calculateHistogram(imageData, NUMBER_OF_CHANNELS);
    displayNewHistogram(histogram);
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

adjustBrightnessBtn.setText("Adjust brightness");
adjustBrightnessBtn.addEventListener("clicked", () => {
  const inputDialog = new QInputDialog();
  inputDialog.setIntMinimum(-255);
  inputDialog.setIntMaximum(255);

  let brightnessIncrease = 0;
  inputDialog.addEventListener("intValueChanged", (value) => {
    brightnessIncrease = value;
  });
  inputDialog.setInputMode(InputMode.IntInput);
  inputDialog.exec();

  const newImage = adjustBrightness(imageData, brightnessIncrease, NUMBER_OF_CHANNELS);
  const newImageEncoded = encode(newImage);
  displayNewImageWindow(newImageEncoded);
  lastImageTransformed = newImageEncoded;
});

adjustContrastBtn.setText("Adjust contrast");
adjustContrastBtn.addEventListener("clicked", () => {
  const inputDialog = new QInputDialog();
  inputDialog.setDoubleMinimum(0)
  inputDialog.setDoubleMaximum(255)

  let brightnessIncrease = 0;
  inputDialog.addEventListener("doubleValueChanged", (value) => {
    brightnessIncrease = value;
  });
  inputDialog.setInputMode(InputMode.DoubleInput);
  inputDialog.exec();

  const newImage = adjustContrast(imageData, brightnessIncrease, NUMBER_OF_CHANNELS);
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

    const filenameInputDialog = new QInputDialog();
    filenameInputDialog.setLabelText("Escolha o nome do arquivo: ");
    filenameInputDialog.setInputMode(InputMode.TextInput);

    let fileName = "";
    filenameInputDialog.addEventListener("textValueChanged", (value) => {
      fileName = value;
    });
    filenameInputDialog.exec();

    fileName = fileName === "" ? "unamedPhoto" : fileName;
    const selectedFiles = fileDialog.selectedFiles();
    const path = `${selectedFiles[0]}/${fileName}.jpg`;
    writeFileSync(path, lastImageTransformed.data);
  }
});

center.setLayout(new FlexLayout());
center.layout?.addWidget(getPictureBtn);
center.layout?.addWidget(flipVerticallyBtn);
center.layout?.addWidget(flipHorizontallyBtn);
center.layout?.addWidget(convertToGreyscaleBtn);
center.layout?.addWidget(quantizeBtn);
center.layout?.addWidget(adjustBrightnessBtn);
center.layout?.addWidget(adjustContrastBtn);
center.layout?.addWidget(negateImageBtn);
center.layout?.addWidget(showHistogramBtn);
center.layout?.addWidget(savePictureBtn);

center.setInlineStyle(`width: 400; height: 400;`);
win.setInlineStyle('background-color: #0f0e17;');
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

function displayNewHistogram(histogram: Histogram){
  const win = new QMainWindow();
  const center = new QWidget();
  const layout = new FlexLayout();
  center.setLayout(layout);
  win.resize(765, 500);
  win.setInlineStyle('background-color: #0f0e17;')

  win.addEventListener(WidgetEventTypes.Paint, () => {
    const painter = new QPainter(win);
    const BAR_WIDTH = 3;
    const BAR_HEIGHT = 450;

    const greatestShade = findGreatestShadeInHistogram(histogram);
    for(let i = 0; i < 255; i ++){
      let histogramValue = histogram[i];

      let normalizedValue = histogramValue / greatestShade;
      painter.fillRect(i * BAR_WIDTH, win.height(), BAR_WIDTH, -normalizedValue * BAR_HEIGHT,new QColor(255,137,6) );
    }
    painter.end();
  });
  win.show();
}

function findGreatestShadeInHistogram(histogram: Histogram){
  let greatestShade = histogram[0];

  for(const shade in histogram){
    let value = histogram[shade];

    if(value > greatestShade){
      greatestShade = value;
    }
  }

  return greatestShade;
}
