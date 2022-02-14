/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/image-target/image-list.js":
/*!****************************************!*\
  !*** ./src/image-target/image-list.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {resize} = __webpack_require__(/*! ./utils/images.js */ "./src/image-target/utils/images.js");

const MIN_IMAGE_PIXEL_SIZE = 100;

// Build a list of image {data, width, height, scale} with different scales
const buildImageList = (inputImage) => {
  const minScale = MIN_IMAGE_PIXEL_SIZE / Math.min(inputImage.width, inputImage.height);

  const scaleList = [];
  let c = minScale;
  while (true) {
    scaleList.push(c);
    c *= Math.pow(2.0, 1.0/3.0);
    if (c >= 0.95) {
      c = 1;
      break;
    }
  }
  scaleList.push(c);
  scaleList.reverse();

  const imageList = [];
  for (let i = 0; i < scaleList.length; i++) {
    const w = inputImage.width * scaleList[i];
    const h = inputImage.height * scaleList[i];
    imageList.push(Object.assign(resize({image: inputImage, ratio: scaleList[i]}), {scale: scaleList[i]}));
  }
  return imageList;
}

const buildTrackingImageList = (inputImage) => {
  const minDimension = Math.min(inputImage.width, inputImage.height);
  const scaleList = [];
  const imageList = [];
  scaleList.push( 256.0 / minDimension);
  scaleList.push( 128.0 / minDimension);
  for (let i = 0; i < scaleList.length; i++) {
    imageList.push(Object.assign(resize({image: inputImage, ratio: scaleList[i]}), {scale: scaleList[i]}));
  }
  return imageList;
}

module.exports = {
  buildImageList,
  buildTrackingImageList
}


/***/ }),

/***/ "./src/image-target/tracker/extract.js":
/*!*********************************************!*\
  !*** ./src/image-target/tracker/extract.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Cumsum} = __webpack_require__(/*! ../utils/cumsum */ "./src/image-target/utils/cumsum.js");

const SEARCH_SIZE1 = 10;
const SEARCH_SIZE2 = 2;

//const TEMPLATE_SIZE = 22 // DEFAULT
const TEMPLATE_SIZE = 6;
const TEMPLATE_SD_THRESH = 5.0;
const MAX_SIM_THRESH = 0.95;

const MAX_THRESH = 0.9;
//const MIN_THRESH = 0.55;
const MIN_THRESH = 0.2;
const SD_THRESH = 8.0;
const OCCUPANCY_SIZE = 24 * 2 / 3;

/*
 * Input image is in grey format. the imageData array size is width * height. value range from 0-255
 * pixel value at row r and c = imageData[r * width + c]
 *
 * @param {Uint8Array} options.imageData
 * @param {int} options.width image width
 * @param {int} options.height image height
 */
const extract = (image) => {
  const {data: imageData, width, height, scale} = image;

  // Step 1 - filter out interesting points. Interesting points have strong pixel value changed across neighbours
  const isPixelSelected = [width * height];
  for (let i = 0; i < isPixelSelected.length; i++) isPixelSelected[i] = false;

  // Step 1.1 consider a pixel at position (x, y). compute:
  //   dx = ((data[x+1, y-1] - data[x-1, y-1]) + (data[x+1, y] - data[x-1, y]) + (data[x+1, y+1] - data[x-1, y-1])) / 256 / 3
  //   dy = ((data[x+1, y+1] - data[x+1, y-1]) + (data[x, y+1] - data[x, y-1]) + (data[x-1, y+1] - data[x-1, y-1])) / 256 / 3
  //   dValue =  sqrt(dx^2 + dy^2) / 2;
  const dValue = new Float32Array(imageData.length);
  for (let i = 0; i < width; i++) {
    dValue[i] = -1;
    dValue[width * (height-1) + i] = -1;
  }
  for (let j = 0; j < height; j++) {
    dValue[j*width] = -1;
    dValue[j*width + width-1] = -1;
  }

  for (let i = 1; i < width-1; i++) {
    for (let j = 1; j < height-1; j++) {
      let pos = i + width * j;

      let dx = 0.0;
      let dy = 0.0;
      for (let k = -1; k <= 1; k++) {
        dx += (imageData[pos + width*k + 1] - imageData[pos + width*k -1]);
        dy += (imageData[pos + width + k] - imageData[pos - width + k]);
      }
      dx /= (3 * 256);
      dy /= (3 * 256);
      dValue[pos] = Math.sqrt( (dx * dx + dy * dy) / 2);
    }
  }

  // Step 1.2 - select all pixel which is dValue largest than all its neighbour as "potential" candidate
  //  the number of selected points is still too many, so we use the value to further filter (e.g. largest the dValue, the better)
  const dValueHist = new Uint32Array(1000); // histogram of dvalue scaled to [0, 1000)
  for (let i = 0; i < 1000; i++) dValueHist[i] = 0;
  const neighbourOffsets = [-1, 1, -width, width];
  let allCount = 0;
  for (let i = 1; i < width-1; i++) {
    for (let j = 1; j < height-1; j++) {
      let pos = i + width * j;
      let isMax = true;
      for (let d = 0; d < neighbourOffsets.length; d++) {
        if (dValue[pos] <= dValue[pos + neighbourOffsets[d]]) {
          isMax = false;
          break;
        }
      }
      if (isMax) {
        let k = Math.floor(dValue[pos] * 1000);
        if (k > 999) k = 999; // k>999 should not happen if computaiton is correction
        if (k < 0) k = 0; // k<0 should not happen if computaiton is correction
        dValueHist[k] += 1;
        allCount += 1;
        isPixelSelected[pos] = true;
      }
    }
  }

  // reduce number of points according to dValue.
  // actually, the whole Step 1. might be better to just sort the dvalues and pick the top (0.02 * width * height) points
  const maxPoints = 0.02 * width * height;
  let k = 999;
  let filteredCount = 0;
  while (k >= 0) {
    filteredCount += dValueHist[k];
    if (filteredCount > maxPoints) break;
    k--;
  }

  //console.log("image size: ", width * height);
  //console.log("extracted featues: ", allCount);
  //console.log("filtered featues: ", filteredCount);

  for (let i = 0; i < isPixelSelected.length; i++) {
    if (isPixelSelected[i]) {
      if (dValue[i] * 1000 < k) isPixelSelected[i] = false;
    }
  }

  //console.log("selected count: ", isPixelSelected.reduce((a, b) => {return a + (b?1:0);}, 0));

  // Step 2
  // prebuild cumulative sum matrix for fast computation
  const imageDataSqr = [];
  for (let i = 0; i < imageData.length; i++) {
    imageDataSqr[i] = imageData[i] * imageData[i];
  }
  const imageDataCumsum = new Cumsum(imageData, width, height);
  const imageDataSqrCumsum = new Cumsum(imageDataSqr, width, height);

  // holds the max similariliy value computed within SEARCH area of each pixel
  //   idea: if there is high simliarity with another pixel in nearby area, then it's not a good feature point
  //         next step is to find pixel with low similarity
  const featureMap = new Float32Array(imageData.length);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const pos = j * width + i;
      if (!isPixelSelected[pos]) {
        featureMap[pos] = 1.0;
        continue;
      }

      const vlen = _templateVar({image, cx: i, cy: j, sdThresh: TEMPLATE_SD_THRESH, imageDataCumsum, imageDataSqrCumsum});
      if (vlen === null) {
        featureMap[pos] = 1.0;
        continue;
      }

      let max = -1.0;
      for (let jj = -SEARCH_SIZE1; jj <= SEARCH_SIZE1; jj++) {
        for (let ii = -SEARCH_SIZE1; ii <= SEARCH_SIZE1; ii++) {
          if (ii * ii + jj * jj <= SEARCH_SIZE2 * SEARCH_SIZE2) continue;
          const sim = _getSimilarity({image, cx: i+ii, cy: j+jj, vlen: vlen, tx: i, ty: j, imageDataCumsum, imageDataSqrCumsum});

          if (sim === null) continue;

          if (sim > max) {
            max = sim;
            if (max > MAX_SIM_THRESH) break;
          }
        }
        if (max > MAX_SIM_THRESH) break;
      }
      featureMap[pos] = max;
    }
  }

  // Step 2.2 select feature
  const coords = _selectFeature({image, featureMap, templateSize: TEMPLATE_SIZE, searchSize: SEARCH_SIZE2, occSize: OCCUPANCY_SIZE, maxSimThresh: MAX_THRESH, minSimThresh: MIN_THRESH, sdThresh: SD_THRESH, imageDataCumsum, imageDataSqrCumsum});

  return coords;
}

const _selectFeature = (options) => {
  let {image, featureMap, templateSize, searchSize, occSize, maxSimThresh, minSimThresh, sdThresh, imageDataCumsum, imageDataSqrCumsum} = options;
  const {data: imageData, width, height, scale} = image;

  //console.log("params: ", templateSize, templateSize, occSize, maxSimThresh, minSimThresh, sdThresh);

  //occSize *= 2;
  occSize = Math.floor(Math.min(image.width, image.height) / 10);

  const divSize = (templateSize * 2 + 1) * 3;
  const xDiv = Math.floor(width / divSize);
  const yDiv = Math.floor(height / divSize);

  let maxFeatureNum = Math.floor(width / occSize) * Math.floor(height / occSize) + xDiv * yDiv;
  //console.log("max feature num: ", maxFeatureNum);

  const coords = [];
  const image2 = new Float32Array(imageData.length);
  for (let i = 0; i < image2.length; i++) {
    image2[i] = featureMap[i];
  }

  let num = 0;
  while (num < maxFeatureNum) {
    let minSim = maxSimThresh;
    let cx = -1;
    let cy = -1;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        if (image2[j*width+i] < minSim) {
          minSim = image2[j*width+i];
          cx = i;
          cy = j;
        }
      }
    }
    if (cx === -1) break;

    const vlen = _templateVar({image, cx: cx, cy: cy, sdThresh: 0, imageDataCumsum, imageDataSqrCumsum});
    if (vlen === null) {
      image2[ cy * width + cx ] = 1.0;
      continue;
    }
    if (vlen / (templateSize * 2 + 1) < sdThresh) {
      image2[ cy * width + cx ] = 1.0;
      continue;
    }

    let min = 1.0;
    let max = -1.0;

    for (let j = -searchSize; j <= searchSize; j++) {
      for (let i = -searchSize; i <= searchSize; i++) {
        if (i*i + j*j > searchSize * searchSize) continue;
        if (i === 0 && j === 0) continue;

        const sim = _getSimilarity({image, vlen, cx: cx+i, cy: cy+j, tx: cx, ty:cy, imageDataCumsum, imageDataSqrCumsum});
        if (sim === null) continue;

        if (sim < min) {
          min = sim;
          if (min < minSimThresh && min < minSim) break;
        }
        if (sim > max) {
          max = sim;
          if (max > 0.99) break;
        }
      }
      if( (min < minSimThresh && min < minSim) || max > 0.99 ) break;
    }

    if( (min < minSimThresh && min < minSim) || max > 0.99 ) {
        image2[ cy * width + cx ] = 1.0;
        continue;
    }

    coords.push({x: cx, y: cy});
    //coords.push({
      //mx: 1.0 * cx / scale,
      //my: 1.0 * (height - cy) / scale,
    //})

    num += 1;
    //console.log(num, '(', cx, ',', cy, ')', minSim, 'min = ', min, 'max = ', max, 'sd = ', vlen/(templateSize*2+1));

    // no other feature points within occSize square
    for (let j = -occSize; j <= occSize; j++) {
      for (let i = -occSize; i <= occSize; i++) {
        if (cy + j < 0 || cy + j >= height || cx + i < 0 || cx + i >= width) continue;
        image2[ (cy+j)*width + (cx+i) ] = 1.0;
      }
    }
  }
  return coords;
}

// compute variances of the pixels, centered at (cx, cy)
const _templateVar = ({image, cx, cy, sdThresh, imageDataCumsum, imageDataSqrCumsum}) => {
  if (cx - TEMPLATE_SIZE < 0 || cx + TEMPLATE_SIZE >= image.width) return null;
  if (cy - TEMPLATE_SIZE < 0 || cy + TEMPLATE_SIZE >= image.height) return null;

  const templateWidth = 2 * TEMPLATE_SIZE + 1;
  const nPixels = templateWidth * templateWidth;

  let average = imageDataCumsum.query(cx - TEMPLATE_SIZE, cy - TEMPLATE_SIZE, cx + TEMPLATE_SIZE, cy+TEMPLATE_SIZE);
  average /= nPixels;

  //v = sum((pixel_i - avg)^2) for all pixel i within the template
  //  = sum(pixel_i^2) - sum(2 * avg * pixel_i) + sum(avg^avg)

  let vlen = imageDataSqrCumsum.query(cx - TEMPLATE_SIZE, cy - TEMPLATE_SIZE, cx + TEMPLATE_SIZE, cy+TEMPLATE_SIZE);
  vlen -= 2 * average * imageDataCumsum.query(cx - TEMPLATE_SIZE, cy - TEMPLATE_SIZE, cx + TEMPLATE_SIZE, cy+TEMPLATE_SIZE);
  vlen += nPixels * average * average;

  if (vlen / nPixels < sdThresh * sdThresh) return null;
  vlen = Math.sqrt(vlen);
  return vlen;
}

const _getSimilarity = (options) => {
  const {image, cx, cy, vlen, tx, ty, imageDataCumsum, imageDataSqrCumsum} = options;
  const {data: imageData, width, height} = image;
  const templateSize = TEMPLATE_SIZE;

  if (cx - templateSize < 0 || cx + templateSize >= width) return null;
  if (cy - templateSize < 0 || cy + templateSize >= height) return null;

  const templateWidth = 2 * templateSize + 1;

  let sx = imageDataCumsum.query(cx-templateSize, cy-templateSize, cx+templateSize, cy+templateSize);
  let sxx = imageDataSqrCumsum.query(cx-templateSize, cy-templateSize, cx+templateSize, cy+templateSize);
  let sxy = 0;

  // !! This loop is the performance bottleneck. Use moving pointers to optimize
  //
  //   for (let i = cx - templateSize, i2 = tx - templateSize; i <= cx + templateSize; i++, i2++) {
  //     for (let j = cy - templateSize, j2 = ty - templateSize; j <= cy + templateSize; j++, j2++) {
  //       sxy += imageData[j*width + i] * imageData[j2*width + i2];
  //     }
  //   }
  //
  let p1 = (cy-templateSize) * width + (cx-templateSize);
  let p2 = (ty-templateSize) * width + (tx-templateSize);
  let nextRowOffset = width - templateWidth;
  for (let j = 0; j < templateWidth; j++) {
    for (let i = 0; i < templateWidth; i++) {
      sxy += imageData[p1] * imageData[p2];
      p1 +=1;
      p2 +=1;
    }
    p1 += nextRowOffset;
    p2 += nextRowOffset;
  }

  let templateAverage = imageDataCumsum.query(tx-templateSize, ty-templateSize, tx+templateSize, ty+templateSize);
  templateAverage /= templateWidth * templateWidth;
  sxy -= templateAverage * sx;

  let vlen2 = sxx - sx*sx / (templateWidth * templateWidth);
  if (vlen2 == 0) return null;
  vlen2 = Math.sqrt(vlen2);

  // covariance between template and current pixel
  const sim = 1.0 * sxy / (vlen * vlen2);
  return sim;
}

module.exports = {
  extract
};


/***/ }),

/***/ "./src/image-target/utils/cumsum.js":
/*!******************************************!*\
  !*** ./src/image-target/utils/cumsum.js ***!
  \******************************************/
/***/ ((module) => {

// fast 2D submatrix sum using cumulative sum algorithm
class Cumsum {
  constructor(data, width, height) {
    this.cumsum = [];
    for (let j = 0; j < height; j++) {
      this.cumsum.push([]);
      for (let i = 0; i < width; i++) {
        this.cumsum[j].push(0);
      }
    }

    this.cumsum[0][0] = data[0];
    for (let i = 1; i < width; i++) {
      this.cumsum[0][i] = this.cumsum[0][i-1] + data[i];
    }
    for (let j = 1; j < height; j++) {
      this.cumsum[j][0] = this.cumsum[j-1][0] + data[j*width];
    }

    for (let j = 1; j < height; j++) {
      for (let i = 1; i < width; i++) {
        this.cumsum[j][i] = data[j*width+i]
                               + this.cumsum[j-1][i]
                               + this.cumsum[j][i-1]
                               - this.cumsum[j-1][i-1];
      }
    }
  }

  query(x1, y1, x2, y2) {
    let ret = this.cumsum[y2][x2];
    if (y1 > 0) ret -= this.cumsum[y1-1][x2];
    if (x1 > 0) ret -= this.cumsum[y2][x1-1];
    if (x1 > 0 && y1 > 0) ret += this.cumsum[y1-1][x1-1];
    return ret;
  }
}

module.exports = {
  Cumsum
}


/***/ }),

/***/ "./src/image-target/utils/images.js":
/*!******************************************!*\
  !*** ./src/image-target/utils/images.js ***!
  \******************************************/
/***/ ((module) => {

// simpler version of upsampling. better performance
const _upsampleBilinear = ({image, padOneWidth, padOneHeight}) => {
  const {width, height, data} = image;
  const dstWidth = image.width * 2 + (padOneWidth?1:0);
  const dstHeight = image.height * 2 + (padOneHeight?1:0);
  const temp = new Float32Array(dstWidth * dstHeight);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const v = 0.25 * data[j * width + i];
      const ii = Math.floor(i/2);
      const jj = Math.floor(j/2);
      const pos = Math.floor(j/2) * dstWidth + Math.floor(i/2);
      temp[pos] += v;
      temp[pos+1] += v;
      temp[pos+dstWidth] += v;
      temp[pos+dstWidth+1] += v;
    }
  }
  return {data: temp, width: dstWidth, height: dstHeight};
}

// artoolkit version. slower. is it necessary?
const upsampleBilinear = ({image, padOneWidth, padOneHeight}) => {
  const {width, height, data} = image;

  const dstWidth = image.width * 2 + (padOneWidth?1:0);
  const dstHeight = image.height * 2 + (padOneHeight?1:0);

  const temp = new Float32Array(dstWidth * dstHeight);
  for (let i = 0; i < dstWidth; i++) {
    const si = 0.5 * i - 0.25;
    let si0 = Math.floor(si);
    let si1 = Math.ceil(si);
    if (si0 < 0) si0 = 0; // border
    if (si1 >= width) si1 = width - 1; // border

    for (let j = 0; j < dstHeight; j++) {
      const sj = 0.5 * j - 0.25;
      let sj0 = Math.floor(sj);
      let sj1 = Math.ceil(sj);
      if (sj0 < 0) sj0 = 0; // border
      if (sj1 >= height) sj1 = height - 1; //border

      const value = (si1 - si) * (sj1 - sj) * data[ sj0 * width + si0 ] +
                    (si1 - si) * (sj - sj0) * data[ sj1 * width + si0 ] +
                    (si - si0) * (sj1 - sj) * data[ sj0 * width + si1 ] +
                    (si - si0) * (sj - sj0) * data[ sj1 * width + si1 ];

      temp[j * dstWidth + i] = value;
    }
  }

  return {data: temp, width: dstWidth, height: dstHeight};
}

const downsampleBilinear = ({image}) => {
  const {data, width, height} = image;

  const dstWidth = Math.floor(width / 2);
  const dstHeight = Math.floor(height / 2);

  const temp = new Float32Array(dstWidth * dstHeight);
  const offsets = [0, 1, width, width+1];

  for (let j = 0; j < dstHeight; j++) {
    for (let i = 0; i < dstWidth; i++) {
      let srcPos = j*2 * width + i*2;
      let value = 0.0;
      for (let d = 0; d < offsets.length; d++) {
        value += data[srcPos+ offsets[d]];
      }
      value *= 0.25;
      temp[j*dstWidth+i] = value;
    }
  }
  return {data: temp, width: dstWidth, height: dstHeight};
}

const resize = ({image, ratio}) => {
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  //const imageData = new Float32Array(width * height);
  const imageData = new Uint8Array(width * height);
  for (let i = 0; i < width; i++) {
    let si1 = Math.round(1.0 * i / ratio);
    let si2 = Math.round(1.0 * (i+1) / ratio) - 1;
    if (si2 >= image.width) si2 = image.width - 1;

    for (let j = 0; j < height; j++) {
      let sj1 = Math.round(1.0 * j / ratio);
      let sj2 = Math.round(1.0 * (j+1) / ratio) - 1;
      if (sj2 >= image.height) sj2 = image.height - 1;

      let sum = 0;
      let count = 0;
      for (let ii = si1; ii <= si2; ii++) {
        for (let jj = sj1; jj <= sj2; jj++) {
          sum += (1.0 * image.data[jj * image.width + ii]);
          count += 1;
        }
      }
      imageData[j * width + i] = Math.floor(sum / count);
    }
  }
  return {data: imageData, width: width, height: height};
}

module.exports = {
  downsampleBilinear,
  upsampleBilinear,
  resize,
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************************!*\
  !*** ./src/image-target/compiler.worker.js ***!
  \*********************************************/
const {extract} = __webpack_require__(/*! ./tracker/extract.js */ "./src/image-target/tracker/extract.js");
const {buildTrackingImageList} = __webpack_require__(/*! ./image-list.js */ "./src/image-target/image-list.js");

onmessage = (msg) => {
  const {data} = msg;
  if (data.type === 'compile') {
    //console.log("worker compile...");
    const {targetImages} = data;
    const percentPerImage = 50.0 / targetImages.length;
    let percent = 0.0;
    const list = [];
    for (let i = 0; i < targetImages.length; i++) {
      const targetImage = targetImages[i];
      const imageList = buildTrackingImageList(targetImage);
      const percentPerAction = percentPerImage / imageList.length;

      //console.log("compiling tracking...", i);
      const trackingData = _extractTrackingFeatures(imageList, (index) => {
	//console.log("done tracking", i, index);
	percent += percentPerAction
	postMessage({type: 'progress', percent});
      });
      list.push(trackingData);
    }
    postMessage({
      type: 'compileDone',
      list,
    });
  }
};

const _extractTrackingFeatures = (imageList, doneCallback) => {
  const featureSets = [];
  for (let i = 0; i < imageList.length; i++) {
    const image = imageList[i];
    const points = extract(image);

    const featureSet = {
      data: image.data,
      scale: image.scale,
      width: image.width,
      height: image.height,
      points,
    };
    featureSets.push(featureSet);

    doneCallback(i);
  }
  return featureSets;
}


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC9pbWFnZS1saXN0LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L3RyYWNrZXIvZXh0cmFjdC5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC91dGlscy9jdW1zdW0uanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvdXRpbHMvaW1hZ2VzLmpzIiwid2VicGFjazovL21pbmQtYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvY29tcGlsZXIud29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sT0FBTyxHQUFHLG1CQUFPLENBQUMsNkRBQW1COztBQUU1Qzs7QUFFQSwwQkFBMEIsMkJBQTJCO0FBQ3JEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0EseUNBQXlDLHVDQUF1QyxJQUFJLG9CQUFvQjtBQUN4RztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2Qyx5Q0FBeUMsdUNBQXVDLElBQUksb0JBQW9CO0FBQ3hHO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM3Q0EsT0FBTyxPQUFPLEdBQUcsbUJBQU8sQ0FBQywyREFBaUI7O0FBRTFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsV0FBVztBQUN0QixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZjtBQUNBO0FBQ0EsU0FBUyxzQ0FBc0M7O0FBRS9DO0FBQ0E7QUFDQSxpQkFBaUIsNEJBQTRCOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixhQUFhO0FBQzlCLG1CQUFtQixjQUFjO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsaUJBQWlCLFVBQVU7QUFDM0I7QUFDQTtBQUNBLGlCQUFpQixhQUFhO0FBQzlCLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQSxxQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0VBQXNFLG9CQUFvQjs7QUFFMUY7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsV0FBVztBQUM1QixtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyx1RkFBdUY7QUFDeEg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0Msb0JBQW9CO0FBQ3RELG9DQUFvQyxvQkFBb0I7QUFDeEQ7QUFDQSxzQ0FBc0MseUZBQXlGOztBQUUvSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxnTkFBZ047O0FBRWpQO0FBQ0E7O0FBRUE7QUFDQSxPQUFPLGdJQUFnSTtBQUN2SSxTQUFTLHNDQUFzQzs7QUFFL0M7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQixxQkFBcUIsV0FBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCQUErQix3RUFBd0U7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDZCQUE2QixpQkFBaUI7QUFDOUMsK0JBQStCLGlCQUFpQjtBQUNoRDtBQUNBOztBQUVBLG9DQUFvQyxvRkFBb0Y7QUFDeEg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsY0FBYztBQUN4Qyw0QkFBNEIsY0FBYztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1Qiw2REFBNkQ7QUFDcEY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTLGlFQUFpRTtBQUMxRSxTQUFTLCtCQUErQjtBQUN4Qzs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThELHdCQUF3QjtBQUN0RixnRUFBZ0Usd0JBQXdCO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQyxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzdVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0EscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7O0FBRUEsbUJBQW1CLFlBQVk7QUFDL0IscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDeENBO0FBQ0EsNEJBQTRCLGlDQUFpQztBQUM3RCxTQUFTLG9CQUFvQjtBQUM3QjtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLFdBQVc7QUFDNUIsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQSwyQkFBMkIsaUNBQWlDO0FBQzVELFNBQVMsb0JBQW9COztBQUU3QjtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHNDQUFzQzs7QUFFdEMsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCLDBDQUEwQzs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFQSw2QkFBNkIsTUFBTTtBQUNuQyxTQUFTLG9CQUFvQjs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixlQUFlO0FBQ2hDLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQSxxQkFBcUIsb0JBQW9CO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsV0FBVztBQUM1QjtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVztBQUNuQywwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQ2pIQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7O0FDckJBLE9BQU8sUUFBUSxHQUFHLG1CQUFPLENBQUMsbUVBQXNCO0FBQ2hELE9BQU8sdUJBQXVCLEdBQUcsbUJBQU8sQ0FBQyx5REFBaUI7O0FBRTFEO0FBQ0EsU0FBUyxLQUFLO0FBQ2Q7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseUJBQXlCO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMEJBQTBCO0FBQ3hDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbXBpbGVyLndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHtyZXNpemV9ID0gcmVxdWlyZShcIi4vdXRpbHMvaW1hZ2VzLmpzXCIpO1xuXG5jb25zdCBNSU5fSU1BR0VfUElYRUxfU0laRSA9IDEwMDtcblxuLy8gQnVpbGQgYSBsaXN0IG9mIGltYWdlIHtkYXRhLCB3aWR0aCwgaGVpZ2h0LCBzY2FsZX0gd2l0aCBkaWZmZXJlbnQgc2NhbGVzXG5jb25zdCBidWlsZEltYWdlTGlzdCA9IChpbnB1dEltYWdlKSA9PiB7XG4gIGNvbnN0IG1pblNjYWxlID0gTUlOX0lNQUdFX1BJWEVMX1NJWkUgLyBNYXRoLm1pbihpbnB1dEltYWdlLndpZHRoLCBpbnB1dEltYWdlLmhlaWdodCk7XG5cbiAgY29uc3Qgc2NhbGVMaXN0ID0gW107XG4gIGxldCBjID0gbWluU2NhbGU7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc2NhbGVMaXN0LnB1c2goYyk7XG4gICAgYyAqPSBNYXRoLnBvdygyLjAsIDEuMC8zLjApO1xuICAgIGlmIChjID49IDAuOTUpIHtcbiAgICAgIGMgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHNjYWxlTGlzdC5wdXNoKGMpO1xuICBzY2FsZUxpc3QucmV2ZXJzZSgpO1xuXG4gIGNvbnN0IGltYWdlTGlzdCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHcgPSBpbnB1dEltYWdlLndpZHRoICogc2NhbGVMaXN0W2ldO1xuICAgIGNvbnN0IGggPSBpbnB1dEltYWdlLmhlaWdodCAqIHNjYWxlTGlzdFtpXTtcbiAgICBpbWFnZUxpc3QucHVzaChPYmplY3QuYXNzaWduKHJlc2l6ZSh7aW1hZ2U6IGlucHV0SW1hZ2UsIHJhdGlvOiBzY2FsZUxpc3RbaV19KSwge3NjYWxlOiBzY2FsZUxpc3RbaV19KSk7XG4gIH1cbiAgcmV0dXJuIGltYWdlTGlzdDtcbn1cblxuY29uc3QgYnVpbGRUcmFja2luZ0ltYWdlTGlzdCA9IChpbnB1dEltYWdlKSA9PiB7XG4gIGNvbnN0IG1pbkRpbWVuc2lvbiA9IE1hdGgubWluKGlucHV0SW1hZ2Uud2lkdGgsIGlucHV0SW1hZ2UuaGVpZ2h0KTtcbiAgY29uc3Qgc2NhbGVMaXN0ID0gW107XG4gIGNvbnN0IGltYWdlTGlzdCA9IFtdO1xuICBzY2FsZUxpc3QucHVzaCggMjU2LjAgLyBtaW5EaW1lbnNpb24pO1xuICBzY2FsZUxpc3QucHVzaCggMTI4LjAgLyBtaW5EaW1lbnNpb24pO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGltYWdlTGlzdC5wdXNoKE9iamVjdC5hc3NpZ24ocmVzaXplKHtpbWFnZTogaW5wdXRJbWFnZSwgcmF0aW86IHNjYWxlTGlzdFtpXX0pLCB7c2NhbGU6IHNjYWxlTGlzdFtpXX0pKTtcbiAgfVxuICByZXR1cm4gaW1hZ2VMaXN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVpbGRJbWFnZUxpc3QsXG4gIGJ1aWxkVHJhY2tpbmdJbWFnZUxpc3Rcbn1cbiIsImNvbnN0IHtDdW1zdW19ID0gcmVxdWlyZSgnLi4vdXRpbHMvY3Vtc3VtJyk7XG5cbmNvbnN0IFNFQVJDSF9TSVpFMSA9IDEwO1xuY29uc3QgU0VBUkNIX1NJWkUyID0gMjtcblxuLy9jb25zdCBURU1QTEFURV9TSVpFID0gMjIgLy8gREVGQVVMVFxuY29uc3QgVEVNUExBVEVfU0laRSA9IDY7XG5jb25zdCBURU1QTEFURV9TRF9USFJFU0ggPSA1LjA7XG5jb25zdCBNQVhfU0lNX1RIUkVTSCA9IDAuOTU7XG5cbmNvbnN0IE1BWF9USFJFU0ggPSAwLjk7XG4vL2NvbnN0IE1JTl9USFJFU0ggPSAwLjU1O1xuY29uc3QgTUlOX1RIUkVTSCA9IDAuMjtcbmNvbnN0IFNEX1RIUkVTSCA9IDguMDtcbmNvbnN0IE9DQ1VQQU5DWV9TSVpFID0gMjQgKiAyIC8gMztcblxuLypcbiAqIElucHV0IGltYWdlIGlzIGluIGdyZXkgZm9ybWF0LiB0aGUgaW1hZ2VEYXRhIGFycmF5IHNpemUgaXMgd2lkdGggKiBoZWlnaHQuIHZhbHVlIHJhbmdlIGZyb20gMC0yNTVcbiAqIHBpeGVsIHZhbHVlIGF0IHJvdyByIGFuZCBjID0gaW1hZ2VEYXRhW3IgKiB3aWR0aCArIGNdXG4gKlxuICogQHBhcmFtIHtVaW50OEFycmF5fSBvcHRpb25zLmltYWdlRGF0YVxuICogQHBhcmFtIHtpbnR9IG9wdGlvbnMud2lkdGggaW1hZ2Ugd2lkdGhcbiAqIEBwYXJhbSB7aW50fSBvcHRpb25zLmhlaWdodCBpbWFnZSBoZWlnaHRcbiAqL1xuY29uc3QgZXh0cmFjdCA9IChpbWFnZSkgPT4ge1xuICBjb25zdCB7ZGF0YTogaW1hZ2VEYXRhLCB3aWR0aCwgaGVpZ2h0LCBzY2FsZX0gPSBpbWFnZTtcblxuICAvLyBTdGVwIDEgLSBmaWx0ZXIgb3V0IGludGVyZXN0aW5nIHBvaW50cy4gSW50ZXJlc3RpbmcgcG9pbnRzIGhhdmUgc3Ryb25nIHBpeGVsIHZhbHVlIGNoYW5nZWQgYWNyb3NzIG5laWdoYm91cnNcbiAgY29uc3QgaXNQaXhlbFNlbGVjdGVkID0gW3dpZHRoICogaGVpZ2h0XTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpc1BpeGVsU2VsZWN0ZWQubGVuZ3RoOyBpKyspIGlzUGl4ZWxTZWxlY3RlZFtpXSA9IGZhbHNlO1xuXG4gIC8vIFN0ZXAgMS4xIGNvbnNpZGVyIGEgcGl4ZWwgYXQgcG9zaXRpb24gKHgsIHkpLiBjb21wdXRlOlxuICAvLyAgIGR4ID0gKChkYXRhW3grMSwgeS0xXSAtIGRhdGFbeC0xLCB5LTFdKSArIChkYXRhW3grMSwgeV0gLSBkYXRhW3gtMSwgeV0pICsgKGRhdGFbeCsxLCB5KzFdIC0gZGF0YVt4LTEsIHktMV0pKSAvIDI1NiAvIDNcbiAgLy8gICBkeSA9ICgoZGF0YVt4KzEsIHkrMV0gLSBkYXRhW3grMSwgeS0xXSkgKyAoZGF0YVt4LCB5KzFdIC0gZGF0YVt4LCB5LTFdKSArIChkYXRhW3gtMSwgeSsxXSAtIGRhdGFbeC0xLCB5LTFdKSkgLyAyNTYgLyAzXG4gIC8vICAgZFZhbHVlID0gIHNxcnQoZHheMiArIGR5XjIpIC8gMjtcbiAgY29uc3QgZFZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShpbWFnZURhdGEubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgZFZhbHVlW2ldID0gLTE7XG4gICAgZFZhbHVlW3dpZHRoICogKGhlaWdodC0xKSArIGldID0gLTE7XG4gIH1cbiAgZm9yIChsZXQgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgIGRWYWx1ZVtqKndpZHRoXSA9IC0xO1xuICAgIGRWYWx1ZVtqKndpZHRoICsgd2lkdGgtMV0gPSAtMTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgd2lkdGgtMTsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDE7IGogPCBoZWlnaHQtMTsgaisrKSB7XG4gICAgICBsZXQgcG9zID0gaSArIHdpZHRoICogajtcblxuICAgICAgbGV0IGR4ID0gMC4wO1xuICAgICAgbGV0IGR5ID0gMC4wO1xuICAgICAgZm9yIChsZXQgayA9IC0xOyBrIDw9IDE7IGsrKykge1xuICAgICAgICBkeCArPSAoaW1hZ2VEYXRhW3BvcyArIHdpZHRoKmsgKyAxXSAtIGltYWdlRGF0YVtwb3MgKyB3aWR0aCprIC0xXSk7XG4gICAgICAgIGR5ICs9IChpbWFnZURhdGFbcG9zICsgd2lkdGggKyBrXSAtIGltYWdlRGF0YVtwb3MgLSB3aWR0aCArIGtdKTtcbiAgICAgIH1cbiAgICAgIGR4IC89ICgzICogMjU2KTtcbiAgICAgIGR5IC89ICgzICogMjU2KTtcbiAgICAgIGRWYWx1ZVtwb3NdID0gTWF0aC5zcXJ0KCAoZHggKiBkeCArIGR5ICogZHkpIC8gMik7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RlcCAxLjIgLSBzZWxlY3QgYWxsIHBpeGVsIHdoaWNoIGlzIGRWYWx1ZSBsYXJnZXN0IHRoYW4gYWxsIGl0cyBuZWlnaGJvdXIgYXMgXCJwb3RlbnRpYWxcIiBjYW5kaWRhdGVcbiAgLy8gIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgcG9pbnRzIGlzIHN0aWxsIHRvbyBtYW55LCBzbyB3ZSB1c2UgdGhlIHZhbHVlIHRvIGZ1cnRoZXIgZmlsdGVyIChlLmcuIGxhcmdlc3QgdGhlIGRWYWx1ZSwgdGhlIGJldHRlcilcbiAgY29uc3QgZFZhbHVlSGlzdCA9IG5ldyBVaW50MzJBcnJheSgxMDAwKTsgLy8gaGlzdG9ncmFtIG9mIGR2YWx1ZSBzY2FsZWQgdG8gWzAsIDEwMDApXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSBkVmFsdWVIaXN0W2ldID0gMDtcbiAgY29uc3QgbmVpZ2hib3VyT2Zmc2V0cyA9IFstMSwgMSwgLXdpZHRoLCB3aWR0aF07XG4gIGxldCBhbGxDb3VudCA9IDA7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgd2lkdGgtMTsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDE7IGogPCBoZWlnaHQtMTsgaisrKSB7XG4gICAgICBsZXQgcG9zID0gaSArIHdpZHRoICogajtcbiAgICAgIGxldCBpc01heCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBkID0gMDsgZCA8IG5laWdoYm91ck9mZnNldHMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgaWYgKGRWYWx1ZVtwb3NdIDw9IGRWYWx1ZVtwb3MgKyBuZWlnaGJvdXJPZmZzZXRzW2RdXSkge1xuICAgICAgICAgIGlzTWF4ID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc01heCkge1xuICAgICAgICBsZXQgayA9IE1hdGguZmxvb3IoZFZhbHVlW3Bvc10gKiAxMDAwKTtcbiAgICAgICAgaWYgKGsgPiA5OTkpIGsgPSA5OTk7IC8vIGs+OTk5IHNob3VsZCBub3QgaGFwcGVuIGlmIGNvbXB1dGFpdG9uIGlzIGNvcnJlY3Rpb25cbiAgICAgICAgaWYgKGsgPCAwKSBrID0gMDsgLy8gazwwIHNob3VsZCBub3QgaGFwcGVuIGlmIGNvbXB1dGFpdG9uIGlzIGNvcnJlY3Rpb25cbiAgICAgICAgZFZhbHVlSGlzdFtrXSArPSAxO1xuICAgICAgICBhbGxDb3VudCArPSAxO1xuICAgICAgICBpc1BpeGVsU2VsZWN0ZWRbcG9zXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcmVkdWNlIG51bWJlciBvZiBwb2ludHMgYWNjb3JkaW5nIHRvIGRWYWx1ZS5cbiAgLy8gYWN0dWFsbHksIHRoZSB3aG9sZSBTdGVwIDEuIG1pZ2h0IGJlIGJldHRlciB0byBqdXN0IHNvcnQgdGhlIGR2YWx1ZXMgYW5kIHBpY2sgdGhlIHRvcCAoMC4wMiAqIHdpZHRoICogaGVpZ2h0KSBwb2ludHNcbiAgY29uc3QgbWF4UG9pbnRzID0gMC4wMiAqIHdpZHRoICogaGVpZ2h0O1xuICBsZXQgayA9IDk5OTtcbiAgbGV0IGZpbHRlcmVkQ291bnQgPSAwO1xuICB3aGlsZSAoayA+PSAwKSB7XG4gICAgZmlsdGVyZWRDb3VudCArPSBkVmFsdWVIaXN0W2tdO1xuICAgIGlmIChmaWx0ZXJlZENvdW50ID4gbWF4UG9pbnRzKSBicmVhaztcbiAgICBrLS07XG4gIH1cblxuICAvL2NvbnNvbGUubG9nKFwiaW1hZ2Ugc2l6ZTogXCIsIHdpZHRoICogaGVpZ2h0KTtcbiAgLy9jb25zb2xlLmxvZyhcImV4dHJhY3RlZCBmZWF0dWVzOiBcIiwgYWxsQ291bnQpO1xuICAvL2NvbnNvbGUubG9nKFwiZmlsdGVyZWQgZmVhdHVlczogXCIsIGZpbHRlcmVkQ291bnQpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaXNQaXhlbFNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzUGl4ZWxTZWxlY3RlZFtpXSkge1xuICAgICAgaWYgKGRWYWx1ZVtpXSAqIDEwMDAgPCBrKSBpc1BpeGVsU2VsZWN0ZWRbaV0gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvL2NvbnNvbGUubG9nKFwic2VsZWN0ZWQgY291bnQ6IFwiLCBpc1BpeGVsU2VsZWN0ZWQucmVkdWNlKChhLCBiKSA9PiB7cmV0dXJuIGEgKyAoYj8xOjApO30sIDApKTtcblxuICAvLyBTdGVwIDJcbiAgLy8gcHJlYnVpbGQgY3VtdWxhdGl2ZSBzdW0gbWF0cml4IGZvciBmYXN0IGNvbXB1dGF0aW9uXG4gIGNvbnN0IGltYWdlRGF0YVNxciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGltYWdlRGF0YVNxcltpXSA9IGltYWdlRGF0YVtpXSAqIGltYWdlRGF0YVtpXTtcbiAgfVxuICBjb25zdCBpbWFnZURhdGFDdW1zdW0gPSBuZXcgQ3Vtc3VtKGltYWdlRGF0YSwgd2lkdGgsIGhlaWdodCk7XG4gIGNvbnN0IGltYWdlRGF0YVNxckN1bXN1bSA9IG5ldyBDdW1zdW0oaW1hZ2VEYXRhU3FyLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAvLyBob2xkcyB0aGUgbWF4IHNpbWlsYXJpbGl5IHZhbHVlIGNvbXB1dGVkIHdpdGhpbiBTRUFSQ0ggYXJlYSBvZiBlYWNoIHBpeGVsXG4gIC8vICAgaWRlYTogaWYgdGhlcmUgaXMgaGlnaCBzaW1saWFyaXR5IHdpdGggYW5vdGhlciBwaXhlbCBpbiBuZWFyYnkgYXJlYSwgdGhlbiBpdCdzIG5vdCBhIGdvb2QgZmVhdHVyZSBwb2ludFxuICAvLyAgICAgICAgIG5leHQgc3RlcCBpcyB0byBmaW5kIHBpeGVsIHdpdGggbG93IHNpbWlsYXJpdHlcbiAgY29uc3QgZmVhdHVyZU1hcCA9IG5ldyBGbG9hdDMyQXJyYXkoaW1hZ2VEYXRhLmxlbmd0aCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgICAgY29uc3QgcG9zID0gaiAqIHdpZHRoICsgaTtcbiAgICAgIGlmICghaXNQaXhlbFNlbGVjdGVkW3Bvc10pIHtcbiAgICAgICAgZmVhdHVyZU1hcFtwb3NdID0gMS4wO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmxlbiA9IF90ZW1wbGF0ZVZhcih7aW1hZ2UsIGN4OiBpLCBjeTogaiwgc2RUaHJlc2g6IFRFTVBMQVRFX1NEX1RIUkVTSCwgaW1hZ2VEYXRhQ3Vtc3VtLCBpbWFnZURhdGFTcXJDdW1zdW19KTtcbiAgICAgIGlmICh2bGVuID09PSBudWxsKSB7XG4gICAgICAgIGZlYXR1cmVNYXBbcG9zXSA9IDEuMDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXggPSAtMS4wO1xuICAgICAgZm9yIChsZXQgamogPSAtU0VBUkNIX1NJWkUxOyBqaiA8PSBTRUFSQ0hfU0laRTE7IGpqKyspIHtcbiAgICAgICAgZm9yIChsZXQgaWkgPSAtU0VBUkNIX1NJWkUxOyBpaSA8PSBTRUFSQ0hfU0laRTE7IGlpKyspIHtcbiAgICAgICAgICBpZiAoaWkgKiBpaSArIGpqICogamogPD0gU0VBUkNIX1NJWkUyICogU0VBUkNIX1NJWkUyKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBzaW0gPSBfZ2V0U2ltaWxhcml0eSh7aW1hZ2UsIGN4OiBpK2lpLCBjeTogaitqaiwgdmxlbjogdmxlbiwgdHg6IGksIHR5OiBqLCBpbWFnZURhdGFDdW1zdW0sIGltYWdlRGF0YVNxckN1bXN1bX0pO1xuXG4gICAgICAgICAgaWYgKHNpbSA9PT0gbnVsbCkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoc2ltID4gbWF4KSB7XG4gICAgICAgICAgICBtYXggPSBzaW07XG4gICAgICAgICAgICBpZiAobWF4ID4gTUFYX1NJTV9USFJFU0gpIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4ID4gTUFYX1NJTV9USFJFU0gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgZmVhdHVyZU1hcFtwb3NdID0gbWF4O1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0ZXAgMi4yIHNlbGVjdCBmZWF0dXJlXG4gIGNvbnN0IGNvb3JkcyA9IF9zZWxlY3RGZWF0dXJlKHtpbWFnZSwgZmVhdHVyZU1hcCwgdGVtcGxhdGVTaXplOiBURU1QTEFURV9TSVpFLCBzZWFyY2hTaXplOiBTRUFSQ0hfU0laRTIsIG9jY1NpemU6IE9DQ1VQQU5DWV9TSVpFLCBtYXhTaW1UaHJlc2g6IE1BWF9USFJFU0gsIG1pblNpbVRocmVzaDogTUlOX1RIUkVTSCwgc2RUaHJlc2g6IFNEX1RIUkVTSCwgaW1hZ2VEYXRhQ3Vtc3VtLCBpbWFnZURhdGFTcXJDdW1zdW19KTtcblxuICByZXR1cm4gY29vcmRzO1xufVxuXG5jb25zdCBfc2VsZWN0RmVhdHVyZSA9IChvcHRpb25zKSA9PiB7XG4gIGxldCB7aW1hZ2UsIGZlYXR1cmVNYXAsIHRlbXBsYXRlU2l6ZSwgc2VhcmNoU2l6ZSwgb2NjU2l6ZSwgbWF4U2ltVGhyZXNoLCBtaW5TaW1UaHJlc2gsIHNkVGhyZXNoLCBpbWFnZURhdGFDdW1zdW0sIGltYWdlRGF0YVNxckN1bXN1bX0gPSBvcHRpb25zO1xuICBjb25zdCB7ZGF0YTogaW1hZ2VEYXRhLCB3aWR0aCwgaGVpZ2h0LCBzY2FsZX0gPSBpbWFnZTtcblxuICAvL2NvbnNvbGUubG9nKFwicGFyYW1zOiBcIiwgdGVtcGxhdGVTaXplLCB0ZW1wbGF0ZVNpemUsIG9jY1NpemUsIG1heFNpbVRocmVzaCwgbWluU2ltVGhyZXNoLCBzZFRocmVzaCk7XG5cbiAgLy9vY2NTaXplICo9IDI7XG4gIG9jY1NpemUgPSBNYXRoLmZsb29yKE1hdGgubWluKGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpIC8gMTApO1xuXG4gIGNvbnN0IGRpdlNpemUgPSAodGVtcGxhdGVTaXplICogMiArIDEpICogMztcbiAgY29uc3QgeERpdiA9IE1hdGguZmxvb3Iod2lkdGggLyBkaXZTaXplKTtcbiAgY29uc3QgeURpdiA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gZGl2U2l6ZSk7XG5cbiAgbGV0IG1heEZlYXR1cmVOdW0gPSBNYXRoLmZsb29yKHdpZHRoIC8gb2NjU2l6ZSkgKiBNYXRoLmZsb29yKGhlaWdodCAvIG9jY1NpemUpICsgeERpdiAqIHlEaXY7XG4gIC8vY29uc29sZS5sb2coXCJtYXggZmVhdHVyZSBudW06IFwiLCBtYXhGZWF0dXJlTnVtKTtcblxuICBjb25zdCBjb29yZHMgPSBbXTtcbiAgY29uc3QgaW1hZ2UyID0gbmV3IEZsb2F0MzJBcnJheShpbWFnZURhdGEubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZTIubGVuZ3RoOyBpKyspIHtcbiAgICBpbWFnZTJbaV0gPSBmZWF0dXJlTWFwW2ldO1xuICB9XG5cbiAgbGV0IG51bSA9IDA7XG4gIHdoaWxlIChudW0gPCBtYXhGZWF0dXJlTnVtKSB7XG4gICAgbGV0IG1pblNpbSA9IG1heFNpbVRocmVzaDtcbiAgICBsZXQgY3ggPSAtMTtcbiAgICBsZXQgY3kgPSAtMTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGhlaWdodDsgaisrKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcbiAgICAgICAgaWYgKGltYWdlMltqKndpZHRoK2ldIDwgbWluU2ltKSB7XG4gICAgICAgICAgbWluU2ltID0gaW1hZ2UyW2oqd2lkdGgraV07XG4gICAgICAgICAgY3ggPSBpO1xuICAgICAgICAgIGN5ID0gajtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY3ggPT09IC0xKSBicmVhaztcblxuICAgIGNvbnN0IHZsZW4gPSBfdGVtcGxhdGVWYXIoe2ltYWdlLCBjeDogY3gsIGN5OiBjeSwgc2RUaHJlc2g6IDAsIGltYWdlRGF0YUN1bXN1bSwgaW1hZ2VEYXRhU3FyQ3Vtc3VtfSk7XG4gICAgaWYgKHZsZW4gPT09IG51bGwpIHtcbiAgICAgIGltYWdlMlsgY3kgKiB3aWR0aCArIGN4IF0gPSAxLjA7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHZsZW4gLyAodGVtcGxhdGVTaXplICogMiArIDEpIDwgc2RUaHJlc2gpIHtcbiAgICAgIGltYWdlMlsgY3kgKiB3aWR0aCArIGN4IF0gPSAxLjA7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgbWluID0gMS4wO1xuICAgIGxldCBtYXggPSAtMS4wO1xuXG4gICAgZm9yIChsZXQgaiA9IC1zZWFyY2hTaXplOyBqIDw9IHNlYXJjaFNpemU7IGorKykge1xuICAgICAgZm9yIChsZXQgaSA9IC1zZWFyY2hTaXplOyBpIDw9IHNlYXJjaFNpemU7IGkrKykge1xuICAgICAgICBpZiAoaSppICsgaipqID4gc2VhcmNoU2l6ZSAqIHNlYXJjaFNpemUpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoaSA9PT0gMCAmJiBqID09PSAwKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCBzaW0gPSBfZ2V0U2ltaWxhcml0eSh7aW1hZ2UsIHZsZW4sIGN4OiBjeCtpLCBjeTogY3kraiwgdHg6IGN4LCB0eTpjeSwgaW1hZ2VEYXRhQ3Vtc3VtLCBpbWFnZURhdGFTcXJDdW1zdW19KTtcbiAgICAgICAgaWYgKHNpbSA9PT0gbnVsbCkgY29udGludWU7XG5cbiAgICAgICAgaWYgKHNpbSA8IG1pbikge1xuICAgICAgICAgIG1pbiA9IHNpbTtcbiAgICAgICAgICBpZiAobWluIDwgbWluU2ltVGhyZXNoICYmIG1pbiA8IG1pblNpbSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNpbSA+IG1heCkge1xuICAgICAgICAgIG1heCA9IHNpbTtcbiAgICAgICAgICBpZiAobWF4ID4gMC45OSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKCAobWluIDwgbWluU2ltVGhyZXNoICYmIG1pbiA8IG1pblNpbSkgfHwgbWF4ID4gMC45OSApIGJyZWFrO1xuICAgIH1cblxuICAgIGlmKCAobWluIDwgbWluU2ltVGhyZXNoICYmIG1pbiA8IG1pblNpbSkgfHwgbWF4ID4gMC45OSApIHtcbiAgICAgICAgaW1hZ2UyWyBjeSAqIHdpZHRoICsgY3ggXSA9IDEuMDtcbiAgICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29vcmRzLnB1c2goe3g6IGN4LCB5OiBjeX0pO1xuICAgIC8vY29vcmRzLnB1c2goe1xuICAgICAgLy9teDogMS4wICogY3ggLyBzY2FsZSxcbiAgICAgIC8vbXk6IDEuMCAqIChoZWlnaHQgLSBjeSkgLyBzY2FsZSxcbiAgICAvL30pXG5cbiAgICBudW0gKz0gMTtcbiAgICAvL2NvbnNvbGUubG9nKG51bSwgJygnLCBjeCwgJywnLCBjeSwgJyknLCBtaW5TaW0sICdtaW4gPSAnLCBtaW4sICdtYXggPSAnLCBtYXgsICdzZCA9ICcsIHZsZW4vKHRlbXBsYXRlU2l6ZSoyKzEpKTtcblxuICAgIC8vIG5vIG90aGVyIGZlYXR1cmUgcG9pbnRzIHdpdGhpbiBvY2NTaXplIHNxdWFyZVxuICAgIGZvciAobGV0IGogPSAtb2NjU2l6ZTsgaiA8PSBvY2NTaXplOyBqKyspIHtcbiAgICAgIGZvciAobGV0IGkgPSAtb2NjU2l6ZTsgaSA8PSBvY2NTaXplOyBpKyspIHtcbiAgICAgICAgaWYgKGN5ICsgaiA8IDAgfHwgY3kgKyBqID49IGhlaWdodCB8fCBjeCArIGkgPCAwIHx8IGN4ICsgaSA+PSB3aWR0aCkgY29udGludWU7XG4gICAgICAgIGltYWdlMlsgKGN5K2opKndpZHRoICsgKGN4K2kpIF0gPSAxLjA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb29yZHM7XG59XG5cbi8vIGNvbXB1dGUgdmFyaWFuY2VzIG9mIHRoZSBwaXhlbHMsIGNlbnRlcmVkIGF0IChjeCwgY3kpXG5jb25zdCBfdGVtcGxhdGVWYXIgPSAoe2ltYWdlLCBjeCwgY3ksIHNkVGhyZXNoLCBpbWFnZURhdGFDdW1zdW0sIGltYWdlRGF0YVNxckN1bXN1bX0pID0+IHtcbiAgaWYgKGN4IC0gVEVNUExBVEVfU0laRSA8IDAgfHwgY3ggKyBURU1QTEFURV9TSVpFID49IGltYWdlLndpZHRoKSByZXR1cm4gbnVsbDtcbiAgaWYgKGN5IC0gVEVNUExBVEVfU0laRSA8IDAgfHwgY3kgKyBURU1QTEFURV9TSVpFID49IGltYWdlLmhlaWdodCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdGVtcGxhdGVXaWR0aCA9IDIgKiBURU1QTEFURV9TSVpFICsgMTtcbiAgY29uc3QgblBpeGVscyA9IHRlbXBsYXRlV2lkdGggKiB0ZW1wbGF0ZVdpZHRoO1xuXG4gIGxldCBhdmVyYWdlID0gaW1hZ2VEYXRhQ3Vtc3VtLnF1ZXJ5KGN4IC0gVEVNUExBVEVfU0laRSwgY3kgLSBURU1QTEFURV9TSVpFLCBjeCArIFRFTVBMQVRFX1NJWkUsIGN5K1RFTVBMQVRFX1NJWkUpO1xuICBhdmVyYWdlIC89IG5QaXhlbHM7XG5cbiAgLy92ID0gc3VtKChwaXhlbF9pIC0gYXZnKV4yKSBmb3IgYWxsIHBpeGVsIGkgd2l0aGluIHRoZSB0ZW1wbGF0ZVxuICAvLyAgPSBzdW0ocGl4ZWxfaV4yKSAtIHN1bSgyICogYXZnICogcGl4ZWxfaSkgKyBzdW0oYXZnXmF2ZylcblxuICBsZXQgdmxlbiA9IGltYWdlRGF0YVNxckN1bXN1bS5xdWVyeShjeCAtIFRFTVBMQVRFX1NJWkUsIGN5IC0gVEVNUExBVEVfU0laRSwgY3ggKyBURU1QTEFURV9TSVpFLCBjeStURU1QTEFURV9TSVpFKTtcbiAgdmxlbiAtPSAyICogYXZlcmFnZSAqIGltYWdlRGF0YUN1bXN1bS5xdWVyeShjeCAtIFRFTVBMQVRFX1NJWkUsIGN5IC0gVEVNUExBVEVfU0laRSwgY3ggKyBURU1QTEFURV9TSVpFLCBjeStURU1QTEFURV9TSVpFKTtcbiAgdmxlbiArPSBuUGl4ZWxzICogYXZlcmFnZSAqIGF2ZXJhZ2U7XG5cbiAgaWYgKHZsZW4gLyBuUGl4ZWxzIDwgc2RUaHJlc2ggKiBzZFRocmVzaCkgcmV0dXJuIG51bGw7XG4gIHZsZW4gPSBNYXRoLnNxcnQodmxlbik7XG4gIHJldHVybiB2bGVuO1xufVxuXG5jb25zdCBfZ2V0U2ltaWxhcml0eSA9IChvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHtpbWFnZSwgY3gsIGN5LCB2bGVuLCB0eCwgdHksIGltYWdlRGF0YUN1bXN1bSwgaW1hZ2VEYXRhU3FyQ3Vtc3VtfSA9IG9wdGlvbnM7XG4gIGNvbnN0IHtkYXRhOiBpbWFnZURhdGEsIHdpZHRoLCBoZWlnaHR9ID0gaW1hZ2U7XG4gIGNvbnN0IHRlbXBsYXRlU2l6ZSA9IFRFTVBMQVRFX1NJWkU7XG5cbiAgaWYgKGN4IC0gdGVtcGxhdGVTaXplIDwgMCB8fCBjeCArIHRlbXBsYXRlU2l6ZSA+PSB3aWR0aCkgcmV0dXJuIG51bGw7XG4gIGlmIChjeSAtIHRlbXBsYXRlU2l6ZSA8IDAgfHwgY3kgKyB0ZW1wbGF0ZVNpemUgPj0gaGVpZ2h0KSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB0ZW1wbGF0ZVdpZHRoID0gMiAqIHRlbXBsYXRlU2l6ZSArIDE7XG5cbiAgbGV0IHN4ID0gaW1hZ2VEYXRhQ3Vtc3VtLnF1ZXJ5KGN4LXRlbXBsYXRlU2l6ZSwgY3ktdGVtcGxhdGVTaXplLCBjeCt0ZW1wbGF0ZVNpemUsIGN5K3RlbXBsYXRlU2l6ZSk7XG4gIGxldCBzeHggPSBpbWFnZURhdGFTcXJDdW1zdW0ucXVlcnkoY3gtdGVtcGxhdGVTaXplLCBjeS10ZW1wbGF0ZVNpemUsIGN4K3RlbXBsYXRlU2l6ZSwgY3krdGVtcGxhdGVTaXplKTtcbiAgbGV0IHN4eSA9IDA7XG5cbiAgLy8gISEgVGhpcyBsb29wIGlzIHRoZSBwZXJmb3JtYW5jZSBib3R0bGVuZWNrLiBVc2UgbW92aW5nIHBvaW50ZXJzIHRvIG9wdGltaXplXG4gIC8vXG4gIC8vICAgZm9yIChsZXQgaSA9IGN4IC0gdGVtcGxhdGVTaXplLCBpMiA9IHR4IC0gdGVtcGxhdGVTaXplOyBpIDw9IGN4ICsgdGVtcGxhdGVTaXplOyBpKyssIGkyKyspIHtcbiAgLy8gICAgIGZvciAobGV0IGogPSBjeSAtIHRlbXBsYXRlU2l6ZSwgajIgPSB0eSAtIHRlbXBsYXRlU2l6ZTsgaiA8PSBjeSArIHRlbXBsYXRlU2l6ZTsgaisrLCBqMisrKSB7XG4gIC8vICAgICAgIHN4eSArPSBpbWFnZURhdGFbaip3aWR0aCArIGldICogaW1hZ2VEYXRhW2oyKndpZHRoICsgaTJdO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy9cbiAgbGV0IHAxID0gKGN5LXRlbXBsYXRlU2l6ZSkgKiB3aWR0aCArIChjeC10ZW1wbGF0ZVNpemUpO1xuICBsZXQgcDIgPSAodHktdGVtcGxhdGVTaXplKSAqIHdpZHRoICsgKHR4LXRlbXBsYXRlU2l6ZSk7XG4gIGxldCBuZXh0Um93T2Zmc2V0ID0gd2lkdGggLSB0ZW1wbGF0ZVdpZHRoO1xuICBmb3IgKGxldCBqID0gMDsgaiA8IHRlbXBsYXRlV2lkdGg7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGVtcGxhdGVXaWR0aDsgaSsrKSB7XG4gICAgICBzeHkgKz0gaW1hZ2VEYXRhW3AxXSAqIGltYWdlRGF0YVtwMl07XG4gICAgICBwMSArPTE7XG4gICAgICBwMiArPTE7XG4gICAgfVxuICAgIHAxICs9IG5leHRSb3dPZmZzZXQ7XG4gICAgcDIgKz0gbmV4dFJvd09mZnNldDtcbiAgfVxuXG4gIGxldCB0ZW1wbGF0ZUF2ZXJhZ2UgPSBpbWFnZURhdGFDdW1zdW0ucXVlcnkodHgtdGVtcGxhdGVTaXplLCB0eS10ZW1wbGF0ZVNpemUsIHR4K3RlbXBsYXRlU2l6ZSwgdHkrdGVtcGxhdGVTaXplKTtcbiAgdGVtcGxhdGVBdmVyYWdlIC89IHRlbXBsYXRlV2lkdGggKiB0ZW1wbGF0ZVdpZHRoO1xuICBzeHkgLT0gdGVtcGxhdGVBdmVyYWdlICogc3g7XG5cbiAgbGV0IHZsZW4yID0gc3h4IC0gc3gqc3ggLyAodGVtcGxhdGVXaWR0aCAqIHRlbXBsYXRlV2lkdGgpO1xuICBpZiAodmxlbjIgPT0gMCkgcmV0dXJuIG51bGw7XG4gIHZsZW4yID0gTWF0aC5zcXJ0KHZsZW4yKTtcblxuICAvLyBjb3ZhcmlhbmNlIGJldHdlZW4gdGVtcGxhdGUgYW5kIGN1cnJlbnQgcGl4ZWxcbiAgY29uc3Qgc2ltID0gMS4wICogc3h5IC8gKHZsZW4gKiB2bGVuMik7XG4gIHJldHVybiBzaW07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBleHRyYWN0XG59O1xuIiwiLy8gZmFzdCAyRCBzdWJtYXRyaXggc3VtIHVzaW5nIGN1bXVsYXRpdmUgc3VtIGFsZ29yaXRobVxuY2xhc3MgQ3Vtc3VtIHtcbiAgY29uc3RydWN0b3IoZGF0YSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuY3Vtc3VtID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgICAgdGhpcy5jdW1zdW0ucHVzaChbXSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcbiAgICAgICAgdGhpcy5jdW1zdW1bal0ucHVzaCgwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmN1bXN1bVswXVswXSA9IGRhdGFbMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgICB0aGlzLmN1bXN1bVswXVtpXSA9IHRoaXMuY3Vtc3VtWzBdW2ktMV0gKyBkYXRhW2ldO1xuICAgIH1cbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IGhlaWdodDsgaisrKSB7XG4gICAgICB0aGlzLmN1bXN1bVtqXVswXSA9IHRoaXMuY3Vtc3VtW2otMV1bMF0gKyBkYXRhW2oqd2lkdGhdO1xuICAgIH1cblxuICAgIGZvciAobGV0IGogPSAxOyBqIDwgaGVpZ2h0OyBqKyspIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgICB0aGlzLmN1bXN1bVtqXVtpXSA9IGRhdGFbaip3aWR0aCtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5jdW1zdW1bai0xXVtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5jdW1zdW1bal1baS0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhpcy5jdW1zdW1bai0xXVtpLTFdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgbGV0IHJldCA9IHRoaXMuY3Vtc3VtW3kyXVt4Ml07XG4gICAgaWYgKHkxID4gMCkgcmV0IC09IHRoaXMuY3Vtc3VtW3kxLTFdW3gyXTtcbiAgICBpZiAoeDEgPiAwKSByZXQgLT0gdGhpcy5jdW1zdW1beTJdW3gxLTFdO1xuICAgIGlmICh4MSA+IDAgJiYgeTEgPiAwKSByZXQgKz0gdGhpcy5jdW1zdW1beTEtMV1beDEtMV07XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ3Vtc3VtXG59XG4iLCIvLyBzaW1wbGVyIHZlcnNpb24gb2YgdXBzYW1wbGluZy4gYmV0dGVyIHBlcmZvcm1hbmNlXG5jb25zdCBfdXBzYW1wbGVCaWxpbmVhciA9ICh7aW1hZ2UsIHBhZE9uZVdpZHRoLCBwYWRPbmVIZWlnaHR9KSA9PiB7XG4gIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBkYXRhfSA9IGltYWdlO1xuICBjb25zdCBkc3RXaWR0aCA9IGltYWdlLndpZHRoICogMiArIChwYWRPbmVXaWR0aD8xOjApO1xuICBjb25zdCBkc3RIZWlnaHQgPSBpbWFnZS5oZWlnaHQgKiAyICsgKHBhZE9uZUhlaWdodD8xOjApO1xuICBjb25zdCB0ZW1wID0gbmV3IEZsb2F0MzJBcnJheShkc3RXaWR0aCAqIGRzdEhlaWdodCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgICAgY29uc3QgdiA9IDAuMjUgKiBkYXRhW2ogKiB3aWR0aCArIGldO1xuICAgICAgY29uc3QgaWkgPSBNYXRoLmZsb29yKGkvMik7XG4gICAgICBjb25zdCBqaiA9IE1hdGguZmxvb3Ioai8yKTtcbiAgICAgIGNvbnN0IHBvcyA9IE1hdGguZmxvb3Ioai8yKSAqIGRzdFdpZHRoICsgTWF0aC5mbG9vcihpLzIpO1xuICAgICAgdGVtcFtwb3NdICs9IHY7XG4gICAgICB0ZW1wW3BvcysxXSArPSB2O1xuICAgICAgdGVtcFtwb3MrZHN0V2lkdGhdICs9IHY7XG4gICAgICB0ZW1wW3Bvcytkc3RXaWR0aCsxXSArPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2RhdGE6IHRlbXAsIHdpZHRoOiBkc3RXaWR0aCwgaGVpZ2h0OiBkc3RIZWlnaHR9O1xufVxuXG4vLyBhcnRvb2xraXQgdmVyc2lvbi4gc2xvd2VyLiBpcyBpdCBuZWNlc3Nhcnk/XG5jb25zdCB1cHNhbXBsZUJpbGluZWFyID0gKHtpbWFnZSwgcGFkT25lV2lkdGgsIHBhZE9uZUhlaWdodH0pID0+IHtcbiAgY29uc3Qge3dpZHRoLCBoZWlnaHQsIGRhdGF9ID0gaW1hZ2U7XG5cbiAgY29uc3QgZHN0V2lkdGggPSBpbWFnZS53aWR0aCAqIDIgKyAocGFkT25lV2lkdGg/MTowKTtcbiAgY29uc3QgZHN0SGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0ICogMiArIChwYWRPbmVIZWlnaHQ/MTowKTtcblxuICBjb25zdCB0ZW1wID0gbmV3IEZsb2F0MzJBcnJheShkc3RXaWR0aCAqIGRzdEhlaWdodCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZHN0V2lkdGg7IGkrKykge1xuICAgIGNvbnN0IHNpID0gMC41ICogaSAtIDAuMjU7XG4gICAgbGV0IHNpMCA9IE1hdGguZmxvb3Ioc2kpO1xuICAgIGxldCBzaTEgPSBNYXRoLmNlaWwoc2kpO1xuICAgIGlmIChzaTAgPCAwKSBzaTAgPSAwOyAvLyBib3JkZXJcbiAgICBpZiAoc2kxID49IHdpZHRoKSBzaTEgPSB3aWR0aCAtIDE7IC8vIGJvcmRlclxuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkc3RIZWlnaHQ7IGorKykge1xuICAgICAgY29uc3Qgc2ogPSAwLjUgKiBqIC0gMC4yNTtcbiAgICAgIGxldCBzajAgPSBNYXRoLmZsb29yKHNqKTtcbiAgICAgIGxldCBzajEgPSBNYXRoLmNlaWwoc2opO1xuICAgICAgaWYgKHNqMCA8IDApIHNqMCA9IDA7IC8vIGJvcmRlclxuICAgICAgaWYgKHNqMSA+PSBoZWlnaHQpIHNqMSA9IGhlaWdodCAtIDE7IC8vYm9yZGVyXG5cbiAgICAgIGNvbnN0IHZhbHVlID0gKHNpMSAtIHNpKSAqIChzajEgLSBzaikgKiBkYXRhWyBzajAgKiB3aWR0aCArIHNpMCBdICtcbiAgICAgICAgICAgICAgICAgICAgKHNpMSAtIHNpKSAqIChzaiAtIHNqMCkgKiBkYXRhWyBzajEgKiB3aWR0aCArIHNpMCBdICtcbiAgICAgICAgICAgICAgICAgICAgKHNpIC0gc2kwKSAqIChzajEgLSBzaikgKiBkYXRhWyBzajAgKiB3aWR0aCArIHNpMSBdICtcbiAgICAgICAgICAgICAgICAgICAgKHNpIC0gc2kwKSAqIChzaiAtIHNqMCkgKiBkYXRhWyBzajEgKiB3aWR0aCArIHNpMSBdO1xuXG4gICAgICB0ZW1wW2ogKiBkc3RXaWR0aCArIGldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtkYXRhOiB0ZW1wLCB3aWR0aDogZHN0V2lkdGgsIGhlaWdodDogZHN0SGVpZ2h0fTtcbn1cblxuY29uc3QgZG93bnNhbXBsZUJpbGluZWFyID0gKHtpbWFnZX0pID0+IHtcbiAgY29uc3Qge2RhdGEsIHdpZHRoLCBoZWlnaHR9ID0gaW1hZ2U7XG5cbiAgY29uc3QgZHN0V2lkdGggPSBNYXRoLmZsb29yKHdpZHRoIC8gMik7XG4gIGNvbnN0IGRzdEhlaWdodCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gMik7XG5cbiAgY29uc3QgdGVtcCA9IG5ldyBGbG9hdDMyQXJyYXkoZHN0V2lkdGggKiBkc3RIZWlnaHQpO1xuICBjb25zdCBvZmZzZXRzID0gWzAsIDEsIHdpZHRoLCB3aWR0aCsxXTtcblxuICBmb3IgKGxldCBqID0gMDsgaiA8IGRzdEhlaWdodDsgaisrKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkc3RXaWR0aDsgaSsrKSB7XG4gICAgICBsZXQgc3JjUG9zID0gaioyICogd2lkdGggKyBpKjI7XG4gICAgICBsZXQgdmFsdWUgPSAwLjA7XG4gICAgICBmb3IgKGxldCBkID0gMDsgZCA8IG9mZnNldHMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgdmFsdWUgKz0gZGF0YVtzcmNQb3MrIG9mZnNldHNbZF1dO1xuICAgICAgfVxuICAgICAgdmFsdWUgKj0gMC4yNTtcbiAgICAgIHRlbXBbaipkc3RXaWR0aCtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2RhdGE6IHRlbXAsIHdpZHRoOiBkc3RXaWR0aCwgaGVpZ2h0OiBkc3RIZWlnaHR9O1xufVxuXG5jb25zdCByZXNpemUgPSAoe2ltYWdlLCByYXRpb30pID0+IHtcbiAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKGltYWdlLndpZHRoICogcmF0aW8pO1xuICBjb25zdCBoZWlnaHQgPSBNYXRoLnJvdW5kKGltYWdlLmhlaWdodCAqIHJhdGlvKTtcblxuICAvL2NvbnN0IGltYWdlRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkod2lkdGggKiBoZWlnaHQpO1xuICBjb25zdCBpbWFnZURhdGEgPSBuZXcgVWludDhBcnJheSh3aWR0aCAqIGhlaWdodCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgIGxldCBzaTEgPSBNYXRoLnJvdW5kKDEuMCAqIGkgLyByYXRpbyk7XG4gICAgbGV0IHNpMiA9IE1hdGgucm91bmQoMS4wICogKGkrMSkgLyByYXRpbykgLSAxO1xuICAgIGlmIChzaTIgPj0gaW1hZ2Uud2lkdGgpIHNpMiA9IGltYWdlLndpZHRoIC0gMTtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgaGVpZ2h0OyBqKyspIHtcbiAgICAgIGxldCBzajEgPSBNYXRoLnJvdW5kKDEuMCAqIGogLyByYXRpbyk7XG4gICAgICBsZXQgc2oyID0gTWF0aC5yb3VuZCgxLjAgKiAoaisxKSAvIHJhdGlvKSAtIDE7XG4gICAgICBpZiAoc2oyID49IGltYWdlLmhlaWdodCkgc2oyID0gaW1hZ2UuaGVpZ2h0IC0gMTtcblxuICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgZm9yIChsZXQgaWkgPSBzaTE7IGlpIDw9IHNpMjsgaWkrKykge1xuICAgICAgICBmb3IgKGxldCBqaiA9IHNqMTsgamogPD0gc2oyOyBqaisrKSB7XG4gICAgICAgICAgc3VtICs9ICgxLjAgKiBpbWFnZS5kYXRhW2pqICogaW1hZ2Uud2lkdGggKyBpaV0pO1xuICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGltYWdlRGF0YVtqICogd2lkdGggKyBpXSA9IE1hdGguZmxvb3Ioc3VtIC8gY291bnQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2RhdGE6IGltYWdlRGF0YSwgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkb3duc2FtcGxlQmlsaW5lYXIsXG4gIHVwc2FtcGxlQmlsaW5lYXIsXG4gIHJlc2l6ZSxcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCB7ZXh0cmFjdH0gPSByZXF1aXJlKCcuL3RyYWNrZXIvZXh0cmFjdC5qcycpO1xuY29uc3Qge2J1aWxkVHJhY2tpbmdJbWFnZUxpc3R9ID0gcmVxdWlyZSgnLi9pbWFnZS1saXN0LmpzJyk7XG5cbm9ubWVzc2FnZSA9IChtc2cpID0+IHtcbiAgY29uc3Qge2RhdGF9ID0gbXNnO1xuICBpZiAoZGF0YS50eXBlID09PSAnY29tcGlsZScpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwid29ya2VyIGNvbXBpbGUuLi5cIik7XG4gICAgY29uc3Qge3RhcmdldEltYWdlc30gPSBkYXRhO1xuICAgIGNvbnN0IHBlcmNlbnRQZXJJbWFnZSA9IDUwLjAgLyB0YXJnZXRJbWFnZXMubGVuZ3RoO1xuICAgIGxldCBwZXJjZW50ID0gMC4wO1xuICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldEltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGFyZ2V0SW1hZ2UgPSB0YXJnZXRJbWFnZXNbaV07XG4gICAgICBjb25zdCBpbWFnZUxpc3QgPSBidWlsZFRyYWNraW5nSW1hZ2VMaXN0KHRhcmdldEltYWdlKTtcbiAgICAgIGNvbnN0IHBlcmNlbnRQZXJBY3Rpb24gPSBwZXJjZW50UGVySW1hZ2UgLyBpbWFnZUxpc3QubGVuZ3RoO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKFwiY29tcGlsaW5nIHRyYWNraW5nLi4uXCIsIGkpO1xuICAgICAgY29uc3QgdHJhY2tpbmdEYXRhID0gX2V4dHJhY3RUcmFja2luZ0ZlYXR1cmVzKGltYWdlTGlzdCwgKGluZGV4KSA9PiB7XG5cdC8vY29uc29sZS5sb2coXCJkb25lIHRyYWNraW5nXCIsIGksIGluZGV4KTtcblx0cGVyY2VudCArPSBwZXJjZW50UGVyQWN0aW9uXG5cdHBvc3RNZXNzYWdlKHt0eXBlOiAncHJvZ3Jlc3MnLCBwZXJjZW50fSk7XG4gICAgICB9KTtcbiAgICAgIGxpc3QucHVzaCh0cmFja2luZ0RhdGEpO1xuICAgIH1cbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICB0eXBlOiAnY29tcGlsZURvbmUnLFxuICAgICAgbGlzdCxcbiAgICB9KTtcbiAgfVxufTtcblxuY29uc3QgX2V4dHJhY3RUcmFja2luZ0ZlYXR1cmVzID0gKGltYWdlTGlzdCwgZG9uZUNhbGxiYWNrKSA9PiB7XG4gIGNvbnN0IGZlYXR1cmVTZXRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaW1hZ2UgPSBpbWFnZUxpc3RbaV07XG4gICAgY29uc3QgcG9pbnRzID0gZXh0cmFjdChpbWFnZSk7XG5cbiAgICBjb25zdCBmZWF0dXJlU2V0ID0ge1xuICAgICAgZGF0YTogaW1hZ2UuZGF0YSxcbiAgICAgIHNjYWxlOiBpbWFnZS5zY2FsZSxcbiAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuICAgICAgcG9pbnRzLFxuICAgIH07XG4gICAgZmVhdHVyZVNldHMucHVzaChmZWF0dXJlU2V0KTtcblxuICAgIGRvbmVDYWxsYmFjayhpKTtcbiAgfVxuICByZXR1cm4gZmVhdHVyZVNldHM7XG59XG5cbiJdLCJzb3VyY2VSb290IjoiIn0=