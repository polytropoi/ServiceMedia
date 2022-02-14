/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/ml-matrix/node_modules/is-any-array/src/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/ml-matrix/node_modules/is-any-array/src/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAnyArray)
/* harmony export */ });
const toString = Object.prototype.toString;

function isAnyArray(object) {
  return toString.call(object).endsWith('Array]');
}


/***/ }),

/***/ "./node_modules/ml-matrix/node_modules/ml-array-max/lib-es6/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/ml-matrix/node_modules/ml-array-max/lib-es6/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/ml-matrix/node_modules/is-any-array/src/index.js");


function max(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0,is_any_array__WEBPACK_IMPORTED_MODULE_0__.default)(input)) {
    throw new TypeError('input must be an array');
  }

  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var _options$fromIndex = options.fromIndex,
      fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
      _options$toIndex = options.toIndex,
      toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
    throw new Error('fromIndex must be a positive integer smaller than length');
  }

  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
  }

  var maxValue = input[fromIndex];

  for (var i = fromIndex + 1; i < toIndex; i++) {
    if (input[i] > maxValue) maxValue = input[i];
  }

  return maxValue;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (max);


/***/ }),

/***/ "./node_modules/ml-matrix/node_modules/ml-array-min/lib-es6/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/ml-matrix/node_modules/ml-array-min/lib-es6/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/ml-matrix/node_modules/is-any-array/src/index.js");


function min(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0,is_any_array__WEBPACK_IMPORTED_MODULE_0__.default)(input)) {
    throw new TypeError('input must be an array');
  }

  if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var _options$fromIndex = options.fromIndex,
      fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
      _options$toIndex = options.toIndex,
      toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

  if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
    throw new Error('fromIndex must be a positive integer smaller than length');
  }

  if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
    throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
  }

  var minValue = input[fromIndex];

  for (var i = fromIndex + 1; i < toIndex; i++) {
    if (input[i] < minValue) minValue = input[i];
  }

  return minValue;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (min);


/***/ }),

/***/ "./node_modules/ml-matrix/node_modules/ml-array-rescale/lib-es6/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/ml-matrix/node_modules/ml-array-rescale/lib-es6/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var is_any_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-any-array */ "./node_modules/ml-matrix/node_modules/is-any-array/src/index.js");
/* harmony import */ var ml_array_max__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ml-array-max */ "./node_modules/ml-matrix/node_modules/ml-array-max/lib-es6/index.js");
/* harmony import */ var ml_array_min__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ml-array-min */ "./node_modules/ml-matrix/node_modules/ml-array-min/lib-es6/index.js");




function rescale(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0,is_any_array__WEBPACK_IMPORTED_MODULE_0__.default)(input)) {
    throw new TypeError('input must be an array');
  } else if (input.length === 0) {
    throw new TypeError('input must not be empty');
  }

  var output;

  if (options.output !== undefined) {
    if (!(0,is_any_array__WEBPACK_IMPORTED_MODULE_0__.default)(options.output)) {
      throw new TypeError('output option must be an array if specified');
    }

    output = options.output;
  } else {
    output = new Array(input.length);
  }

  var currentMin = (0,ml_array_min__WEBPACK_IMPORTED_MODULE_2__.default)(input);
  var currentMax = (0,ml_array_max__WEBPACK_IMPORTED_MODULE_1__.default)(input);

  if (currentMin === currentMax) {
    throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
  }

  var _options$min = options.min,
      minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
      _options$max = options.max,
      maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

  if (minValue >= maxValue) {
    throw new RangeError('min option must be smaller than max option');
  }

  var factor = (maxValue - minValue) / (currentMax - currentMin);

  for (var i = 0; i < input.length; i++) {
    output[i] = (input[i] - currentMin) * factor + minValue;
  }

  return output;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rescale);


/***/ }),

/***/ "./node_modules/ml-matrix/src/correlation.js":
/*!***************************************************!*\
  !*** ./node_modules/ml-matrix/src/correlation.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "correlation": () => (/* binding */ correlation)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");


function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
  xMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__.default(xMatrix);
  let yIsSame = false;
  if (
    typeof yMatrix === 'object' &&
    !_matrix__WEBPACK_IMPORTED_MODULE_0__.default.isMatrix(yMatrix) &&
    !Array.isArray(yMatrix)
  ) {
    options = yMatrix;
    yMatrix = xMatrix;
    yIsSame = true;
  } else {
    yMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__.default(yMatrix);
  }
  if (xMatrix.rows !== yMatrix.rows) {
    throw new TypeError('Both matrices must have the same number of rows');
  }

  const { center = true, scale = true } = options;
  if (center) {
    xMatrix.center('column');
    if (!yIsSame) {
      yMatrix.center('column');
    }
  }
  if (scale) {
    xMatrix.scale('column');
    if (!yIsSame) {
      yMatrix.scale('column');
    }
  }

  const sdx = xMatrix.standardDeviation('column', { unbiased: true });
  const sdy = yIsSame
    ? sdx
    : yMatrix.standardDeviation('column', { unbiased: true });

  const corr = xMatrix.transpose().mmul(yMatrix);
  for (let i = 0; i < corr.rows; i++) {
    for (let j = 0; j < corr.columns; j++) {
      corr.set(
        i,
        j,
        corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1)),
      );
    }
  }
  return corr;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/covariance.js":
/*!**************************************************!*\
  !*** ./node_modules/ml-matrix/src/covariance.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "covariance": () => (/* binding */ covariance)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");


function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
  xMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__.default(xMatrix);
  let yIsSame = false;
  if (
    typeof yMatrix === 'object' &&
    !_matrix__WEBPACK_IMPORTED_MODULE_0__.default.isMatrix(yMatrix) &&
    !Array.isArray(yMatrix)
  ) {
    options = yMatrix;
    yMatrix = xMatrix;
    yIsSame = true;
  } else {
    yMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__.default(yMatrix);
  }
  if (xMatrix.rows !== yMatrix.rows) {
    throw new TypeError('Both matrices must have the same number of rows');
  }
  const { center = true } = options;
  if (center) {
    xMatrix = xMatrix.center('column');
    if (!yIsSame) {
      yMatrix = yMatrix.center('column');
    }
  }
  const cov = xMatrix.transpose().mmul(yMatrix);
  for (let i = 0; i < cov.rows; i++) {
    for (let j = 0; j < cov.columns; j++) {
      cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
    }
  }
  return cov;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/cholesky.js":
/*!***************************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/cholesky.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CholeskyDecomposition)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");



class CholeskyDecomposition {
  constructor(value) {
    value = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(value);
    if (!value.isSymmetric()) {
      throw new Error('Matrix is not symmetric');
    }

    let a = value;
    let dimension = a.rows;
    let l = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(dimension, dimension);
    let positiveDefinite = true;
    let i, j, k;

    for (j = 0; j < dimension; j++) {
      let d = 0;
      for (k = 0; k < j; k++) {
        let s = 0;
        for (i = 0; i < k; i++) {
          s += l.get(k, i) * l.get(j, i);
        }
        s = (a.get(j, k) - s) / l.get(k, k);
        l.set(j, k, s);
        d = d + s * s;
      }

      d = a.get(j, j) - d;

      positiveDefinite &= d > 0;
      l.set(j, j, Math.sqrt(Math.max(d, 0)));
      for (k = j + 1; k < dimension; k++) {
        l.set(j, k, 0);
      }
    }

    this.L = l;
    this.positiveDefinite = Boolean(positiveDefinite);
  }

  isPositiveDefinite() {
    return this.positiveDefinite;
  }

  solve(value) {
    value = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(value);

    let l = this.L;
    let dimension = l.rows;

    if (value.rows !== dimension) {
      throw new Error('Matrix dimensions do not match');
    }
    if (this.isPositiveDefinite() === false) {
      throw new Error('Matrix is not positive definite');
    }

    let count = value.columns;
    let B = value.clone();
    let i, j, k;

    for (k = 0; k < dimension; k++) {
      for (j = 0; j < count; j++) {
        for (i = 0; i < k; i++) {
          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
        }
        B.set(k, j, B.get(k, j) / l.get(k, k));
      }
    }

    for (k = dimension - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        for (i = k + 1; i < dimension; i++) {
          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
        }
        B.set(k, j, B.get(k, j) / l.get(k, k));
      }
    }

    return B;
  }

  get lowerTriangularMatrix() {
    return this.L;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/evd.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/evd.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EigenvalueDecomposition)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");





class EigenvalueDecomposition {
  constructor(matrix, options = {}) {
    const { assumeSymmetric = false } = options;

    matrix = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);
    if (!matrix.isSquare()) {
      throw new Error('Matrix is not a square matrix');
    }

    if (matrix.isEmpty()) {
      throw new Error('Matrix must be non-empty');
    }

    let n = matrix.columns;
    let V = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(n, n);
    let d = new Float64Array(n);
    let e = new Float64Array(n);
    let value = matrix;
    let i, j;

    let isSymmetric = false;
    if (assumeSymmetric) {
      isSymmetric = true;
    } else {
      isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          V.set(i, j, value.get(i, j));
        }
      }
      tred2(n, e, d, V);
      tql2(n, e, d, V);
    } else {
      let H = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(n, n);
      let ort = new Float64Array(n);
      for (j = 0; j < n; j++) {
        for (i = 0; i < n; i++) {
          H.set(i, j, value.get(i, j));
        }
      }
      orthes(n, H, ort, V);
      hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
  }

  get realEigenvalues() {
    return Array.from(this.d);
  }

  get imaginaryEigenvalues() {
    return Array.from(this.e);
  }

  get eigenvectorMatrix() {
    return this.V;
  }

  get diagonalMatrix() {
    let n = this.n;
    let e = this.e;
    let d = this.d;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(n, n);
    let i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        X.set(i, j, 0);
      }
      X.set(i, i, d[i]);
      if (e[i] > 0) {
        X.set(i, i + 1, e[i]);
      } else if (e[i] < 0) {
        X.set(i, i - 1, e[i]);
      }
    }
    return X;
  }
}

function tred2(n, e, d, V) {
  let f, g, h, i, j, k, hh, scale;

  for (j = 0; j < n; j++) {
    d[j] = V.get(n - 1, j);
  }

  for (i = n - 1; i > 0; i--) {
    scale = 0;
    h = 0;
    for (k = 0; k < i; k++) {
      scale = scale + Math.abs(d[k]);
    }

    if (scale === 0) {
      e[i] = d[i - 1];
      for (j = 0; j < i; j++) {
        d[j] = V.get(i - 1, j);
        V.set(i, j, 0);
        V.set(j, i, 0);
      }
    } else {
      for (k = 0; k < i; k++) {
        d[k] /= scale;
        h += d[k] * d[k];
      }

      f = d[i - 1];
      g = Math.sqrt(h);
      if (f > 0) {
        g = -g;
      }

      e[i] = scale * g;
      h = h - f * g;
      d[i - 1] = f - g;
      for (j = 0; j < i; j++) {
        e[j] = 0;
      }

      for (j = 0; j < i; j++) {
        f = d[j];
        V.set(j, i, f);
        g = e[j] + V.get(j, j) * f;
        for (k = j + 1; k <= i - 1; k++) {
          g += V.get(k, j) * d[k];
          e[k] += V.get(k, j) * f;
        }
        e[j] = g;
      }

      f = 0;
      for (j = 0; j < i; j++) {
        e[j] /= h;
        f += e[j] * d[j];
      }

      hh = f / (h + h);
      for (j = 0; j < i; j++) {
        e[j] -= hh * d[j];
      }

      for (j = 0; j < i; j++) {
        f = d[j];
        g = e[j];
        for (k = j; k <= i - 1; k++) {
          V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
        }
        d[j] = V.get(i - 1, j);
        V.set(i, j, 0);
      }
    }
    d[i] = h;
  }

  for (i = 0; i < n - 1; i++) {
    V.set(n - 1, i, V.get(i, i));
    V.set(i, i, 1);
    h = d[i + 1];
    if (h !== 0) {
      for (k = 0; k <= i; k++) {
        d[k] = V.get(k, i + 1) / h;
      }

      for (j = 0; j <= i; j++) {
        g = 0;
        for (k = 0; k <= i; k++) {
          g += V.get(k, i + 1) * V.get(k, j);
        }
        for (k = 0; k <= i; k++) {
          V.set(k, j, V.get(k, j) - g * d[k]);
        }
      }
    }

    for (k = 0; k <= i; k++) {
      V.set(k, i + 1, 0);
    }
  }

  for (j = 0; j < n; j++) {
    d[j] = V.get(n - 1, j);
    V.set(n - 1, j, 0);
  }

  V.set(n - 1, n - 1, 1);
  e[0] = 0;
}

function tql2(n, e, d, V) {
  let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2, iter;

  for (i = 1; i < n; i++) {
    e[i - 1] = e[i];
  }

  e[n - 1] = 0;

  let f = 0;
  let tst1 = 0;
  let eps = Number.EPSILON;

  for (l = 0; l < n; l++) {
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    m = l;
    while (m < n) {
      if (Math.abs(e[m]) <= eps * tst1) {
        break;
      }
      m++;
    }

    if (m > l) {
      iter = 0;
      do {
        iter = iter + 1;

        g = d[l];
        p = (d[l + 1] - g) / (2 * e[l]);
        r = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(p, 1);
        if (p < 0) {
          r = -r;
        }

        d[l] = e[l] / (p + r);
        d[l + 1] = e[l] * (p + r);
        dl1 = d[l + 1];
        h = g - d[l];
        for (i = l + 2; i < n; i++) {
          d[i] -= h;
        }

        f = f + h;

        p = d[m];
        c = 1;
        c2 = c;
        c3 = c;
        el1 = e[l + 1];
        s = 0;
        s2 = 0;
        for (i = m - 1; i >= l; i--) {
          c3 = c2;
          c2 = c;
          s2 = s;
          g = c * e[i];
          h = c * p;
          r = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(p, e[i]);
          e[i + 1] = s * r;
          s = e[i] / r;
          c = p / r;
          p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);

          for (k = 0; k < n; k++) {
            h = V.get(k, i + 1);
            V.set(k, i + 1, s * V.get(k, i) + c * h);
            V.set(k, i, c * V.get(k, i) - s * h);
          }
        }

        p = (-s * s2 * c3 * el1 * e[l]) / dl1;
        e[l] = s * p;
        d[l] = c * p;
      } while (Math.abs(e[l]) > eps * tst1);
    }
    d[l] = d[l] + f;
    e[l] = 0;
  }

  for (i = 0; i < n - 1; i++) {
    k = i;
    p = d[i];
    for (j = i + 1; j < n; j++) {
      if (d[j] < p) {
        k = j;
        p = d[j];
      }
    }

    if (k !== i) {
      d[k] = d[i];
      d[i] = p;
      for (j = 0; j < n; j++) {
        p = V.get(j, i);
        V.set(j, i, V.get(j, k));
        V.set(j, k, p);
      }
    }
  }
}

function orthes(n, H, ort, V) {
  let low = 0;
  let high = n - 1;
  let f, g, h, i, j, m;
  let scale;

  for (m = low + 1; m <= high - 1; m++) {
    scale = 0;
    for (i = m; i <= high; i++) {
      scale = scale + Math.abs(H.get(i, m - 1));
    }

    if (scale !== 0) {
      h = 0;
      for (i = high; i >= m; i--) {
        ort[i] = H.get(i, m - 1) / scale;
        h += ort[i] * ort[i];
      }

      g = Math.sqrt(h);
      if (ort[m] > 0) {
        g = -g;
      }

      h = h - ort[m] * g;
      ort[m] = ort[m] - g;

      for (j = m; j < n; j++) {
        f = 0;
        for (i = high; i >= m; i--) {
          f += ort[i] * H.get(i, j);
        }

        f = f / h;
        for (i = m; i <= high; i++) {
          H.set(i, j, H.get(i, j) - f * ort[i]);
        }
      }

      for (i = 0; i <= high; i++) {
        f = 0;
        for (j = high; j >= m; j--) {
          f += ort[j] * H.get(i, j);
        }

        f = f / h;
        for (j = m; j <= high; j++) {
          H.set(i, j, H.get(i, j) - f * ort[j]);
        }
      }

      ort[m] = scale * ort[m];
      H.set(m, m - 1, scale * g);
    }
  }

  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      V.set(i, j, i === j ? 1 : 0);
    }
  }

  for (m = high - 1; m >= low + 1; m--) {
    if (H.get(m, m - 1) !== 0) {
      for (i = m + 1; i <= high; i++) {
        ort[i] = H.get(i, m - 1);
      }

      for (j = m; j <= high; j++) {
        g = 0;
        for (i = m; i <= high; i++) {
          g += ort[i] * V.get(i, j);
        }

        g = g / ort[m] / H.get(m, m - 1);
        for (i = m; i <= high; i++) {
          V.set(i, j, V.get(i, j) + g * ort[i]);
        }
      }
    }
  }
}

function hqr2(nn, e, d, V, H) {
  let n = nn - 1;
  let low = 0;
  let high = nn - 1;
  let eps = Number.EPSILON;
  let exshift = 0;
  let norm = 0;
  let p = 0;
  let q = 0;
  let r = 0;
  let s = 0;
  let z = 0;
  let iter = 0;
  let i, j, k, l, m, t, w, x, y;
  let ra, sa, vr, vi;
  let notlast, cdivres;

  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      d[i] = H.get(i, i);
      e[i] = 0;
    }

    for (j = Math.max(i - 1, 0); j < nn; j++) {
      norm = norm + Math.abs(H.get(i, j));
    }
  }

  while (n >= low) {
    l = n;
    while (l > low) {
      s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
      if (s === 0) {
        s = norm;
      }
      if (Math.abs(H.get(l, l - 1)) < eps * s) {
        break;
      }
      l--;
    }

    if (l === n) {
      H.set(n, n, H.get(n, n) + exshift);
      d[n] = H.get(n, n);
      e[n] = 0;
      n--;
      iter = 0;
    } else if (l === n - 1) {
      w = H.get(n, n - 1) * H.get(n - 1, n);
      p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
      q = p * p + w;
      z = Math.sqrt(Math.abs(q));
      H.set(n, n, H.get(n, n) + exshift);
      H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
      x = H.get(n, n);

      if (q >= 0) {
        z = p >= 0 ? p + z : p - z;
        d[n - 1] = x + z;
        d[n] = d[n - 1];
        if (z !== 0) {
          d[n] = x - w / z;
        }
        e[n - 1] = 0;
        e[n] = 0;
        x = H.get(n, n - 1);
        s = Math.abs(x) + Math.abs(z);
        p = x / s;
        q = z / s;
        r = Math.sqrt(p * p + q * q);
        p = p / r;
        q = q / r;

        for (j = n - 1; j < nn; j++) {
          z = H.get(n - 1, j);
          H.set(n - 1, j, q * z + p * H.get(n, j));
          H.set(n, j, q * H.get(n, j) - p * z);
        }

        for (i = 0; i <= n; i++) {
          z = H.get(i, n - 1);
          H.set(i, n - 1, q * z + p * H.get(i, n));
          H.set(i, n, q * H.get(i, n) - p * z);
        }

        for (i = low; i <= high; i++) {
          z = V.get(i, n - 1);
          V.set(i, n - 1, q * z + p * V.get(i, n));
          V.set(i, n, q * V.get(i, n) - p * z);
        }
      } else {
        d[n - 1] = x + p;
        d[n] = x + p;
        e[n - 1] = z;
        e[n] = -z;
      }

      n = n - 2;
      iter = 0;
    } else {
      x = H.get(n, n);
      y = 0;
      w = 0;
      if (l < n) {
        y = H.get(n - 1, n - 1);
        w = H.get(n, n - 1) * H.get(n - 1, n);
      }

      if (iter === 10) {
        exshift += x;
        for (i = low; i <= n; i++) {
          H.set(i, i, H.get(i, i) - x);
        }
        s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
        x = y = 0.75 * s;
        w = -0.4375 * s * s;
      }

      if (iter === 30) {
        s = (y - x) / 2;
        s = s * s + w;
        if (s > 0) {
          s = Math.sqrt(s);
          if (y < x) {
            s = -s;
          }
          s = x - w / ((y - x) / 2 + s);
          for (i = low; i <= n; i++) {
            H.set(i, i, H.get(i, i) - s);
          }
          exshift += s;
          x = y = w = 0.964;
        }
      }

      iter = iter + 1;

      m = n - 2;
      while (m >= l) {
        z = H.get(m, m);
        r = x - z;
        s = y - z;
        p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
        q = H.get(m + 1, m + 1) - z - r - s;
        r = H.get(m + 2, m + 1);
        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
        p = p / s;
        q = q / s;
        r = r / s;
        if (m === l) {
          break;
        }
        if (
          Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) <
          eps *
            (Math.abs(p) *
              (Math.abs(H.get(m - 1, m - 1)) +
                Math.abs(z) +
                Math.abs(H.get(m + 1, m + 1))))
        ) {
          break;
        }
        m--;
      }

      for (i = m + 2; i <= n; i++) {
        H.set(i, i - 2, 0);
        if (i > m + 2) {
          H.set(i, i - 3, 0);
        }
      }

      for (k = m; k <= n - 1; k++) {
        notlast = k !== n - 1;
        if (k !== m) {
          p = H.get(k, k - 1);
          q = H.get(k + 1, k - 1);
          r = notlast ? H.get(k + 2, k - 1) : 0;
          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
          if (x !== 0) {
            p = p / x;
            q = q / x;
            r = r / x;
          }
        }

        if (x === 0) {
          break;
        }

        s = Math.sqrt(p * p + q * q + r * r);
        if (p < 0) {
          s = -s;
        }

        if (s !== 0) {
          if (k !== m) {
            H.set(k, k - 1, -s * x);
          } else if (l !== m) {
            H.set(k, k - 1, -H.get(k, k - 1));
          }

          p = p + s;
          x = p / s;
          y = q / s;
          z = r / s;
          q = q / p;
          r = r / p;

          for (j = k; j < nn; j++) {
            p = H.get(k, j) + q * H.get(k + 1, j);
            if (notlast) {
              p = p + r * H.get(k + 2, j);
              H.set(k + 2, j, H.get(k + 2, j) - p * z);
            }

            H.set(k, j, H.get(k, j) - p * x);
            H.set(k + 1, j, H.get(k + 1, j) - p * y);
          }

          for (i = 0; i <= Math.min(n, k + 3); i++) {
            p = x * H.get(i, k) + y * H.get(i, k + 1);
            if (notlast) {
              p = p + z * H.get(i, k + 2);
              H.set(i, k + 2, H.get(i, k + 2) - p * r);
            }

            H.set(i, k, H.get(i, k) - p);
            H.set(i, k + 1, H.get(i, k + 1) - p * q);
          }

          for (i = low; i <= high; i++) {
            p = x * V.get(i, k) + y * V.get(i, k + 1);
            if (notlast) {
              p = p + z * V.get(i, k + 2);
              V.set(i, k + 2, V.get(i, k + 2) - p * r);
            }

            V.set(i, k, V.get(i, k) - p);
            V.set(i, k + 1, V.get(i, k + 1) - p * q);
          }
        }
      }
    }
  }

  if (norm === 0) {
    return;
  }

  for (n = nn - 1; n >= 0; n--) {
    p = d[n];
    q = e[n];

    if (q === 0) {
      l = n;
      H.set(n, n, 1);
      for (i = n - 1; i >= 0; i--) {
        w = H.get(i, i) - p;
        r = 0;
        for (j = l; j <= n; j++) {
          r = r + H.get(i, j) * H.get(j, n);
        }

        if (e[i] < 0) {
          z = w;
          s = r;
        } else {
          l = i;
          if (e[i] === 0) {
            H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
          } else {
            x = H.get(i, i + 1);
            y = H.get(i + 1, i);
            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
            t = (x * s - z * r) / q;
            H.set(i, n, t);
            H.set(
              i + 1,
              n,
              Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z,
            );
          }

          t = Math.abs(H.get(i, n));
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H.set(j, n, H.get(j, n) / t);
            }
          }
        }
      }
    } else if (q < 0) {
      l = n - 1;

      if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
        H.set(n - 1, n - 1, q / H.get(n, n - 1));
        H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
      } else {
        cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
        H.set(n - 1, n - 1, cdivres[0]);
        H.set(n - 1, n, cdivres[1]);
      }

      H.set(n, n - 1, 0);
      H.set(n, n, 1);
      for (i = n - 2; i >= 0; i--) {
        ra = 0;
        sa = 0;
        for (j = l; j <= n; j++) {
          ra = ra + H.get(i, j) * H.get(j, n - 1);
          sa = sa + H.get(i, j) * H.get(j, n);
        }

        w = H.get(i, i) - p;

        if (e[i] < 0) {
          z = w;
          r = ra;
          s = sa;
        } else {
          l = i;
          if (e[i] === 0) {
            cdivres = cdiv(-ra, -sa, w, q);
            H.set(i, n - 1, cdivres[0]);
            H.set(i, n, cdivres[1]);
          } else {
            x = H.get(i, i + 1);
            y = H.get(i + 1, i);
            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
            vi = (d[i] - p) * 2 * q;
            if (vr === 0 && vi === 0) {
              vr =
                eps *
                norm *
                (Math.abs(w) +
                  Math.abs(q) +
                  Math.abs(x) +
                  Math.abs(y) +
                  Math.abs(z));
            }
            cdivres = cdiv(
              x * r - z * ra + q * sa,
              x * s - z * sa - q * ra,
              vr,
              vi,
            );
            H.set(i, n - 1, cdivres[0]);
            H.set(i, n, cdivres[1]);
            if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
              H.set(
                i + 1,
                n - 1,
                (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x,
              );
              H.set(
                i + 1,
                n,
                (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x,
              );
            } else {
              cdivres = cdiv(
                -r - y * H.get(i, n - 1),
                -s - y * H.get(i, n),
                z,
                q,
              );
              H.set(i + 1, n - 1, cdivres[0]);
              H.set(i + 1, n, cdivres[1]);
            }
          }

          t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
          if (eps * t * t > 1) {
            for (j = i; j <= n; j++) {
              H.set(j, n - 1, H.get(j, n - 1) / t);
              H.set(j, n, H.get(j, n) / t);
            }
          }
        }
      }
    }
  }

  for (i = 0; i < nn; i++) {
    if (i < low || i > high) {
      for (j = i; j < nn; j++) {
        V.set(i, j, H.get(i, j));
      }
    }
  }

  for (j = nn - 1; j >= low; j--) {
    for (i = low; i <= high; i++) {
      z = 0;
      for (k = low; k <= Math.min(j, high); k++) {
        z = z + V.get(i, k) * H.get(k, j);
      }
      V.set(i, j, z);
    }
  }
}

function cdiv(xr, xi, yr, yi) {
  let r, d;
  if (Math.abs(yr) > Math.abs(yi)) {
    r = yi / yr;
    d = yr + r * yi;
    return [(xr + r * xi) / d, (xi - r * xr) / d];
  } else {
    r = yr / yi;
    d = yi + r * yr;
    return [(r * xr + xi) / d, (r * xi - xr) / d];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/lu.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/lu.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LuDecomposition)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");



class LuDecomposition {
  constructor(matrix) {
    matrix = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);

    let lu = matrix.clone();
    let rows = lu.rows;
    let columns = lu.columns;
    let pivotVector = new Float64Array(rows);
    let pivotSign = 1;
    let i, j, k, p, s, t, v;
    let LUcolj, kmax;

    for (i = 0; i < rows; i++) {
      pivotVector[i] = i;
    }

    LUcolj = new Float64Array(rows);

    for (j = 0; j < columns; j++) {
      for (i = 0; i < rows; i++) {
        LUcolj[i] = lu.get(i, j);
      }

      for (i = 0; i < rows; i++) {
        kmax = Math.min(i, j);
        s = 0;
        for (k = 0; k < kmax; k++) {
          s += lu.get(i, k) * LUcolj[k];
        }
        LUcolj[i] -= s;
        lu.set(i, j, LUcolj[i]);
      }

      p = j;
      for (i = j + 1; i < rows; i++) {
        if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
          p = i;
        }
      }

      if (p !== j) {
        for (k = 0; k < columns; k++) {
          t = lu.get(p, k);
          lu.set(p, k, lu.get(j, k));
          lu.set(j, k, t);
        }

        v = pivotVector[p];
        pivotVector[p] = pivotVector[j];
        pivotVector[j] = v;

        pivotSign = -pivotSign;
      }

      if (j < rows && lu.get(j, j) !== 0) {
        for (i = j + 1; i < rows; i++) {
          lu.set(i, j, lu.get(i, j) / lu.get(j, j));
        }
      }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
  }

  isSingular() {
    let data = this.LU;
    let col = data.columns;
    for (let j = 0; j < col; j++) {
      if (data.get(j, j) === 0) {
        return true;
      }
    }
    return false;
  }

  solve(value) {
    value = _matrix__WEBPACK_IMPORTED_MODULE_1__.default.checkMatrix(value);

    let lu = this.LU;
    let rows = lu.rows;

    if (rows !== value.rows) {
      throw new Error('Invalid matrix dimensions');
    }
    if (this.isSingular()) {
      throw new Error('LU matrix is singular');
    }

    let count = value.columns;
    let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
    let columns = lu.columns;
    let i, j, k;

    for (k = 0; k < columns; k++) {
      for (i = k + 1; i < columns; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
        }
      }
    }
    for (k = columns - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X.set(k, j, X.get(k, j) / lu.get(k, k));
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
        }
      }
    }
    return X;
  }

  get determinant() {
    let data = this.LU;
    if (!data.isSquare()) {
      throw new Error('Matrix must be square');
    }
    let determinant = this.pivotSign;
    let col = data.columns;
    for (let j = 0; j < col; j++) {
      determinant *= data.get(j, j);
    }
    return determinant;
  }

  get lowerTriangularMatrix() {
    let data = this.LU;
    let rows = data.rows;
    let columns = data.columns;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (i > j) {
          X.set(i, j, data.get(i, j));
        } else if (i === j) {
          X.set(i, j, 1);
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }

  get upperTriangularMatrix() {
    let data = this.LU;
    let rows = data.rows;
    let columns = data.columns;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (i <= j) {
          X.set(i, j, data.get(i, j));
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }

  get pivotPermutationVector() {
    return Array.from(this.pivotVector);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/nipals.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/nipals.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ nipals)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");



class nipals {
  constructor(X, options = {}) {
    X = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(X);
    let { Y } = options;
    const {
      scaleScores = false,
      maxIterations = 1000,
      terminationCriteria = 1e-10,
    } = options;

    let u;
    if (Y) {
      if (Array.isArray(Y) && typeof Y[0] === 'number') {
        Y = _matrix__WEBPACK_IMPORTED_MODULE_1__.default.columnVector(Y);
      } else {
        Y = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(Y);
      }
      if (!Y.isColumnVector() || Y.rows !== X.rows) {
        throw new Error('Y must be a column vector of length X.rows');
      }
      u = Y;
    } else {
      u = X.getColumnVector(0);
    }

    let diff = 1;
    let t, q, w, tOld;

    for (
      let counter = 0;
      counter < maxIterations && diff > terminationCriteria;
      counter++
    ) {
      w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
      w = w.div(w.norm());

      t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));

      if (counter > 0) {
        diff = t.clone().sub(tOld).pow(2).sum();
      }
      tOld = t.clone();

      if (Y) {
        q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
        q = q.div(q.norm());

        u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
      } else {
        u = t;
      }
    }

    if (Y) {
      let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
      p = p.div(p.norm());
      let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
      let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
      let yResidual = Y.clone().sub(
        t.clone().mulS(residual.get(0, 0)).mmul(q.transpose()),
      );

      this.t = t;
      this.p = p.transpose();
      this.w = w.transpose();
      this.q = q;
      this.u = u;
      this.s = t.transpose().mmul(t);
      this.xResidual = xResidual;
      this.yResidual = yResidual;
      this.betas = residual;
    } else {
      this.w = w.transpose();
      this.s = t.transpose().mmul(t).sqrt();
      if (scaleScores) {
        this.t = t.clone().div(this.s.get(0, 0));
      } else {
        this.t = t;
      }
      this.xResidual = X.sub(t.mmul(w.transpose()));
    }
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/qr.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/qr.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QrDecomposition)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");





class QrDecomposition {
  constructor(value) {
    value = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(value);

    let qr = value.clone();
    let m = value.rows;
    let n = value.columns;
    let rdiag = new Float64Array(n);
    let i, j, k, s;

    for (k = 0; k < n; k++) {
      let nrm = 0;
      for (i = k; i < m; i++) {
        nrm = (0,_util__WEBPACK_IMPORTED_MODULE_1__.hypotenuse)(nrm, qr.get(i, k));
      }
      if (nrm !== 0) {
        if (qr.get(k, k) < 0) {
          nrm = -nrm;
        }
        for (i = k; i < m; i++) {
          qr.set(i, k, qr.get(i, k) / nrm);
        }
        qr.set(k, k, qr.get(k, k) + 1);
        for (j = k + 1; j < n; j++) {
          s = 0;
          for (i = k; i < m; i++) {
            s += qr.get(i, k) * qr.get(i, j);
          }
          s = -s / qr.get(k, k);
          for (i = k; i < m; i++) {
            qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
          }
        }
      }
      rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
  }

  solve(value) {
    value = _matrix__WEBPACK_IMPORTED_MODULE_2__.default.checkMatrix(value);

    let qr = this.QR;
    let m = qr.rows;

    if (value.rows !== m) {
      throw new Error('Matrix row dimensions must agree');
    }
    if (!this.isFullRank()) {
      throw new Error('Matrix is rank deficient');
    }

    let count = value.columns;
    let X = value.clone();
    let n = qr.columns;
    let i, j, k, s;

    for (k = 0; k < n; k++) {
      for (j = 0; j < count; j++) {
        s = 0;
        for (i = k; i < m; i++) {
          s += qr.get(i, k) * X.get(i, j);
        }
        s = -s / qr.get(k, k);
        for (i = k; i < m; i++) {
          X.set(i, j, X.get(i, j) + s * qr.get(i, k));
        }
      }
    }
    for (k = n - 1; k >= 0; k--) {
      for (j = 0; j < count; j++) {
        X.set(k, j, X.get(k, j) / this.Rdiag[k]);
      }
      for (i = 0; i < k; i++) {
        for (j = 0; j < count; j++) {
          X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
        }
      }
    }

    return X.subMatrix(0, n - 1, 0, count - 1);
  }

  isFullRank() {
    let columns = this.QR.columns;
    for (let i = 0; i < columns; i++) {
      if (this.Rdiag[i] === 0) {
        return false;
      }
    }
    return true;
  }

  get upperTriangularMatrix() {
    let qr = this.QR;
    let n = qr.columns;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_2__.default(n, n);
    let i, j;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if (i < j) {
          X.set(i, j, qr.get(i, j));
        } else if (i === j) {
          X.set(i, j, this.Rdiag[i]);
        } else {
          X.set(i, j, 0);
        }
      }
    }
    return X;
  }

  get orthogonalMatrix() {
    let qr = this.QR;
    let rows = qr.rows;
    let columns = qr.columns;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_2__.default(rows, columns);
    let i, j, k, s;

    for (k = columns - 1; k >= 0; k--) {
      for (i = 0; i < rows; i++) {
        X.set(i, k, 0);
      }
      X.set(k, k, 1);
      for (j = k; j < columns; j++) {
        if (qr.get(k, k) !== 0) {
          s = 0;
          for (i = k; i < rows; i++) {
            s += qr.get(i, k) * X.get(i, j);
          }

          s = -s / qr.get(k, k);

          for (i = k; i < rows; i++) {
            X.set(i, j, X.get(i, j) + s * qr.get(i, k));
          }
        }
      }
    }
    return X;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/svd.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/svd.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SingularValueDecomposition)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/dc/util.js");





class SingularValueDecomposition {
  constructor(value, options = {}) {
    value = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(value);

    if (value.isEmpty()) {
      throw new Error('Matrix must be non-empty');
    }

    let m = value.rows;
    let n = value.columns;

    const {
      computeLeftSingularVectors = true,
      computeRightSingularVectors = true,
      autoTranspose = false,
    } = options;

    let wantu = Boolean(computeLeftSingularVectors);
    let wantv = Boolean(computeRightSingularVectors);

    let swapped = false;
    let a;
    if (m < n) {
      if (!autoTranspose) {
        a = value.clone();
        // eslint-disable-next-line no-console
        console.warn(
          'Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose',
        );
      } else {
        a = value.transpose();
        m = a.rows;
        n = a.columns;
        swapped = true;
        let aux = wantu;
        wantu = wantv;
        wantv = aux;
      }
    } else {
      a = value.clone();
    }

    let nu = Math.min(m, n);
    let ni = Math.min(m + 1, n);
    let s = new Float64Array(ni);
    let U = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(m, nu);
    let V = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(n, n);

    let e = new Float64Array(n);
    let work = new Float64Array(m);

    let si = new Float64Array(ni);
    for (let i = 0; i < ni; i++) si[i] = i;

    let nct = Math.min(m - 1, n);
    let nrt = Math.max(0, Math.min(n - 2, m));
    let mrc = Math.max(nct, nrt);

    for (let k = 0; k < mrc; k++) {
      if (k < nct) {
        s[k] = 0;
        for (let i = k; i < m; i++) {
          s[k] = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(s[k], a.get(i, k));
        }
        if (s[k] !== 0) {
          if (a.get(k, k) < 0) {
            s[k] = -s[k];
          }
          for (let i = k; i < m; i++) {
            a.set(i, k, a.get(i, k) / s[k]);
          }
          a.set(k, k, a.get(k, k) + 1);
        }
        s[k] = -s[k];
      }

      for (let j = k + 1; j < n; j++) {
        if (k < nct && s[k] !== 0) {
          let t = 0;
          for (let i = k; i < m; i++) {
            t += a.get(i, k) * a.get(i, j);
          }
          t = -t / a.get(k, k);
          for (let i = k; i < m; i++) {
            a.set(i, j, a.get(i, j) + t * a.get(i, k));
          }
        }
        e[j] = a.get(k, j);
      }

      if (wantu && k < nct) {
        for (let i = k; i < m; i++) {
          U.set(i, k, a.get(i, k));
        }
      }

      if (k < nrt) {
        e[k] = 0;
        for (let i = k + 1; i < n; i++) {
          e[k] = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(e[k], e[i]);
        }
        if (e[k] !== 0) {
          if (e[k + 1] < 0) {
            e[k] = 0 - e[k];
          }
          for (let i = k + 1; i < n; i++) {
            e[i] /= e[k];
          }
          e[k + 1] += 1;
        }
        e[k] = -e[k];
        if (k + 1 < m && e[k] !== 0) {
          for (let i = k + 1; i < m; i++) {
            work[i] = 0;
          }
          for (let i = k + 1; i < m; i++) {
            for (let j = k + 1; j < n; j++) {
              work[i] += e[j] * a.get(i, j);
            }
          }
          for (let j = k + 1; j < n; j++) {
            let t = -e[j] / e[k + 1];
            for (let i = k + 1; i < m; i++) {
              a.set(i, j, a.get(i, j) + t * work[i]);
            }
          }
        }
        if (wantv) {
          for (let i = k + 1; i < n; i++) {
            V.set(i, k, e[i]);
          }
        }
      }
    }

    let p = Math.min(n, m + 1);
    if (nct < n) {
      s[nct] = a.get(nct, nct);
    }
    if (m < p) {
      s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
      e[nrt] = a.get(nrt, p - 1);
    }
    e[p - 1] = 0;

    if (wantu) {
      for (let j = nct; j < nu; j++) {
        for (let i = 0; i < m; i++) {
          U.set(i, j, 0);
        }
        U.set(j, j, 1);
      }
      for (let k = nct - 1; k >= 0; k--) {
        if (s[k] !== 0) {
          for (let j = k + 1; j < nu; j++) {
            let t = 0;
            for (let i = k; i < m; i++) {
              t += U.get(i, k) * U.get(i, j);
            }
            t = -t / U.get(k, k);
            for (let i = k; i < m; i++) {
              U.set(i, j, U.get(i, j) + t * U.get(i, k));
            }
          }
          for (let i = k; i < m; i++) {
            U.set(i, k, -U.get(i, k));
          }
          U.set(k, k, 1 + U.get(k, k));
          for (let i = 0; i < k - 1; i++) {
            U.set(i, k, 0);
          }
        } else {
          for (let i = 0; i < m; i++) {
            U.set(i, k, 0);
          }
          U.set(k, k, 1);
        }
      }
    }

    if (wantv) {
      for (let k = n - 1; k >= 0; k--) {
        if (k < nrt && e[k] !== 0) {
          for (let j = k + 1; j < n; j++) {
            let t = 0;
            for (let i = k + 1; i < n; i++) {
              t += V.get(i, k) * V.get(i, j);
            }
            t = -t / V.get(k + 1, k);
            for (let i = k + 1; i < n; i++) {
              V.set(i, j, V.get(i, j) + t * V.get(i, k));
            }
          }
        }
        for (let i = 0; i < n; i++) {
          V.set(i, k, 0);
        }
        V.set(k, k, 1);
      }
    }

    let pp = p - 1;
    let iter = 0;
    let eps = Number.EPSILON;
    while (p > 0) {
      let k, kase;
      for (k = p - 2; k >= -1; k--) {
        if (k === -1) {
          break;
        }
        const alpha =
          Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
        if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
          e[k] = 0;
          break;
        }
      }
      if (k === p - 2) {
        kase = 4;
      } else {
        let ks;
        for (ks = p - 1; ks >= k; ks--) {
          if (ks === k) {
            break;
          }
          let t =
            (ks !== p ? Math.abs(e[ks]) : 0) +
            (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
          if (Math.abs(s[ks]) <= eps * t) {
            s[ks] = 0;
            break;
          }
        }
        if (ks === k) {
          kase = 3;
        } else if (ks === p - 1) {
          kase = 1;
        } else {
          kase = 2;
          k = ks;
        }
      }

      k++;

      switch (kase) {
        case 1: {
          let f = e[p - 2];
          e[p - 2] = 0;
          for (let j = p - 2; j >= k; j--) {
            let t = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(s[j], f);
            let cs = s[j] / t;
            let sn = f / t;
            s[j] = t;
            if (j !== k) {
              f = -sn * e[j - 1];
              e[j - 1] = cs * e[j - 1];
            }
            if (wantv) {
              for (let i = 0; i < n; i++) {
                t = cs * V.get(i, j) + sn * V.get(i, p - 1);
                V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
                V.set(i, j, t);
              }
            }
          }
          break;
        }
        case 2: {
          let f = e[k - 1];
          e[k - 1] = 0;
          for (let j = k; j < p; j++) {
            let t = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(s[j], f);
            let cs = s[j] / t;
            let sn = f / t;
            s[j] = t;
            f = -sn * e[j];
            e[j] = cs * e[j];
            if (wantu) {
              for (let i = 0; i < m; i++) {
                t = cs * U.get(i, j) + sn * U.get(i, k - 1);
                U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
                U.set(i, j, t);
              }
            }
          }
          break;
        }
        case 3: {
          const scale = Math.max(
            Math.abs(s[p - 1]),
            Math.abs(s[p - 2]),
            Math.abs(e[p - 2]),
            Math.abs(s[k]),
            Math.abs(e[k]),
          );
          const sp = s[p - 1] / scale;
          const spm1 = s[p - 2] / scale;
          const epm1 = e[p - 2] / scale;
          const sk = s[k] / scale;
          const ek = e[k] / scale;
          const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
          const c = sp * epm1 * (sp * epm1);
          let shift = 0;
          if (b !== 0 || c !== 0) {
            if (b < 0) {
              shift = 0 - Math.sqrt(b * b + c);
            } else {
              shift = Math.sqrt(b * b + c);
            }
            shift = c / (b + shift);
          }
          let f = (sk + sp) * (sk - sp) + shift;
          let g = sk * ek;
          for (let j = k; j < p - 1; j++) {
            let t = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(f, g);
            if (t === 0) t = Number.MIN_VALUE;
            let cs = f / t;
            let sn = g / t;
            if (j !== k) {
              e[j - 1] = t;
            }
            f = cs * s[j] + sn * e[j];
            e[j] = cs * e[j] - sn * s[j];
            g = sn * s[j + 1];
            s[j + 1] = cs * s[j + 1];
            if (wantv) {
              for (let i = 0; i < n; i++) {
                t = cs * V.get(i, j) + sn * V.get(i, j + 1);
                V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
                V.set(i, j, t);
              }
            }
            t = (0,_util__WEBPACK_IMPORTED_MODULE_2__.hypotenuse)(f, g);
            if (t === 0) t = Number.MIN_VALUE;
            cs = f / t;
            sn = g / t;
            s[j] = t;
            f = cs * e[j] + sn * s[j + 1];
            s[j + 1] = -sn * e[j] + cs * s[j + 1];
            g = sn * e[j + 1];
            e[j + 1] = cs * e[j + 1];
            if (wantu && j < m - 1) {
              for (let i = 0; i < m; i++) {
                t = cs * U.get(i, j) + sn * U.get(i, j + 1);
                U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
                U.set(i, j, t);
              }
            }
          }
          e[p - 2] = f;
          iter = iter + 1;
          break;
        }
        case 4: {
          if (s[k] <= 0) {
            s[k] = s[k] < 0 ? -s[k] : 0;
            if (wantv) {
              for (let i = 0; i <= pp; i++) {
                V.set(i, k, -V.get(i, k));
              }
            }
          }
          while (k < pp) {
            if (s[k] >= s[k + 1]) {
              break;
            }
            let t = s[k];
            s[k] = s[k + 1];
            s[k + 1] = t;
            if (wantv && k < n - 1) {
              for (let i = 0; i < n; i++) {
                t = V.get(i, k + 1);
                V.set(i, k + 1, V.get(i, k));
                V.set(i, k, t);
              }
            }
            if (wantu && k < m - 1) {
              for (let i = 0; i < m; i++) {
                t = U.get(i, k + 1);
                U.set(i, k + 1, U.get(i, k));
                U.set(i, k, t);
              }
            }
            k++;
          }
          iter = 0;
          p--;
          break;
        }
        // no default
      }
    }

    if (swapped) {
      let tmp = V;
      V = U;
      U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
  }

  solve(value) {
    let Y = value;
    let e = this.threshold;
    let scols = this.s.length;
    let Ls = _matrix__WEBPACK_IMPORTED_MODULE_1__.default.zeros(scols, scols);

    for (let i = 0; i < scols; i++) {
      if (Math.abs(this.s[i]) <= e) {
        Ls.set(i, i, 0);
      } else {
        Ls.set(i, i, 1 / this.s[i]);
      }
    }

    let U = this.U;
    let V = this.rightSingularVectors;

    let VL = V.mmul(Ls);
    let vrows = V.rows;
    let urows = U.rows;
    let VLU = _matrix__WEBPACK_IMPORTED_MODULE_1__.default.zeros(vrows, urows);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < scols; k++) {
          sum += VL.get(i, k) * U.get(j, k);
        }
        VLU.set(i, j, sum);
      }
    }

    return VLU.mmul(Y);
  }

  solveForDiagonal(value) {
    return this.solve(_matrix__WEBPACK_IMPORTED_MODULE_1__.default.diag(value));
  }

  inverse() {
    let V = this.V;
    let e = this.threshold;
    let vrows = V.rows;
    let vcols = V.columns;
    let X = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(vrows, this.s.length);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < vcols; j++) {
        if (Math.abs(this.s[j]) > e) {
          X.set(i, j, V.get(i, j) / this.s[j]);
        }
      }
    }

    let U = this.U;

    let urows = U.rows;
    let ucols = U.columns;
    let Y = new _matrix__WEBPACK_IMPORTED_MODULE_1__.default(vrows, urows);

    for (let i = 0; i < vrows; i++) {
      for (let j = 0; j < urows; j++) {
        let sum = 0;
        for (let k = 0; k < ucols; k++) {
          sum += X.get(i, k) * U.get(j, k);
        }
        Y.set(i, j, sum);
      }
    }

    return Y;
  }

  get condition() {
    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
  }

  get norm2() {
    return this.s[0];
  }

  get rank() {
    let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
    let r = 0;
    let s = this.s;
    for (let i = 0, ii = s.length; i < ii; i++) {
      if (s[i] > tol) {
        r++;
      }
    }
    return r;
  }

  get diagonal() {
    return Array.from(this.s);
  }

  get threshold() {
    return (Number.EPSILON / 2) * Math.max(this.m, this.n) * this.s[0];
  }

  get leftSingularVectors() {
    return this.U;
  }

  get rightSingularVectors() {
    return this.V;
  }

  get diagonalMatrix() {
    return _matrix__WEBPACK_IMPORTED_MODULE_1__.default.diag(this.s);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/dc/util.js":
/*!***********************************************!*\
  !*** ./node_modules/ml-matrix/src/dc/util.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hypotenuse": () => (/* binding */ hypotenuse)
/* harmony export */ });
function hypotenuse(a, b) {
  let r = 0;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    return Math.abs(a) * Math.sqrt(1 + r * r);
  }
  if (b !== 0) {
    r = a / b;
    return Math.abs(b) * Math.sqrt(1 + r * r);
  }
  return 0;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/decompositions.js":
/*!******************************************************!*\
  !*** ./node_modules/ml-matrix/src/decompositions.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inverse": () => (/* binding */ inverse),
/* harmony export */   "solve": () => (/* binding */ solve)
/* harmony export */ });
/* harmony import */ var _dc_lu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dc/lu */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony import */ var _dc_qr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dc/qr */ "./node_modules/ml-matrix/src/dc/qr.js");
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");






function inverse(matrix, useSVD = false) {
  matrix = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);
  if (useSVD) {
    return new _dc_svd__WEBPACK_IMPORTED_MODULE_1__.default(matrix).inverse();
  } else {
    return solve(matrix, _matrix__WEBPACK_IMPORTED_MODULE_2__.default.eye(matrix.rows));
  }
}

function solve(leftHandSide, rightHandSide, useSVD = false) {
  leftHandSide = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(leftHandSide);
  rightHandSide = _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(rightHandSide);
  if (useSVD) {
    return new _dc_svd__WEBPACK_IMPORTED_MODULE_1__.default(leftHandSide).solve(rightHandSide);
  } else {
    return leftHandSide.isSquare()
      ? new _dc_lu__WEBPACK_IMPORTED_MODULE_3__.default(leftHandSide).solve(rightHandSide)
      : new _dc_qr__WEBPACK_IMPORTED_MODULE_4__.default(leftHandSide).solve(rightHandSide);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/determinant.js":
/*!***************************************************!*\
  !*** ./node_modules/ml-matrix/src/determinant.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "determinant": () => (/* binding */ determinant)
/* harmony export */ });
/* harmony import */ var _dc_lu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dc/lu */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _views_selection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/selection */ "./node_modules/ml-matrix/src/views/selection.js");




function determinant(matrix) {
  matrix = _matrix__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);
  if (matrix.isSquare()) {
    if (matrix.columns === 0) {
      return 1;
    }

    let a, b, c, d;
    if (matrix.columns === 2) {
      // 2 x 2 matrix
      a = matrix.get(0, 0);
      b = matrix.get(0, 1);
      c = matrix.get(1, 0);
      d = matrix.get(1, 1);

      return a * d - b * c;
    } else if (matrix.columns === 3) {
      // 3 x 3 matrix
      let subMatrix0, subMatrix1, subMatrix2;
      subMatrix0 = new _views_selection__WEBPACK_IMPORTED_MODULE_1__.default(matrix, [1, 2], [1, 2]);
      subMatrix1 = new _views_selection__WEBPACK_IMPORTED_MODULE_1__.default(matrix, [1, 2], [0, 2]);
      subMatrix2 = new _views_selection__WEBPACK_IMPORTED_MODULE_1__.default(matrix, [1, 2], [0, 1]);
      a = matrix.get(0, 0);
      b = matrix.get(0, 1);
      c = matrix.get(0, 2);

      return (
        a * determinant(subMatrix0) -
        b * determinant(subMatrix1) +
        c * determinant(subMatrix2)
      );
    } else {
      // general purpose determinant using the LU decomposition
      return new _dc_lu__WEBPACK_IMPORTED_MODULE_2__.default(matrix).determinant;
    }
  } else {
    throw Error('determinant can only be calculated for a square matrix');
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/index.js":
/*!*********************************************!*\
  !*** ./node_modules/ml-matrix/src/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbstractMatrix": () => (/* reexport safe */ _matrix__WEBPACK_IMPORTED_MODULE_0__.AbstractMatrix),
/* harmony export */   "default": () => (/* reexport safe */ _matrix__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Matrix": () => (/* reexport safe */ _matrix__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "MatrixColumnSelectionView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixColumnSelectionView),
/* harmony export */   "MatrixColumnView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixColumnView),
/* harmony export */   "MatrixFlipColumnView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixFlipColumnView),
/* harmony export */   "MatrixFlipRowView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixFlipRowView),
/* harmony export */   "MatrixRowSelectionView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixRowSelectionView),
/* harmony export */   "MatrixRowView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixRowView),
/* harmony export */   "MatrixSelectionView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixSelectionView),
/* harmony export */   "MatrixSubView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixSubView),
/* harmony export */   "MatrixTransposeView": () => (/* reexport safe */ _views_index__WEBPACK_IMPORTED_MODULE_1__.MatrixTransposeView),
/* harmony export */   "wrap": () => (/* reexport safe */ _wrap_wrap__WEBPACK_IMPORTED_MODULE_2__.wrap),
/* harmony export */   "WrapperMatrix1D": () => (/* reexport safe */ _wrap_WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "WrapperMatrix2D": () => (/* reexport safe */ _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "solve": () => (/* reexport safe */ _decompositions__WEBPACK_IMPORTED_MODULE_5__.solve),
/* harmony export */   "inverse": () => (/* reexport safe */ _decompositions__WEBPACK_IMPORTED_MODULE_5__.inverse),
/* harmony export */   "determinant": () => (/* reexport safe */ _determinant__WEBPACK_IMPORTED_MODULE_6__.determinant),
/* harmony export */   "linearDependencies": () => (/* reexport safe */ _linearDependencies__WEBPACK_IMPORTED_MODULE_7__.linearDependencies),
/* harmony export */   "pseudoInverse": () => (/* reexport safe */ _pseudoInverse__WEBPACK_IMPORTED_MODULE_8__.pseudoInverse),
/* harmony export */   "covariance": () => (/* reexport safe */ _covariance__WEBPACK_IMPORTED_MODULE_9__.covariance),
/* harmony export */   "correlation": () => (/* reexport safe */ _correlation__WEBPACK_IMPORTED_MODULE_10__.correlation),
/* harmony export */   "SingularValueDecomposition": () => (/* reexport safe */ _dc_svd_js__WEBPACK_IMPORTED_MODULE_11__.default),
/* harmony export */   "SVD": () => (/* reexport safe */ _dc_svd_js__WEBPACK_IMPORTED_MODULE_11__.default),
/* harmony export */   "EigenvalueDecomposition": () => (/* reexport safe */ _dc_evd_js__WEBPACK_IMPORTED_MODULE_12__.default),
/* harmony export */   "EVD": () => (/* reexport safe */ _dc_evd_js__WEBPACK_IMPORTED_MODULE_12__.default),
/* harmony export */   "CholeskyDecomposition": () => (/* reexport safe */ _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_13__.default),
/* harmony export */   "CHO": () => (/* reexport safe */ _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_13__.default),
/* harmony export */   "LuDecomposition": () => (/* reexport safe */ _dc_lu_js__WEBPACK_IMPORTED_MODULE_14__.default),
/* harmony export */   "LU": () => (/* reexport safe */ _dc_lu_js__WEBPACK_IMPORTED_MODULE_14__.default),
/* harmony export */   "QrDecomposition": () => (/* reexport safe */ _dc_qr_js__WEBPACK_IMPORTED_MODULE_15__.default),
/* harmony export */   "QR": () => (/* reexport safe */ _dc_qr_js__WEBPACK_IMPORTED_MODULE_15__.default),
/* harmony export */   "Nipals": () => (/* reexport safe */ _dc_nipals_js__WEBPACK_IMPORTED_MODULE_16__.default),
/* harmony export */   "NIPALS": () => (/* reexport safe */ _dc_nipals_js__WEBPACK_IMPORTED_MODULE_16__.default)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");
/* harmony import */ var _views_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/index */ "./node_modules/ml-matrix/src/views/index.js");
/* harmony import */ var _wrap_wrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wrap/wrap */ "./node_modules/ml-matrix/src/wrap/wrap.js");
/* harmony import */ var _wrap_WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wrap/WrapperMatrix1D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js");
/* harmony import */ var _wrap_WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wrap/WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");
/* harmony import */ var _decompositions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./decompositions */ "./node_modules/ml-matrix/src/decompositions.js");
/* harmony import */ var _determinant__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./determinant */ "./node_modules/ml-matrix/src/determinant.js");
/* harmony import */ var _linearDependencies__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./linearDependencies */ "./node_modules/ml-matrix/src/linearDependencies.js");
/* harmony import */ var _pseudoInverse__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pseudoInverse */ "./node_modules/ml-matrix/src/pseudoInverse.js");
/* harmony import */ var _covariance__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./covariance */ "./node_modules/ml-matrix/src/covariance.js");
/* harmony import */ var _correlation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./correlation */ "./node_modules/ml-matrix/src/correlation.js");
/* harmony import */ var _dc_svd_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dc/svd.js */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _dc_evd_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./dc/evd.js */ "./node_modules/ml-matrix/src/dc/evd.js");
/* harmony import */ var _dc_cholesky_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dc/cholesky.js */ "./node_modules/ml-matrix/src/dc/cholesky.js");
/* harmony import */ var _dc_lu_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./dc/lu.js */ "./node_modules/ml-matrix/src/dc/lu.js");
/* harmony import */ var _dc_qr_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./dc/qr.js */ "./node_modules/ml-matrix/src/dc/qr.js");
/* harmony import */ var _dc_nipals_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./dc/nipals.js */ "./node_modules/ml-matrix/src/dc/nipals.js");






















/***/ }),

/***/ "./node_modules/ml-matrix/src/inspect.js":
/*!***********************************************!*\
  !*** ./node_modules/ml-matrix/src/inspect.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inspectMatrix": () => (/* binding */ inspectMatrix),
/* harmony export */   "inspectMatrixWithOptions": () => (/* binding */ inspectMatrixWithOptions)
/* harmony export */ });
const indent = ' '.repeat(2);
const indentData = ' '.repeat(4);

function inspectMatrix() {
  return inspectMatrixWithOptions(this);
}

function inspectMatrixWithOptions(matrix, options = {}) {
  const { maxRows = 15, maxColumns = 10, maxNumSize = 8 } = options;
  return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
}

function inspectData(matrix, maxRows, maxColumns, maxNumSize) {
  const { rows, columns } = matrix;
  const maxI = Math.min(rows, maxRows);
  const maxJ = Math.min(columns, maxColumns);
  const result = [];
  for (let i = 0; i < maxI; i++) {
    let line = [];
    for (let j = 0; j < maxJ; j++) {
      line.push(formatNumber(matrix.get(i, j), maxNumSize));
    }
    result.push(`${line.join(' ')}`);
  }
  if (maxJ !== columns) {
    result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
  }
  if (maxI !== rows) {
    result.push(`... ${rows - maxRows} more rows`);
  }
  return result.join(`\n${indentData}`);
}

function formatNumber(num, maxNumSize) {
  const numStr = String(num);
  if (numStr.length <= maxNumSize) {
    return numStr.padEnd(maxNumSize, ' ');
  }
  const precise = num.toPrecision(maxNumSize - 2);
  if (precise.length <= maxNumSize) {
    return precise;
  }
  const exponential = num.toExponential(maxNumSize - 2);
  const eIndex = exponential.indexOf('e');
  const e = exponential.slice(eIndex);
  return exponential.slice(0, maxNumSize - e.length) + e;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/linearDependencies.js":
/*!**********************************************************!*\
  !*** ./node_modules/ml-matrix/src/linearDependencies.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "linearDependencies": () => (/* binding */ linearDependencies)
/* harmony export */ });
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");



function xrange(n, exception) {
  let range = [];
  for (let i = 0; i < n; i++) {
    if (i !== exception) {
      range.push(i);
    }
  }
  return range;
}

function dependenciesOneRow(
  error,
  matrix,
  index,
  thresholdValue = 10e-10,
  thresholdError = 10e-10,
) {
  if (error > thresholdError) {
    return new Array(matrix.rows + 1).fill(0);
  } else {
    let returnArray = matrix.addRow(index, [0]);
    for (let i = 0; i < returnArray.rows; i++) {
      if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
        returnArray.set(i, 0, 0);
      }
    }
    return returnArray.to1DArray();
  }
}

function linearDependencies(matrix, options = {}) {
  const { thresholdValue = 10e-10, thresholdError = 10e-10 } = options;
  matrix = _matrix__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);

  let n = matrix.rows;
  let results = new _matrix__WEBPACK_IMPORTED_MODULE_0__.default(n, n);

  for (let i = 0; i < n; i++) {
    let b = _matrix__WEBPACK_IMPORTED_MODULE_0__.default.columnVector(matrix.getRow(i));
    let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
    let svd = new _dc_svd__WEBPACK_IMPORTED_MODULE_1__.default(Abis);
    let x = svd.solve(b);
    let error = _matrix__WEBPACK_IMPORTED_MODULE_0__.default.sub(b, Abis.mmul(x)).abs().max();
    results.setRow(
      i,
      dependenciesOneRow(error, x, i, thresholdValue, thresholdError),
    );
  }
  return results;
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/mathOperations.js":
/*!******************************************************!*\
  !*** ./node_modules/ml-matrix/src/mathOperations.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "installMathOperations": () => (/* binding */ installMathOperations)
/* harmony export */ });
function installMathOperations(AbstractMatrix, Matrix) {
  AbstractMatrix.prototype.add = function add(value) {
    if (typeof value === 'number') return this.addS(value);
    return this.addM(value);
  };

  AbstractMatrix.prototype.addS = function addS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.addM = function addM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.add = function add(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.add(value);
  };

  AbstractMatrix.prototype.sub = function sub(value) {
    if (typeof value === 'number') return this.subS(value);
    return this.subM(value);
  };

  AbstractMatrix.prototype.subS = function subS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.subM = function subM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.sub = function sub(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sub(value);
  };
  AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
  AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
  AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
  AbstractMatrix.subtract = AbstractMatrix.sub;

  AbstractMatrix.prototype.mul = function mul(value) {
    if (typeof value === 'number') return this.mulS(value);
    return this.mulM(value);
  };

  AbstractMatrix.prototype.mulS = function mulS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.mulM = function mulM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.mul = function mul(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.mul(value);
  };
  AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
  AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
  AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
  AbstractMatrix.multiply = AbstractMatrix.mul;

  AbstractMatrix.prototype.div = function div(value) {
    if (typeof value === 'number') return this.divS(value);
    return this.divM(value);
  };

  AbstractMatrix.prototype.divS = function divS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.divM = function divM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.div = function div(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.div(value);
  };
  AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
  AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
  AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
  AbstractMatrix.divide = AbstractMatrix.div;

  AbstractMatrix.prototype.mod = function mod(value) {
    if (typeof value === 'number') return this.modS(value);
    return this.modM(value);
  };

  AbstractMatrix.prototype.modS = function modS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) % value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.modM = function modM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) % matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.mod = function mod(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.mod(value);
  };
  AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
  AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
  AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
  AbstractMatrix.modulus = AbstractMatrix.mod;

  AbstractMatrix.prototype.and = function and(value) {
    if (typeof value === 'number') return this.andS(value);
    return this.andM(value);
  };

  AbstractMatrix.prototype.andS = function andS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) & value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.andM = function andM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) & matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.and = function and(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.and(value);
  };

  AbstractMatrix.prototype.or = function or(value) {
    if (typeof value === 'number') return this.orS(value);
    return this.orM(value);
  };

  AbstractMatrix.prototype.orS = function orS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) | value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.orM = function orM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) | matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.or = function or(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.or(value);
  };

  AbstractMatrix.prototype.xor = function xor(value) {
    if (typeof value === 'number') return this.xorS(value);
    return this.xorM(value);
  };

  AbstractMatrix.prototype.xorS = function xorS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) ^ value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.xorM = function xorM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.xor = function xor(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.xor(value);
  };

  AbstractMatrix.prototype.leftShift = function leftShift(value) {
    if (typeof value === 'number') return this.leftShiftS(value);
    return this.leftShiftM(value);
  };

  AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) << value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) << matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.leftShift = function leftShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.leftShift(value);
  };

  AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
    if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
    return this.signPropagatingRightShiftM(value);
  };

  AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >> value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >> matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.signPropagatingRightShift(value);
  };

  AbstractMatrix.prototype.rightShift = function rightShift(value) {
    if (typeof value === 'number') return this.rightShiftS(value);
    return this.rightShiftM(value);
  };

  AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >>> value);
      }
    }
    return this;
  };

  AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
      }
    }
    return this;
  };

  AbstractMatrix.rightShift = function rightShift(matrix, value) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.rightShift(value);
  };
  AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
  AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
  AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
  AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

  AbstractMatrix.prototype.not = function not() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, ~(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.not = function not(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.not();
  };

  AbstractMatrix.prototype.abs = function abs() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.abs(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.abs = function abs(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.abs();
  };

  AbstractMatrix.prototype.acos = function acos() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.acos(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.acos = function acos(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.acos();
  };

  AbstractMatrix.prototype.acosh = function acosh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.acosh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.acosh = function acosh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.acosh();
  };

  AbstractMatrix.prototype.asin = function asin() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.asin(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.asin = function asin(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.asin();
  };

  AbstractMatrix.prototype.asinh = function asinh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.asinh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.asinh = function asinh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.asinh();
  };

  AbstractMatrix.prototype.atan = function atan() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.atan(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.atan = function atan(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.atan();
  };

  AbstractMatrix.prototype.atanh = function atanh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.atanh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.atanh = function atanh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.atanh();
  };

  AbstractMatrix.prototype.cbrt = function cbrt() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cbrt(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.cbrt = function cbrt(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cbrt();
  };

  AbstractMatrix.prototype.ceil = function ceil() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.ceil(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.ceil = function ceil(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.ceil();
  };

  AbstractMatrix.prototype.clz32 = function clz32() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.clz32(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.clz32 = function clz32(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.clz32();
  };

  AbstractMatrix.prototype.cos = function cos() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cos(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.cos = function cos(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cos();
  };

  AbstractMatrix.prototype.cosh = function cosh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.cosh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.cosh = function cosh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.cosh();
  };

  AbstractMatrix.prototype.exp = function exp() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.exp(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.exp = function exp(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.exp();
  };

  AbstractMatrix.prototype.expm1 = function expm1() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.expm1(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.expm1 = function expm1(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.expm1();
  };

  AbstractMatrix.prototype.floor = function floor() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.floor(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.floor = function floor(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.floor();
  };

  AbstractMatrix.prototype.fround = function fround() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.fround(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.fround = function fround(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.fround();
  };

  AbstractMatrix.prototype.log = function log() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.log = function log(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log();
  };

  AbstractMatrix.prototype.log1p = function log1p() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log1p(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.log1p = function log1p(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log1p();
  };

  AbstractMatrix.prototype.log10 = function log10() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log10(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.log10 = function log10(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log10();
  };

  AbstractMatrix.prototype.log2 = function log2() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.log2(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.log2 = function log2(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.log2();
  };

  AbstractMatrix.prototype.round = function round() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.round(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.round = function round(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.round();
  };

  AbstractMatrix.prototype.sign = function sign() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sign(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.sign = function sign(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sign();
  };

  AbstractMatrix.prototype.sin = function sin() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sin(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.sin = function sin(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sin();
  };

  AbstractMatrix.prototype.sinh = function sinh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sinh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.sinh = function sinh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sinh();
  };

  AbstractMatrix.prototype.sqrt = function sqrt() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.sqrt(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.sqrt = function sqrt(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.sqrt();
  };

  AbstractMatrix.prototype.tan = function tan() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.tan(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.tan = function tan(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.tan();
  };

  AbstractMatrix.prototype.tanh = function tanh() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.tanh(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.tanh = function tanh(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.tanh();
  };

  AbstractMatrix.prototype.trunc = function trunc() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.trunc(this.get(i, j)));
      }
    }
    return this;
  };

  AbstractMatrix.trunc = function trunc(matrix) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.trunc();
  };

  AbstractMatrix.pow = function pow(matrix, arg0) {
    const newMatrix = new Matrix(matrix);
    return newMatrix.pow(arg0);
  };

  AbstractMatrix.prototype.pow = function pow(value) {
    if (typeof value === 'number') return this.powS(value);
    return this.powM(value);
  };

  AbstractMatrix.prototype.powS = function powS(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.pow(this.get(i, j), value));
      }
    }
    return this;
  };

  AbstractMatrix.prototype.powM = function powM(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    if (this.rows !== matrix.rows ||
      this.columns !== matrix.columns) {
      throw new RangeError('Matrices dimensions must be equal');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, Math.pow(this.get(i, j), matrix.get(i, j)));
      }
    }
    return this;
  };
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/matrix.js":
/*!**********************************************!*\
  !*** ./node_modules/ml-matrix/src/matrix.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbstractMatrix": () => (/* binding */ AbstractMatrix),
/* harmony export */   "default": () => (/* binding */ Matrix)
/* harmony export */ });
/* harmony import */ var ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ml-array-rescale */ "./node_modules/ml-matrix/node_modules/ml-array-rescale/lib-es6/index.js");
/* harmony import */ var _inspect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inspect */ "./node_modules/ml-matrix/src/inspect.js");
/* harmony import */ var _mathOperations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mathOperations */ "./node_modules/ml-matrix/src/mathOperations.js");
/* harmony import */ var _stat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stat */ "./node_modules/ml-matrix/src/stat.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/util.js");







class AbstractMatrix {
  static from1DArray(newRows, newColumns, newData) {
    let length = newRows * newColumns;
    if (length !== newData.length) {
      throw new RangeError('data length does not match given dimensions');
    }
    let newMatrix = new Matrix(newRows, newColumns);
    for (let row = 0; row < newRows; row++) {
      for (let column = 0; column < newColumns; column++) {
        newMatrix.set(row, column, newData[row * newColumns + column]);
      }
    }
    return newMatrix;
  }

  static rowVector(newData) {
    let vector = new Matrix(1, newData.length);
    for (let i = 0; i < newData.length; i++) {
      vector.set(0, i, newData[i]);
    }
    return vector;
  }

  static columnVector(newData) {
    let vector = new Matrix(newData.length, 1);
    for (let i = 0; i < newData.length; i++) {
      vector.set(i, 0, newData[i]);
    }
    return vector;
  }

  static zeros(rows, columns) {
    return new Matrix(rows, columns);
  }

  static ones(rows, columns) {
    return new Matrix(rows, columns).fill(1);
  }

  static rand(rows, columns, options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { random = Math.random } = options;
    let matrix = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        matrix.set(i, j, random());
      }
    }
    return matrix;
  }

  static randInt(rows, columns, options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { min = 0, max = 1000, random = Math.random } = options;
    if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
    if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let interval = max - min;
    let matrix = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let value = min + Math.round(random() * interval);
        matrix.set(i, j, value);
      }
    }
    return matrix;
  }

  static eye(rows, columns, value) {
    if (columns === undefined) columns = rows;
    if (value === undefined) value = 1;
    let min = Math.min(rows, columns);
    let matrix = this.zeros(rows, columns);
    for (let i = 0; i < min; i++) {
      matrix.set(i, i, value);
    }
    return matrix;
  }

  static diag(data, rows, columns) {
    let l = data.length;
    if (rows === undefined) rows = l;
    if (columns === undefined) columns = rows;
    let min = Math.min(l, rows, columns);
    let matrix = this.zeros(rows, columns);
    for (let i = 0; i < min; i++) {
      matrix.set(i, i, data[i]);
    }
    return matrix;
  }

  static min(matrix1, matrix2) {
    matrix1 = this.checkMatrix(matrix1);
    matrix2 = this.checkMatrix(matrix2);
    let rows = matrix1.rows;
    let columns = matrix1.columns;
    let result = new Matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
      }
    }
    return result;
  }

  static max(matrix1, matrix2) {
    matrix1 = this.checkMatrix(matrix1);
    matrix2 = this.checkMatrix(matrix2);
    let rows = matrix1.rows;
    let columns = matrix1.columns;
    let result = new this(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
      }
    }
    return result;
  }

  static checkMatrix(value) {
    return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
  }

  static isMatrix(value) {
    return value != null && value.klass === 'Matrix';
  }

  get size() {
    return this.rows * this.columns;
  }

  apply(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        callback.call(this, i, j);
      }
    }
    return this;
  }

  to1DArray() {
    let array = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        array.push(this.get(i, j));
      }
    }
    return array;
  }

  to2DArray() {
    let copy = [];
    for (let i = 0; i < this.rows; i++) {
      copy.push([]);
      for (let j = 0; j < this.columns; j++) {
        copy[i].push(this.get(i, j));
      }
    }
    return copy;
  }

  toJSON() {
    return this.to2DArray();
  }

  isRowVector() {
    return this.rows === 1;
  }

  isColumnVector() {
    return this.columns === 1;
  }

  isVector() {
    return this.rows === 1 || this.columns === 1;
  }

  isSquare() {
    return this.rows === this.columns;
  }

  isEmpty() {
    return this.rows === 0 || this.columns === 0;
  }

  isSymmetric() {
    if (this.isSquare()) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j <= i; j++) {
          if (this.get(i, j) !== this.get(j, i)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  isEchelonForm() {
    let i = 0;
    let j = 0;
    let previousColumn = -1;
    let isEchelonForm = true;
    let checked = false;
    while (i < this.rows && isEchelonForm) {
      j = 0;
      checked = false;
      while (j < this.columns && checked === false) {
        if (this.get(i, j) === 0) {
          j++;
        } else if (this.get(i, j) === 1 && j > previousColumn) {
          checked = true;
          previousColumn = j;
        } else {
          isEchelonForm = false;
          checked = true;
        }
      }
      i++;
    }
    return isEchelonForm;
  }

  isReducedEchelonForm() {
    let i = 0;
    let j = 0;
    let previousColumn = -1;
    let isReducedEchelonForm = true;
    let checked = false;
    while (i < this.rows && isReducedEchelonForm) {
      j = 0;
      checked = false;
      while (j < this.columns && checked === false) {
        if (this.get(i, j) === 0) {
          j++;
        } else if (this.get(i, j) === 1 && j > previousColumn) {
          checked = true;
          previousColumn = j;
        } else {
          isReducedEchelonForm = false;
          checked = true;
        }
      }
      for (let k = j + 1; k < this.rows; k++) {
        if (this.get(i, k) !== 0) {
          isReducedEchelonForm = false;
        }
      }
      i++;
    }
    return isReducedEchelonForm;
  }

  echelonForm() {
    let result = this.clone();
    let h = 0;
    let k = 0;
    while (h < result.rows && k < result.columns) {
      let iMax = h;
      for (let i = h; i < result.rows; i++) {
        if (result.get(i, k) > result.get(iMax, k)) {
          iMax = i;
        }
      }
      if (result.get(iMax, k) === 0) {
        k++;
      } else {
        result.swapRows(h, iMax);
        let tmp = result.get(h, k);
        for (let j = k; j < result.columns; j++) {
          result.set(h, j, result.get(h, j) / tmp);
        }
        for (let i = h + 1; i < result.rows; i++) {
          let factor = result.get(i, k) / result.get(h, k);
          result.set(i, k, 0);
          for (let j = k + 1; j < result.columns; j++) {
            result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
          }
        }
        h++;
        k++;
      }
    }
    return result;
  }

  reducedEchelonForm() {
    let result = this.echelonForm();
    let m = result.columns;
    let n = result.rows;
    let h = n - 1;
    while (h >= 0) {
      if (result.maxRow(h) === 0) {
        h--;
      } else {
        let p = 0;
        let pivot = false;
        while (p < n && pivot === false) {
          if (result.get(h, p) === 1) {
            pivot = true;
          } else {
            p++;
          }
        }
        for (let i = 0; i < h; i++) {
          let factor = result.get(i, p);
          for (let j = p; j < m; j++) {
            let tmp = result.get(i, j) - factor * result.get(h, j);
            result.set(i, j, tmp);
          }
        }
        h--;
      }
    }
    return result;
  }

  set() {
    throw new Error('set method is unimplemented');
  }

  get() {
    throw new Error('get method is unimplemented');
  }

  repeat(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { rows = 1, columns = 1 } = options;
    if (!Number.isInteger(rows) || rows <= 0) {
      throw new TypeError('rows must be a positive integer');
    }
    if (!Number.isInteger(columns) || columns <= 0) {
      throw new TypeError('columns must be a positive integer');
    }
    let matrix = new Matrix(this.rows * rows, this.columns * columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        matrix.setSubMatrix(this, this.rows * i, this.columns * j);
      }
    }
    return matrix;
  }

  fill(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, value);
      }
    }
    return this;
  }

  neg() {
    return this.mulS(-1);
  }

  getRow(index) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, index);
    let row = [];
    for (let i = 0; i < this.columns; i++) {
      row.push(this.get(index, i));
    }
    return row;
  }

  getRowVector(index) {
    return Matrix.rowVector(this.getRow(index));
  }

  setRow(index, array) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, index);
    array = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, array);
    for (let i = 0; i < this.columns; i++) {
      this.set(index, i, array[i]);
    }
    return this;
  }

  swapRows(row1, row2) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row1);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row2);
    for (let i = 0; i < this.columns; i++) {
      let temp = this.get(row1, i);
      this.set(row1, i, this.get(row2, i));
      this.set(row2, i, temp);
    }
    return this;
  }

  getColumn(index) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, index);
    let column = [];
    for (let i = 0; i < this.rows; i++) {
      column.push(this.get(i, index));
    }
    return column;
  }

  getColumnVector(index) {
    return Matrix.columnVector(this.getColumn(index));
  }

  setColumn(index, array) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, index);
    array = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, array);
    for (let i = 0; i < this.rows; i++) {
      this.set(i, index, array[i]);
    }
    return this;
  }

  swapColumns(column1, column2) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column1);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column2);
    for (let i = 0; i < this.rows; i++) {
      let temp = this.get(i, column1);
      this.set(i, column1, this.get(i, column2));
      this.set(i, column2, temp);
    }
    return this;
  }

  addRowVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + vector[j]);
      }
    }
    return this;
  }

  subRowVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - vector[j]);
      }
    }
    return this;
  }

  mulRowVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * vector[j]);
      }
    }
    return this;
  }

  divRowVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / vector[j]);
      }
    }
    return this;
  }

  addColumnVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) + vector[i]);
      }
    }
    return this;
  }

  subColumnVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) - vector[i]);
      }
    }
    return this;
  }

  mulColumnVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) * vector[i]);
      }
    }
    return this;
  }

  divColumnVector(vector) {
    vector = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, vector);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.set(i, j, this.get(i, j) / vector[i]);
      }
    }
    return this;
  }

  mulRow(index, value) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, index);
    for (let i = 0; i < this.columns; i++) {
      this.set(index, i, this.get(index, i) * value);
    }
    return this;
  }

  mulColumn(index, value) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, index);
    for (let i = 0; i < this.rows; i++) {
      this.set(i, index, this.get(i, index) * value);
    }
    return this;
  }

  max() {
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, 0);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) > v) {
          v = this.get(i, j);
        }
      }
    }
    return v;
  }

  maxIndex() {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(0, 0);
    let idx = [0, 0];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) > v) {
          v = this.get(i, j);
          idx[0] = i;
          idx[1] = j;
        }
      }
    }
    return idx;
  }

  min() {
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, 0);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) < v) {
          v = this.get(i, j);
        }
      }
    }
    return v;
  }

  minIndex() {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(0, 0);
    let idx = [0, 0];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.get(i, j) < v) {
          v = this.get(i, j);
          idx[0] = i;
          idx[1] = j;
        }
      }
    }
    return idx;
  }

  maxRow(row) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(row, 0);
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) > v) {
        v = this.get(row, i);
      }
    }
    return v;
  }

  maxRowIndex(row) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(row, 0);
    let idx = [row, 0];
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) > v) {
        v = this.get(row, i);
        idx[1] = i;
      }
    }
    return idx;
  }

  minRow(row) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(row, 0);
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) < v) {
        v = this.get(row, i);
      }
    }
    return v;
  }

  minRowIndex(row) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, row);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(row, 0);
    let idx = [row, 0];
    for (let i = 1; i < this.columns; i++) {
      if (this.get(row, i) < v) {
        v = this.get(row, i);
        idx[1] = i;
      }
    }
    return idx;
  }

  maxColumn(column) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, column);
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) > v) {
        v = this.get(i, column);
      }
    }
    return v;
  }

  maxColumnIndex(column) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(0, column);
    let idx = [0, column];
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) > v) {
        v = this.get(i, column);
        idx[0] = i;
      }
    }
    return idx;
  }

  minColumn(column) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column);
    if (this.isEmpty()) {
      return NaN;
    }
    let v = this.get(0, column);
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) < v) {
        v = this.get(i, column);
      }
    }
    return v;
  }

  minColumnIndex(column) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, column);
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkNonEmpty)(this);
    let v = this.get(0, column);
    let idx = [0, column];
    for (let i = 1; i < this.rows; i++) {
      if (this.get(i, column) < v) {
        v = this.get(i, column);
        idx[0] = i;
      }
    }
    return idx;
  }

  diag() {
    let min = Math.min(this.rows, this.columns);
    let diag = [];
    for (let i = 0; i < min; i++) {
      diag.push(this.get(i, i));
    }
    return diag;
  }

  norm(type = 'frobenius') {
    let result = 0;
    if (type === 'max') {
      return this.max();
    } else if (type === 'frobenius') {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          result = result + this.get(i, j) * this.get(i, j);
        }
      }
      return Math.sqrt(result);
    } else {
      throw new RangeError(`unknown norm type: ${type}`);
    }
  }

  cumulativeSum() {
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        sum += this.get(i, j);
        this.set(i, j, sum);
      }
    }
    return this;
  }

  dot(vector2) {
    if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
    let vector1 = this.to1DArray();
    if (vector1.length !== vector2.length) {
      throw new RangeError('vectors do not have the same size');
    }
    let dot = 0;
    for (let i = 0; i < vector1.length; i++) {
      dot += vector1[i] * vector2[i];
    }
    return dot;
  }

  mmul(other) {
    other = Matrix.checkMatrix(other);

    let m = this.rows;
    let n = this.columns;
    let p = other.columns;

    let result = new Matrix(m, p);

    let Bcolj = new Float64Array(n);
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        Bcolj[k] = other.get(k, j);
      }

      for (let i = 0; i < m; i++) {
        let s = 0;
        for (let k = 0; k < n; k++) {
          s += this.get(i, k) * Bcolj[k];
        }

        result.set(i, j, s);
      }
    }
    return result;
  }

  strassen2x2(other) {
    other = Matrix.checkMatrix(other);
    let result = new Matrix(2, 2);
    const a11 = this.get(0, 0);
    const b11 = other.get(0, 0);
    const a12 = this.get(0, 1);
    const b12 = other.get(0, 1);
    const a21 = this.get(1, 0);
    const b21 = other.get(1, 0);
    const a22 = this.get(1, 1);
    const b22 = other.get(1, 1);

    // Compute intermediate values.
    const m1 = (a11 + a22) * (b11 + b22);
    const m2 = (a21 + a22) * b11;
    const m3 = a11 * (b12 - b22);
    const m4 = a22 * (b21 - b11);
    const m5 = (a11 + a12) * b22;
    const m6 = (a21 - a11) * (b11 + b12);
    const m7 = (a12 - a22) * (b21 + b22);

    // Combine intermediate values into the output.
    const c00 = m1 + m4 - m5 + m7;
    const c01 = m3 + m5;
    const c10 = m2 + m4;
    const c11 = m1 - m2 + m3 + m6;

    result.set(0, 0, c00);
    result.set(0, 1, c01);
    result.set(1, 0, c10);
    result.set(1, 1, c11);
    return result;
  }

  strassen3x3(other) {
    other = Matrix.checkMatrix(other);
    let result = new Matrix(3, 3);

    const a00 = this.get(0, 0);
    const a01 = this.get(0, 1);
    const a02 = this.get(0, 2);
    const a10 = this.get(1, 0);
    const a11 = this.get(1, 1);
    const a12 = this.get(1, 2);
    const a20 = this.get(2, 0);
    const a21 = this.get(2, 1);
    const a22 = this.get(2, 2);

    const b00 = other.get(0, 0);
    const b01 = other.get(0, 1);
    const b02 = other.get(0, 2);
    const b10 = other.get(1, 0);
    const b11 = other.get(1, 1);
    const b12 = other.get(1, 2);
    const b20 = other.get(2, 0);
    const b21 = other.get(2, 1);
    const b22 = other.get(2, 2);

    const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
    const m2 = (a00 - a10) * (-b01 + b11);
    const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
    const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
    const m5 = (a10 + a11) * (-b00 + b01);
    const m6 = a00 * b00;
    const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
    const m8 = (-a00 + a20) * (b02 - b12);
    const m9 = (a20 + a21) * (-b00 + b02);
    const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
    const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
    const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
    const m13 = (a02 - a22) * (b11 - b21);
    const m14 = a02 * b20;
    const m15 = (a21 + a22) * (-b20 + b21);
    const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
    const m17 = (a02 - a12) * (b12 - b22);
    const m18 = (a11 + a12) * (-b20 + b22);
    const m19 = a01 * b10;
    const m20 = a12 * b21;
    const m21 = a10 * b02;
    const m22 = a20 * b01;
    const m23 = a22 * b22;

    const c00 = m6 + m14 + m19;
    const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
    const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
    const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
    const c11 = m2 + m4 + m5 + m6 + m20;
    const c12 = m14 + m16 + m17 + m18 + m21;
    const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
    const c21 = m12 + m13 + m14 + m15 + m22;
    const c22 = m6 + m7 + m8 + m9 + m23;

    result.set(0, 0, c00);
    result.set(0, 1, c01);
    result.set(0, 2, c02);
    result.set(1, 0, c10);
    result.set(1, 1, c11);
    result.set(1, 2, c12);
    result.set(2, 0, c20);
    result.set(2, 1, c21);
    result.set(2, 2, c22);
    return result;
  }

  mmulStrassen(y) {
    y = Matrix.checkMatrix(y);
    let x = this.clone();
    let r1 = x.rows;
    let c1 = x.columns;
    let r2 = y.rows;
    let c2 = y.columns;
    if (c1 !== r2) {
      // eslint-disable-next-line no-console
      console.warn(
        `Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`,
      );
    }

    // Put a matrix into the top left of a matrix of zeros.
    // `rows` and `cols` are the dimensions of the output matrix.
    function embed(mat, rows, cols) {
      let r = mat.rows;
      let c = mat.columns;
      if (r === rows && c === cols) {
        return mat;
      } else {
        let resultat = AbstractMatrix.zeros(rows, cols);
        resultat = resultat.setSubMatrix(mat, 0, 0);
        return resultat;
      }
    }

    // Make sure both matrices are the same size.
    // This is exclusively for simplicity:
    // this algorithm can be implemented with matrices of different sizes.

    let r = Math.max(r1, r2);
    let c = Math.max(c1, c2);
    x = embed(x, r, c);
    y = embed(y, r, c);

    // Our recursive multiplication function.
    function blockMult(a, b, rows, cols) {
      // For small matrices, resort to naive multiplication.
      if (rows <= 512 || cols <= 512) {
        return a.mmul(b); // a is equivalent to this
      }

      // Apply dynamic padding.
      if (rows % 2 === 1 && cols % 2 === 1) {
        a = embed(a, rows + 1, cols + 1);
        b = embed(b, rows + 1, cols + 1);
      } else if (rows % 2 === 1) {
        a = embed(a, rows + 1, cols);
        b = embed(b, rows + 1, cols);
      } else if (cols % 2 === 1) {
        a = embed(a, rows, cols + 1);
        b = embed(b, rows, cols + 1);
      }

      let halfRows = parseInt(a.rows / 2, 10);
      let halfCols = parseInt(a.columns / 2, 10);
      // Subdivide input matrices.
      let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
      let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

      let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
      let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

      let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
      let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

      let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
      let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

      // Compute intermediate values.
      let m1 = blockMult(
        AbstractMatrix.add(a11, a22),
        AbstractMatrix.add(b11, b22),
        halfRows,
        halfCols,
      );
      let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
      let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
      let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
      let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
      let m6 = blockMult(
        AbstractMatrix.sub(a21, a11),
        AbstractMatrix.add(b11, b12),
        halfRows,
        halfCols,
      );
      let m7 = blockMult(
        AbstractMatrix.sub(a12, a22),
        AbstractMatrix.add(b21, b22),
        halfRows,
        halfCols,
      );

      // Combine intermediate values into the output.
      let c11 = AbstractMatrix.add(m1, m4);
      c11.sub(m5);
      c11.add(m7);
      let c12 = AbstractMatrix.add(m3, m5);
      let c21 = AbstractMatrix.add(m2, m4);
      let c22 = AbstractMatrix.sub(m1, m2);
      c22.add(m3);
      c22.add(m6);

      // Crop output to the desired size (undo dynamic padding).
      let resultat = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
      resultat = resultat.setSubMatrix(c11, 0, 0);
      resultat = resultat.setSubMatrix(c12, c11.rows, 0);
      resultat = resultat.setSubMatrix(c21, 0, c11.columns);
      resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
      return resultat.subMatrix(0, rows - 1, 0, cols - 1);
    }
    return blockMult(x, y, r, c);
  }

  scaleRows(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { min = 0, max = 1 } = options;
    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.rows; i++) {
      const row = this.getRow(i);
      if (row.length > 0) {
        (0,ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__.default)(row, { min, max, output: row });
      }
      newMatrix.setRow(i, row);
    }
    return newMatrix;
  }

  scaleColumns(options = {}) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { min = 0, max = 1 } = options;
    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
    if (min >= max) throw new RangeError('min must be smaller than max');
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.columns; i++) {
      const column = this.getColumn(i);
      if (column.length) {
        (0,ml_array_rescale__WEBPACK_IMPORTED_MODULE_0__.default)(column, {
          min: min,
          max: max,
          output: column,
        });
      }
      newMatrix.setColumn(i, column);
    }
    return newMatrix;
  }

  flipRows() {
    const middle = Math.ceil(this.columns / 2);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < middle; j++) {
        let first = this.get(i, j);
        let last = this.get(i, this.columns - 1 - j);
        this.set(i, j, last);
        this.set(i, this.columns - 1 - j, first);
      }
    }
    return this;
  }

  flipColumns() {
    const middle = Math.ceil(this.rows / 2);
    for (let j = 0; j < this.columns; j++) {
      for (let i = 0; i < middle; i++) {
        let first = this.get(i, j);
        let last = this.get(this.rows - 1 - i, j);
        this.set(i, j, last);
        this.set(this.rows - 1 - i, j, first);
      }
    }
    return this;
  }

  kroneckerProduct(other) {
    other = Matrix.checkMatrix(other);

    let m = this.rows;
    let n = this.columns;
    let p = other.rows;
    let q = other.columns;

    let result = new Matrix(m * p, n * q);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < p; k++) {
          for (let l = 0; l < q; l++) {
            result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
          }
        }
      }
    }
    return result;
  }

  transpose() {
    let result = new Matrix(this.columns, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }

  sortRows(compareFunction = compareNumbers) {
    for (let i = 0; i < this.rows; i++) {
      this.setRow(i, this.getRow(i).sort(compareFunction));
    }
    return this;
  }

  sortColumns(compareFunction = compareNumbers) {
    for (let i = 0; i < this.columns; i++) {
      this.setColumn(i, this.getColumn(i).sort(compareFunction));
    }
    return this;
  }

  subMatrix(startRow, endRow, startColumn, endColumn) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRange)(this, startRow, endRow, startColumn, endColumn);
    let newMatrix = new Matrix(
      endRow - startRow + 1,
      endColumn - startColumn + 1,
    );
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startColumn; j <= endColumn; j++) {
        newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
      }
    }
    return newMatrix;
  }

  subMatrixRow(indices, startColumn, endColumn) {
    if (startColumn === undefined) startColumn = 0;
    if (endColumn === undefined) endColumn = this.columns - 1;
    if (
      startColumn > endColumn ||
      startColumn < 0 ||
      startColumn >= this.columns ||
      endColumn < 0 ||
      endColumn >= this.columns
    ) {
      throw new RangeError('Argument out of range');
    }

    let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);
    for (let i = 0; i < indices.length; i++) {
      for (let j = startColumn; j <= endColumn; j++) {
        if (indices[i] < 0 || indices[i] >= this.rows) {
          throw new RangeError(`Row index out of range: ${indices[i]}`);
        }
        newMatrix.set(i, j - startColumn, this.get(indices[i], j));
      }
    }
    return newMatrix;
  }

  subMatrixColumn(indices, startRow, endRow) {
    if (startRow === undefined) startRow = 0;
    if (endRow === undefined) endRow = this.rows - 1;
    if (
      startRow > endRow ||
      startRow < 0 ||
      startRow >= this.rows ||
      endRow < 0 ||
      endRow >= this.rows
    ) {
      throw new RangeError('Argument out of range');
    }

    let newMatrix = new Matrix(endRow - startRow + 1, indices.length);
    for (let i = 0; i < indices.length; i++) {
      for (let j = startRow; j <= endRow; j++) {
        if (indices[i] < 0 || indices[i] >= this.columns) {
          throw new RangeError(`Column index out of range: ${indices[i]}`);
        }
        newMatrix.set(j - startRow, i, this.get(j, indices[i]));
      }
    }
    return newMatrix;
  }

  setSubMatrix(matrix, startRow, startColumn) {
    matrix = Matrix.checkMatrix(matrix);
    if (matrix.isEmpty()) {
      return this;
    }
    let endRow = startRow + matrix.rows - 1;
    let endColumn = startColumn + matrix.columns - 1;
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRange)(this, startRow, endRow, startColumn, endColumn);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        this.set(startRow + i, startColumn + j, matrix.get(i, j));
      }
    }
    return this;
  }

  selection(rowIndices, columnIndices) {
    let indices = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkIndices)(this, rowIndices, columnIndices);
    let newMatrix = new Matrix(rowIndices.length, columnIndices.length);
    for (let i = 0; i < indices.row.length; i++) {
      let rowIndex = indices.row[i];
      for (let j = 0; j < indices.column.length; j++) {
        let columnIndex = indices.column[j];
        newMatrix.set(i, j, this.get(rowIndex, columnIndex));
      }
    }
    return newMatrix;
  }

  trace() {
    let min = Math.min(this.rows, this.columns);
    let trace = 0;
    for (let i = 0; i < min; i++) {
      trace += this.get(i, i);
    }
    return trace;
  }

  clone() {
    let newMatrix = new Matrix(this.rows, this.columns);
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        newMatrix.set(row, column, this.get(row, column));
      }
    }
    return newMatrix;
  }

  sum(by) {
    switch (by) {
      case 'row':
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.sumByRow)(this);
      case 'column':
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.sumByColumn)(this);
      case undefined:
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.sumAll)(this);
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  product(by) {
    switch (by) {
      case 'row':
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.productByRow)(this);
      case 'column':
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.productByColumn)(this);
      case undefined:
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.productAll)(this);
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  mean(by) {
    const sum = this.sum(by);
    switch (by) {
      case 'row': {
        for (let i = 0; i < this.rows; i++) {
          sum[i] /= this.columns;
        }
        return sum;
      }
      case 'column': {
        for (let i = 0; i < this.columns; i++) {
          sum[i] /= this.rows;
        }
        return sum;
      }
      case undefined:
        return sum / this.size;
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  variance(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { unbiased = true, mean = this.mean(by) } = options;
    if (typeof unbiased !== 'boolean') {
      throw new TypeError('unbiased must be a boolean');
    }
    switch (by) {
      case 'row': {
        if (!Array.isArray(mean)) {
          throw new TypeError('mean must be an array');
        }
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.varianceByRow)(this, unbiased, mean);
      }
      case 'column': {
        if (!Array.isArray(mean)) {
          throw new TypeError('mean must be an array');
        }
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.varianceByColumn)(this, unbiased, mean);
      }
      case undefined: {
        if (typeof mean !== 'number') {
          throw new TypeError('mean must be a number');
        }
        return (0,_stat__WEBPACK_IMPORTED_MODULE_2__.varianceAll)(this, unbiased, mean);
      }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  standardDeviation(by, options) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    const variance = this.variance(by, options);
    if (by === undefined) {
      return Math.sqrt(variance);
    } else {
      for (let i = 0; i < variance.length; i++) {
        variance[i] = Math.sqrt(variance[i]);
      }
      return variance;
    }
  }

  center(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const { center = this.mean(by) } = options;
    switch (by) {
      case 'row': {
        if (!Array.isArray(center)) {
          throw new TypeError('center must be an array');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.centerByRow)(this, center);
        return this;
      }
      case 'column': {
        if (!Array.isArray(center)) {
          throw new TypeError('center must be an array');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.centerByColumn)(this, center);
        return this;
      }
      case undefined: {
        if (typeof center !== 'number') {
          throw new TypeError('center must be a number');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.centerAll)(this, center);
        return this;
      }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  scale(by, options = {}) {
    if (typeof by === 'object') {
      options = by;
      by = undefined;
    }
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    let scale = options.scale;
    switch (by) {
      case 'row': {
        if (scale === undefined) {
          scale = (0,_stat__WEBPACK_IMPORTED_MODULE_2__.getScaleByRow)(this);
        } else if (!Array.isArray(scale)) {
          throw new TypeError('scale must be an array');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.scaleByRow)(this, scale);
        return this;
      }
      case 'column': {
        if (scale === undefined) {
          scale = (0,_stat__WEBPACK_IMPORTED_MODULE_2__.getScaleByColumn)(this);
        } else if (!Array.isArray(scale)) {
          throw new TypeError('scale must be an array');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.scaleByColumn)(this, scale);
        return this;
      }
      case undefined: {
        if (scale === undefined) {
          scale = (0,_stat__WEBPACK_IMPORTED_MODULE_2__.getScaleAll)(this);
        } else if (typeof scale !== 'number') {
          throw new TypeError('scale must be a number');
        }
        (0,_stat__WEBPACK_IMPORTED_MODULE_2__.scaleAll)(this, scale);
        return this;
      }
      default:
        throw new Error(`invalid option: ${by}`);
    }
  }

  toString(options) {
    return (0,_inspect__WEBPACK_IMPORTED_MODULE_3__.inspectMatrixWithOptions)(this, options);
  }
}

AbstractMatrix.prototype.klass = 'Matrix';
if (typeof Symbol !== 'undefined') {
  AbstractMatrix.prototype[
    Symbol.for('nodejs.util.inspect.custom')
  ] = _inspect__WEBPACK_IMPORTED_MODULE_3__.inspectMatrix;
}

function compareNumbers(a, b) {
  return a - b;
}

// Synonyms
AbstractMatrix.random = AbstractMatrix.rand;
AbstractMatrix.randomInt = AbstractMatrix.randInt;
AbstractMatrix.diagonal = AbstractMatrix.diag;
AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
AbstractMatrix.identity = AbstractMatrix.eye;
AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
AbstractMatrix.prototype.tensorProduct =
  AbstractMatrix.prototype.kroneckerProduct;

class Matrix extends AbstractMatrix {
  constructor(nRows, nColumns) {
    super();
    if (Matrix.isMatrix(nRows)) {
      // eslint-disable-next-line no-constructor-return
      return nRows.clone();
    } else if (Number.isInteger(nRows) && nRows >= 0) {
      // Create an empty matrix
      this.data = [];
      if (Number.isInteger(nColumns) && nColumns >= 0) {
        for (let i = 0; i < nRows; i++) {
          this.data.push(new Float64Array(nColumns));
        }
      } else {
        throw new TypeError('nColumns must be a positive integer');
      }
    } else if (Array.isArray(nRows)) {
      // Copy the values from the 2D array
      const arrayData = nRows;
      nRows = arrayData.length;
      nColumns = nRows ? arrayData[0].length : 0;
      if (typeof nColumns !== 'number') {
        throw new TypeError(
          'Data must be a 2D array with at least one element',
        );
      }
      this.data = [];
      for (let i = 0; i < nRows; i++) {
        if (arrayData[i].length !== nColumns) {
          throw new RangeError('Inconsistent array dimensions');
        }
        this.data.push(Float64Array.from(arrayData[i]));
      }
    } else {
      throw new TypeError(
        'First argument must be a positive number or an array',
      );
    }
    this.rows = nRows;
    this.columns = nColumns;
  }

  set(rowIndex, columnIndex, value) {
    this.data[rowIndex][columnIndex] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.data[rowIndex][columnIndex];
  }

  removeRow(index) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, index);
    this.data.splice(index, 1);
    this.rows -= 1;
    return this;
  }

  addRow(index, array) {
    if (array === undefined) {
      array = index;
      index = this.rows;
    }
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(this, index, true);
    array = Float64Array.from((0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowVector)(this, array));
    this.data.splice(index, 0, array);
    this.rows += 1;
    return this;
  }

  removeColumn(index) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, index);
    for (let i = 0; i < this.rows; i++) {
      const newRow = new Float64Array(this.columns - 1);
      for (let j = 0; j < index; j++) {
        newRow[j] = this.data[i][j];
      }
      for (let j = index + 1; j < this.columns; j++) {
        newRow[j - 1] = this.data[i][j];
      }
      this.data[i] = newRow;
    }
    this.columns -= 1;
    return this;
  }

  addColumn(index, array) {
    if (typeof array === 'undefined') {
      array = index;
      index = this.columns;
    }
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(this, index, true);
    array = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnVector)(this, array);
    for (let i = 0; i < this.rows; i++) {
      const newRow = new Float64Array(this.columns + 1);
      let j = 0;
      for (; j < index; j++) {
        newRow[j] = this.data[i][j];
      }
      newRow[j++] = array[i];
      for (; j < this.columns + 1; j++) {
        newRow[j] = this.data[i][j - 1];
      }
      this.data[i] = newRow;
    }
    this.columns += 1;
    return this;
  }
}

(0,_mathOperations__WEBPACK_IMPORTED_MODULE_4__.installMathOperations)(AbstractMatrix, Matrix);


/***/ }),

/***/ "./node_modules/ml-matrix/src/pseudoInverse.js":
/*!*****************************************************!*\
  !*** ./node_modules/ml-matrix/src/pseudoInverse.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pseudoInverse": () => (/* binding */ pseudoInverse)
/* harmony export */ });
/* harmony import */ var _dc_svd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dc/svd */ "./node_modules/ml-matrix/src/dc/svd.js");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/ml-matrix/src/matrix.js");



function pseudoInverse(matrix, threshold = Number.EPSILON) {
  matrix = _matrix__WEBPACK_IMPORTED_MODULE_0__.default.checkMatrix(matrix);
  if (matrix.isEmpty()) {
    // with a zero dimension, the pseudo-inverse is the transpose, since all 0xn and nx0 matrices are singular
    // (0xn)*(nx0)*(0xn) = 0xn
    // (nx0)*(0xn)*(nx0) = nx0
    return matrix.transpose();
  }
  let svdSolution = new _dc_svd__WEBPACK_IMPORTED_MODULE_1__.default(matrix, { autoTranspose: true });

  let U = svdSolution.leftSingularVectors;
  let V = svdSolution.rightSingularVectors;
  let s = svdSolution.diagonal;

  for (let i = 0; i < s.length; i++) {
    if (Math.abs(s[i]) > threshold) {
      s[i] = 1.0 / s[i];
    } else {
      s[i] = 0.0;
    }
  }

  return V.mmul(_matrix__WEBPACK_IMPORTED_MODULE_0__.default.diag(s).mmul(U.transpose()));
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/stat.js":
/*!********************************************!*\
  !*** ./node_modules/ml-matrix/src/stat.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sumByRow": () => (/* binding */ sumByRow),
/* harmony export */   "sumByColumn": () => (/* binding */ sumByColumn),
/* harmony export */   "sumAll": () => (/* binding */ sumAll),
/* harmony export */   "productByRow": () => (/* binding */ productByRow),
/* harmony export */   "productByColumn": () => (/* binding */ productByColumn),
/* harmony export */   "productAll": () => (/* binding */ productAll),
/* harmony export */   "varianceByRow": () => (/* binding */ varianceByRow),
/* harmony export */   "varianceByColumn": () => (/* binding */ varianceByColumn),
/* harmony export */   "varianceAll": () => (/* binding */ varianceAll),
/* harmony export */   "centerByRow": () => (/* binding */ centerByRow),
/* harmony export */   "centerByColumn": () => (/* binding */ centerByColumn),
/* harmony export */   "centerAll": () => (/* binding */ centerAll),
/* harmony export */   "getScaleByRow": () => (/* binding */ getScaleByRow),
/* harmony export */   "scaleByRow": () => (/* binding */ scaleByRow),
/* harmony export */   "getScaleByColumn": () => (/* binding */ getScaleByColumn),
/* harmony export */   "scaleByColumn": () => (/* binding */ scaleByColumn),
/* harmony export */   "getScaleAll": () => (/* binding */ getScaleAll),
/* harmony export */   "scaleAll": () => (/* binding */ scaleAll)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./node_modules/ml-matrix/src/util.js");


function sumByRow(matrix) {
  let sum = (0,_util__WEBPACK_IMPORTED_MODULE_0__.newArray)(matrix.rows);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[i] += matrix.get(i, j);
    }
  }
  return sum;
}

function sumByColumn(matrix) {
  let sum = (0,_util__WEBPACK_IMPORTED_MODULE_0__.newArray)(matrix.columns);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[j] += matrix.get(i, j);
    }
  }
  return sum;
}

function sumAll(matrix) {
  let v = 0;
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      v += matrix.get(i, j);
    }
  }
  return v;
}

function productByRow(matrix) {
  let sum = (0,_util__WEBPACK_IMPORTED_MODULE_0__.newArray)(matrix.rows, 1);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[i] *= matrix.get(i, j);
    }
  }
  return sum;
}

function productByColumn(matrix) {
  let sum = (0,_util__WEBPACK_IMPORTED_MODULE_0__.newArray)(matrix.columns, 1);
  for (let i = 0; i < matrix.rows; ++i) {
    for (let j = 0; j < matrix.columns; ++j) {
      sum[j] *= matrix.get(i, j);
    }
  }
  return sum;
}

function productAll(matrix) {
  let v = 1;
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      v *= matrix.get(i, j);
    }
  }
  return v;
}

function varianceByRow(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const variance = [];

  for (let i = 0; i < rows; i++) {
    let sum1 = 0;
    let sum2 = 0;
    let x = 0;
    for (let j = 0; j < cols; j++) {
      x = matrix.get(i, j) - mean[i];
      sum1 += x;
      sum2 += x * x;
    }
    if (unbiased) {
      variance.push((sum2 - (sum1 * sum1) / cols) / (cols - 1));
    } else {
      variance.push((sum2 - (sum1 * sum1) / cols) / cols);
    }
  }
  return variance;
}

function varianceByColumn(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const variance = [];

  for (let j = 0; j < cols; j++) {
    let sum1 = 0;
    let sum2 = 0;
    let x = 0;
    for (let i = 0; i < rows; i++) {
      x = matrix.get(i, j) - mean[j];
      sum1 += x;
      sum2 += x * x;
    }
    if (unbiased) {
      variance.push((sum2 - (sum1 * sum1) / rows) / (rows - 1));
    } else {
      variance.push((sum2 - (sum1 * sum1) / rows) / rows);
    }
  }
  return variance;
}

function varianceAll(matrix, unbiased, mean) {
  const rows = matrix.rows;
  const cols = matrix.columns;
  const size = rows * cols;

  let sum1 = 0;
  let sum2 = 0;
  let x = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      x = matrix.get(i, j) - mean;
      sum1 += x;
      sum2 += x * x;
    }
  }
  if (unbiased) {
    return (sum2 - (sum1 * sum1) / size) / (size - 1);
  } else {
    return (sum2 - (sum1 * sum1) / size) / size;
  }
}

function centerByRow(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean[i]);
    }
  }
}

function centerByColumn(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean[j]);
    }
  }
}

function centerAll(matrix, mean) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) - mean);
    }
  }
}

function getScaleByRow(matrix) {
  const scale = [];
  for (let i = 0; i < matrix.rows; i++) {
    let sum = 0;
    for (let j = 0; j < matrix.columns; j++) {
      sum += Math.pow(matrix.get(i, j), 2) / (matrix.columns - 1);
    }
    scale.push(Math.sqrt(sum));
  }
  return scale;
}

function scaleByRow(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale[i]);
    }
  }
}

function getScaleByColumn(matrix) {
  const scale = [];
  for (let j = 0; j < matrix.columns; j++) {
    let sum = 0;
    for (let i = 0; i < matrix.rows; i++) {
      sum += Math.pow(matrix.get(i, j), 2) / (matrix.rows - 1);
    }
    scale.push(Math.sqrt(sum));
  }
  return scale;
}

function scaleByColumn(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale[j]);
    }
  }
}

function getScaleAll(matrix) {
  const divider = matrix.size - 1;
  let sum = 0;
  for (let j = 0; j < matrix.columns; j++) {
    for (let i = 0; i < matrix.rows; i++) {
      sum += Math.pow(matrix.get(i, j), 2) / divider;
    }
  }
  return Math.sqrt(sum);
}

function scaleAll(matrix, scale) {
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.columns; j++) {
      matrix.set(i, j, matrix.get(i, j) / scale);
    }
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/util.js":
/*!********************************************!*\
  !*** ./node_modules/ml-matrix/src/util.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkRowIndex": () => (/* binding */ checkRowIndex),
/* harmony export */   "checkColumnIndex": () => (/* binding */ checkColumnIndex),
/* harmony export */   "checkRowVector": () => (/* binding */ checkRowVector),
/* harmony export */   "checkColumnVector": () => (/* binding */ checkColumnVector),
/* harmony export */   "checkIndices": () => (/* binding */ checkIndices),
/* harmony export */   "checkRowIndices": () => (/* binding */ checkRowIndices),
/* harmony export */   "checkColumnIndices": () => (/* binding */ checkColumnIndices),
/* harmony export */   "checkRange": () => (/* binding */ checkRange),
/* harmony export */   "newArray": () => (/* binding */ newArray),
/* harmony export */   "checkNonEmpty": () => (/* binding */ checkNonEmpty)
/* harmony export */ });
/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkRowIndex(matrix, index, outer) {
  let max = outer ? matrix.rows : matrix.rows - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Row index out of range');
  }
}

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
function checkColumnIndex(matrix, index, outer) {
  let max = outer ? matrix.columns : matrix.columns - 1;
  if (index < 0 || index > max) {
    throw new RangeError('Column index out of range');
  }
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkRowVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.columns) {
    throw new RangeError(
      'vector size must be the same as the number of columns',
    );
  }
  return vector;
}

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
function checkColumnVector(matrix, vector) {
  if (vector.to1DArray) {
    vector = vector.to1DArray();
  }
  if (vector.length !== matrix.rows) {
    throw new RangeError('vector size must be the same as the number of rows');
  }
  return vector;
}

function checkIndices(matrix, rowIndices, columnIndices) {
  return {
    row: checkRowIndices(matrix, rowIndices),
    column: checkColumnIndices(matrix, columnIndices),
  };
}

function checkRowIndices(matrix, rowIndices) {
  if (typeof rowIndices !== 'object') {
    throw new TypeError('unexpected type for row indices');
  }

  let rowOut = rowIndices.some((r) => {
    return r < 0 || r >= matrix.rows;
  });

  if (rowOut) {
    throw new RangeError('row indices are out of range');
  }

  if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);

  return rowIndices;
}

function checkColumnIndices(matrix, columnIndices) {
  if (typeof columnIndices !== 'object') {
    throw new TypeError('unexpected type for column indices');
  }

  let columnOut = columnIndices.some((c) => {
    return c < 0 || c >= matrix.columns;
  });

  if (columnOut) {
    throw new RangeError('column indices are out of range');
  }
  if (!Array.isArray(columnIndices)) columnIndices = Array.from(columnIndices);

  return columnIndices;
}

function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
  if (arguments.length !== 5) {
    throw new RangeError('expected 4 arguments');
  }
  checkNumber('startRow', startRow);
  checkNumber('endRow', endRow);
  checkNumber('startColumn', startColumn);
  checkNumber('endColumn', endColumn);
  if (
    startRow > endRow ||
    startColumn > endColumn ||
    startRow < 0 ||
    startRow >= matrix.rows ||
    endRow < 0 ||
    endRow >= matrix.rows ||
    startColumn < 0 ||
    startColumn >= matrix.columns ||
    endColumn < 0 ||
    endColumn >= matrix.columns
  ) {
    throw new RangeError('Submatrix indices are out of range');
  }
}

function newArray(length, value = 0) {
  let array = [];
  for (let i = 0; i < length; i++) {
    array.push(value);
  }
  return array;
}

function checkNumber(name, value) {
  if (typeof value !== 'number') {
    throw new TypeError(`${name} must be a number`);
  }
}

function checkNonEmpty(matrix) {
  if (matrix.isEmpty()) {
    throw new Error('Empty matrix has no elements to index');
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/base.js":
/*!**************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/base.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseView)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");


class BaseView extends _matrix__WEBPACK_IMPORTED_MODULE_0__.AbstractMatrix {
  constructor(matrix, rows, columns) {
    super();
    this.matrix = matrix;
    this.rows = rows;
    this.columns = columns;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/column.js":
/*!****************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/column.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixColumnView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixColumnView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, column) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndex)(matrix, column);
    super(matrix, matrix.rows, 1);
    this.column = column;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.column, value);
    return this;
  }

  get(rowIndex) {
    return this.matrix.get(rowIndex, this.column);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/columnSelection.js":
/*!*************************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/columnSelection.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixColumnSelectionView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixColumnSelectionView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, columnIndices) {
    columnIndices = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkColumnIndices)(matrix, columnIndices);
    super(matrix, matrix.rows, columnIndices.length);
    this.columnIndices = columnIndices;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/flipColumn.js":
/*!********************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/flipColumn.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixFlipColumnView)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixFlipColumnView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/flipRow.js":
/*!*****************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/flipRow.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixFlipRowView)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixFlipRowView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix) {
    super(matrix, matrix.rows, matrix.columns);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/index.js":
/*!***************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MatrixColumnView": () => (/* reexport safe */ _column__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "MatrixColumnSelectionView": () => (/* reexport safe */ _columnSelection__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "MatrixFlipColumnView": () => (/* reexport safe */ _flipColumn__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "MatrixFlipRowView": () => (/* reexport safe */ _flipRow__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "MatrixRowView": () => (/* reexport safe */ _row__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "MatrixRowSelectionView": () => (/* reexport safe */ _rowSelection__WEBPACK_IMPORTED_MODULE_5__.default),
/* harmony export */   "MatrixSelectionView": () => (/* reexport safe */ _selection__WEBPACK_IMPORTED_MODULE_6__.default),
/* harmony export */   "MatrixSubView": () => (/* reexport safe */ _sub__WEBPACK_IMPORTED_MODULE_7__.default),
/* harmony export */   "MatrixTransposeView": () => (/* reexport safe */ _transpose__WEBPACK_IMPORTED_MODULE_8__.default)
/* harmony export */ });
/* harmony import */ var _column__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./column */ "./node_modules/ml-matrix/src/views/column.js");
/* harmony import */ var _columnSelection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./columnSelection */ "./node_modules/ml-matrix/src/views/columnSelection.js");
/* harmony import */ var _flipColumn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flipColumn */ "./node_modules/ml-matrix/src/views/flipColumn.js");
/* harmony import */ var _flipRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./flipRow */ "./node_modules/ml-matrix/src/views/flipRow.js");
/* harmony import */ var _row__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./row */ "./node_modules/ml-matrix/src/views/row.js");
/* harmony import */ var _rowSelection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rowSelection */ "./node_modules/ml-matrix/src/views/rowSelection.js");
/* harmony import */ var _selection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./selection */ "./node_modules/ml-matrix/src/views/selection.js");
/* harmony import */ var _sub__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sub */ "./node_modules/ml-matrix/src/views/sub.js");
/* harmony import */ var _transpose__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transpose */ "./node_modules/ml-matrix/src/views/transpose.js");











/***/ }),

/***/ "./node_modules/ml-matrix/src/views/row.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/row.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixRowView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixRowView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, row) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndex)(matrix, row);
    super(matrix, 1, matrix.columns);
    this.row = row;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.row, columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.row, columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/rowSelection.js":
/*!**********************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/rowSelection.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixRowSelectionView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixRowSelectionView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, rowIndices) {
    rowIndices = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRowIndices)(matrix, rowIndices);
    super(matrix, rowIndices.length, matrix.columns);
    this.rowIndices = rowIndices;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/selection.js":
/*!*******************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/selection.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixSelectionView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixSelectionView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, rowIndices, columnIndices) {
    let indices = (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkIndices)(matrix, rowIndices, columnIndices);
    super(matrix, indices.row.length, indices.column.length);
    this.rowIndices = indices.row;
    this.columnIndices = indices.column;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(
      this.rowIndices[rowIndex],
      this.columnIndices[columnIndex],
      value,
    );
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(
      this.rowIndices[rowIndex],
      this.columnIndices[columnIndex],
    );
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/sub.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/sub.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixSubView)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./node_modules/ml-matrix/src/util.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");




class MatrixSubView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix, startRow, endRow, startColumn, endColumn) {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.checkRange)(matrix, startRow, endRow, startColumn, endColumn);
    super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
    this.startRow = startRow;
    this.startColumn = startColumn;
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(
      this.startRow + rowIndex,
      this.startColumn + columnIndex,
      value,
    );
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(
      this.startRow + rowIndex,
      this.startColumn + columnIndex,
    );
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/views/transpose.js":
/*!*******************************************************!*\
  !*** ./node_modules/ml-matrix/src/views/transpose.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatrixTransposeView)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/ml-matrix/src/views/base.js");


class MatrixTransposeView extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(matrix) {
    super(matrix, matrix.columns, matrix.rows);
  }

  set(rowIndex, columnIndex, value) {
    this.matrix.set(columnIndex, rowIndex, value);
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.matrix.get(columnIndex, rowIndex);
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js":
/*!************************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WrapperMatrix1D)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");


class WrapperMatrix1D extends _matrix__WEBPACK_IMPORTED_MODULE_0__.AbstractMatrix {
  constructor(data, options = {}) {
    const { rows = 1 } = options;

    if (data.length % rows !== 0) {
      throw new Error('the data length is not divisible by the number of rows');
    }
    super();
    this.rows = rows;
    this.columns = data.length / rows;
    this.data = data;
  }

  set(rowIndex, columnIndex, value) {
    let index = this._calculateIndex(rowIndex, columnIndex);
    this.data[index] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    let index = this._calculateIndex(rowIndex, columnIndex);
    return this.data[index];
  }

  _calculateIndex(row, column) {
    return row * this.columns + column;
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js":
/*!************************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WrapperMatrix2D)
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matrix */ "./node_modules/ml-matrix/src/matrix.js");


class WrapperMatrix2D extends _matrix__WEBPACK_IMPORTED_MODULE_0__.AbstractMatrix {
  constructor(data) {
    super();
    this.data = data;
    this.rows = data.length;
    this.columns = data[0].length;
  }

  set(rowIndex, columnIndex, value) {
    this.data[rowIndex][columnIndex] = value;
    return this;
  }

  get(rowIndex, columnIndex) {
    return this.data[rowIndex][columnIndex];
  }
}


/***/ }),

/***/ "./node_modules/ml-matrix/src/wrap/wrap.js":
/*!*************************************************!*\
  !*** ./node_modules/ml-matrix/src/wrap/wrap.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wrap": () => (/* binding */ wrap)
/* harmony export */ });
/* harmony import */ var _WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WrapperMatrix1D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix1D.js");
/* harmony import */ var _WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WrapperMatrix2D */ "./node_modules/ml-matrix/src/wrap/WrapperMatrix2D.js");



function wrap(array, options) {
  if (Array.isArray(array)) {
    if (array[0] && Array.isArray(array[0])) {
      return new _WrapperMatrix2D__WEBPACK_IMPORTED_MODULE_0__.default(array);
    } else {
      return new _WrapperMatrix1D__WEBPACK_IMPORTED_MODULE_1__.default(array, options);
    }
  } else {
    throw new Error('the argument is not an array');
  }
}


/***/ }),

/***/ "./node_modules/tinyqueue/index.js":
/*!*****************************************!*\
  !*** ./node_modules/tinyqueue/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TinyQueue)
/* harmony export */ });

class TinyQueue {
    constructor(data = [], compare = defaultCompare) {
        this.data = data;
        this.length = this.data.length;
        this.compare = compare;

        if (this.length > 0) {
            for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
        }
    }

    push(item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    }

    pop() {
        if (this.length === 0) return undefined;

        const top = this.data[0];
        const bottom = this.data.pop();
        this.length--;

        if (this.length > 0) {
            this.data[0] = bottom;
            this._down(0);
        }

        return top;
    }

    peek() {
        return this.data[0];
    }

    _up(pos) {
        const {data, compare} = this;
        const item = data[pos];

        while (pos > 0) {
            const parent = (pos - 1) >> 1;
            const current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;
            pos = parent;
        }

        data[pos] = item;
    }

    _down(pos) {
        const {data, compare} = this;
        const halfLength = this.length >> 1;
        const item = data[pos];

        while (pos < halfLength) {
            let left = (pos << 1) + 1;
            let best = data[left];
            const right = left + 1;

            if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            pos = left;
        }

        data[pos] = item;
    }
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}


/***/ }),

/***/ "./src/image-target/estimation/estimate.js":
/*!*************************************************!*\
  !*** ./src/image-target/estimation/estimate.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Matrix, inverse} = __webpack_require__(/*! ml-matrix */ "./node_modules/ml-matrix/src/index.js");
const {solveHomography} = __webpack_require__(/*! ../utils/homography */ "./src/image-target/utils/homography.js");

// build world matrix with list of matching worldCoords|screenCoords
//
// Step 1. estimate homography with list of pairs
// Ref: https://www.uio.no/studier/emner/matnat/its/TEK5030/v19/lect/lecture_4_3-estimating-homographies-from-feature-correspondences.pdf  (Basic homography estimation from points)
//
// Step 2. decompose homography into rotation and translation matrixes (i.e. world matrix)
// Ref: can anyone provide reference?
const estimate = ({screenCoords, worldCoords, projectionTransform}) => {
  const Harray = solveHomography(worldCoords.map((p) => [p.x, p.y]), screenCoords.map((p) => [p.x, p.y]));
  const H = new Matrix([
    [Harray[0], Harray[1], Harray[2]],
    [Harray[3], Harray[4], Harray[5]],
    [Harray[6], Harray[7], Harray[8]],
  ]);

  const K = new Matrix(projectionTransform);
  const KInv = inverse(K);

  const _KInvH = KInv.mmul(H);
  const KInvH = _KInvH.to1DArray();

  const norm1 = Math.sqrt( KInvH[0] * KInvH[0] + KInvH[3] * KInvH[3] + KInvH[6] * KInvH[6]);
  const norm2 = Math.sqrt( KInvH[1] * KInvH[1] + KInvH[4] * KInvH[4] + KInvH[7] * KInvH[7]);
  const tnorm = (norm1 + norm2) / 2;

  const rotate = [];
  rotate[0] = KInvH[0] / norm1;
  rotate[3] = KInvH[3] / norm1;
  rotate[6] = KInvH[6] / norm1;

  rotate[1] = KInvH[1] / norm2;
  rotate[4] = KInvH[4] / norm2;
  rotate[7] = KInvH[7] / norm2;

  rotate[2] = rotate[3] * rotate[7] - rotate[6] * rotate[4];
  rotate[5] = rotate[6] * rotate[1] - rotate[0] * rotate[7];
  rotate[8] = rotate[0] * rotate[4] - rotate[1] * rotate[3];

  const norm3 = Math.sqrt(rotate[2] * rotate[2] + rotate[5] * rotate[5] + rotate[8] * rotate[8]);
  rotate[2] /= norm3;
  rotate[5] /= norm3;
  rotate[8] /= norm3;

  // TODO: artoolkit has check_rotation() that somehow switch the rotate vector. not sure what that does. Can anyone advice?
  // https://github.com/artoolkitx/artoolkit5/blob/5bf0b671ff16ead527b9b892e6aeb1a2771f97be/lib/SRC/ARICP/icpUtil.c#L215

  const tran = []
  tran[0] = KInvH[2] / tnorm;
  tran[1] = KInvH[5] / tnorm;
  tran[2] = KInvH[8] / tnorm;

  let initialModelViewTransform = [
    [rotate[0], rotate[1], rotate[2], tran[0]],
    [rotate[3], rotate[4], rotate[5], tran[1]],
    [rotate[6], rotate[7], rotate[8], tran[2]]
  ];

  return initialModelViewTransform;
};

module.exports = {
  estimate
}


/***/ }),

/***/ "./src/image-target/estimation/estimator.js":
/*!**************************************************!*\
  !*** ./src/image-target/estimation/estimator.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {estimate} = __webpack_require__(/*! ./estimate.js */ "./src/image-target/estimation/estimate.js");
const {refineEstimate} = __webpack_require__(/*! ./refine-estimate.js */ "./src/image-target/estimation/refine-estimate.js");

class Estimator {
  constructor(projectionTransform) {
    this.projectionTransform = projectionTransform;
  }

  // Solve homography between screen points and world points using Direct Linear Transformation
  // then decompose homography into rotation and translation matrix (i.e. modelViewTransform)
  estimate({screenCoords, worldCoords}) {
    const modelViewTransform = estimate({screenCoords, worldCoords, projectionTransform: this.projectionTransform});
    return modelViewTransform;
  }

  // Given an initial guess of the modelViewTransform and new pairs of screen-world coordinates, 
  // use Iterative Closest Point to refine the transformation
  //refineEstimate({initialModelViewTransform, screenCoords, worldCoords}) {
  refineEstimate({initialModelViewTransform, worldCoords, screenCoords}) {
    const updatedModelViewTransform = refineEstimate({initialModelViewTransform, worldCoords, screenCoords, projectionTransform: this.projectionTransform});
    return updatedModelViewTransform;
  }
}

module.exports = {
  Estimator,
}


/***/ }),

/***/ "./src/image-target/estimation/refine-estimate.js":
/*!********************************************************!*\
  !*** ./src/image-target/estimation/refine-estimate.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Matrix, inverse} = __webpack_require__(/*! ml-matrix */ "./node_modules/ml-matrix/src/index.js");
const {normalizePoints, applyModelViewProjectionTransform, buildModelViewProjectionTransform, computeScreenCoordiate} = __webpack_require__(/*! ./utils.js */ "./src/image-target/estimation/utils.js");

const TRACKING_THRESH = 5.0; // default
const K2_FACTOR = 4.0; // Question: should it be relative to the size of the screen instead of hardcoded?
const ICP_MAX_LOOP = 10;
const ICP_BREAK_LOOP_ERROR_THRESH = 0.1;
const ICP_BREAK_LOOP_ERROR_RATIO_THRESH = 0.99;
const ICP_BREAK_LOOP_ERROR_THRESH2 = 4.0;

// some temporary/intermediate variables used later. Declare them beforehand to reduce new object allocations
let mat = [[],[],[]]; 
let J_U_Xc = [[],[]]; // 2x3
let J_Xc_S = [[],[],[]]; // 3x6

const refineEstimate = ({initialModelViewTransform, projectionTransform, worldCoords, screenCoords}) => {
  // Question: shall we normlize the screen coords as well?
  // Question: do we need to normlize the scale as well, i.e. make coords from -1 to 1
  //
  // normalize world coords - reposition them to center of mass
  //   assume z coordinate is always zero (in our case, the image target is planar with z = 0
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < worldCoords.length; i++) {
    dx += worldCoords[i].x;
    dy += worldCoords[i].y;
  }
  dx /= worldCoords.length;
  dy /= worldCoords.length;

  const normalizedWorldCoords = [];
  for (let i = 0; i < worldCoords.length; i++) {
    normalizedWorldCoords.push({x: worldCoords[i].x - dx, y: worldCoords[i].y - dy, z: worldCoords[i].z});
  }

  const diffModelViewTransform = [[],[],[]];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      diffModelViewTransform[j][i] = initialModelViewTransform[j][i];
    }
  }
  diffModelViewTransform[0][3] = initialModelViewTransform[0][0] * dx + initialModelViewTransform[0][1] * dy + initialModelViewTransform[0][3];
  diffModelViewTransform[1][3] = initialModelViewTransform[1][0] * dx + initialModelViewTransform[1][1] * dy + initialModelViewTransform[1][3];
  diffModelViewTransform[2][3] = initialModelViewTransform[2][0] * dx + initialModelViewTransform[2][1] * dy + initialModelViewTransform[2][3];

  // use iterative closest point algorithm to refine the modelViewTransform
  const inlierProbs = [1.0, 0.8, 0.6, 0.4, 0.0];
  let updatedModelViewTransform = diffModelViewTransform; // iteratively update this transform
  let finalModelViewTransform = null;
  for (let i = 0; i < inlierProbs.length; i++) {
    const ret = _doICP({initialModelViewTransform: updatedModelViewTransform, projectionTransform, worldCoords: normalizedWorldCoords, screenCoords, inlierProb: inlierProbs[i]});

    updatedModelViewTransform = ret.modelViewTransform;

    //console.log("err", ret.err);

    if (ret.err < TRACKING_THRESH) {
      finalModelViewTransform = updatedModelViewTransform;
      break;
    }
  }

  if (finalModelViewTransform === null) return null;

  // de-normalize
  finalModelViewTransform[0][3] = finalModelViewTransform[0][3] - finalModelViewTransform[0][0] * dx - finalModelViewTransform[0][1] * dy;
  finalModelViewTransform[1][3] = finalModelViewTransform[1][3] - finalModelViewTransform[1][0] * dx - finalModelViewTransform[1][1] * dy;
  finalModelViewTransform[2][3] = finalModelViewTransform[2][3] - finalModelViewTransform[2][0] * dx - finalModelViewTransform[2][1] * dy;

  return finalModelViewTransform;
}

// ICP iteration
// Question: can someone provide theoretical reference / mathematical proof for the following computations?
const _doICP = ({initialModelViewTransform, projectionTransform, worldCoords, screenCoords, inlierProb}) => {
  const isRobustMode = inlierProb < 1;

  let modelViewTransform = initialModelViewTransform;

  let err0 = 0.0;
  let err1 = 0.0;

  let E = new Array(worldCoords.length);
  let E2 = new Array(worldCoords.length);
  let dxs = new Array(worldCoords.length);
  let dys = new Array(worldCoords.length);

  for (let l = 0; l <= ICP_MAX_LOOP; l++) {
    const modelViewProjectionTransform = buildModelViewProjectionTransform(projectionTransform, modelViewTransform);

    for (let n = 0; n < worldCoords.length; n++) {
      const u = computeScreenCoordiate(modelViewProjectionTransform, worldCoords[n].x, worldCoords[n].y, worldCoords[n].z);
      const dx = screenCoords[n].x - u.x;
      const dy = screenCoords[n].y - u.y;

      dxs[n] = dx;
      dys[n] = dy;
      E[n] = (dx * dx + dy * dy);
    }

    let K2; // robust mode only
    err1 = 0.0;
    if (isRobustMode) {
      const inlierNum = Math.max(3, Math.floor(worldCoords.length * inlierProb) - 1);
      for (let n = 0; n < worldCoords.length; n++) {
        E2[n] = E[n];
      }
      E2.sort((a, b) => {return a-b;});

      K2 = Math.max(E2[inlierNum] * K2_FACTOR, 16.0);
      for (let n = 0; n < worldCoords.length; n++) {
        if (E2[n] > K2) err1 += K2/ 6;
        else err1 +=  K2/6.0 * (1.0 - (1.0-E2[n]/K2)*(1.0-E2[n]/K2)*(1.0-E2[n]/K2));
      }
    } else {
      for (let n = 0; n < worldCoords.length; n++) {
        err1 += E[n];
      }
    }
    err1 /= worldCoords.length;

    //console.log("icp loop", inlierProb, l, err1);

    if (err1 < ICP_BREAK_LOOP_ERROR_THRESH) break;
    //if (l > 0 && err1 < ICP_BREAK_LOOP_ERROR_THRESH2 && err1/err0 > ICP_BREAK_LOOP_ERROR_RATIO_THRESH) break;
    if (l > 0 && err1/err0 > ICP_BREAK_LOOP_ERROR_RATIO_THRESH) break;
    if (l === ICP_MAX_LOOP) break;

    err0 = err1;

    const dU = [];
    const allJ_U_S = [];
    for (let n = 0; n < worldCoords.length; n++) {
      if (isRobustMode && E[n] > K2) {
        continue;
      }

      const J_U_S = _getJ_U_S({modelViewProjectionTransform, modelViewTransform, projectionTransform, worldCoord: worldCoords[n]});

      if (isRobustMode) {
        const W = (1.0 - E[n]/K2)*(1.0 - E[n]/K2);

        for (let j = 0; j < 2; j++) {
          for (let i = 0; i < 6; i++) {
            J_U_S[j][i] *= W;
          }
        }
        dU.push([dxs[n] * W]);
        dU.push([dys[n] * W]);
      } else {
        dU.push([dxs[n]]);
        dU.push([dys[n]]);
      }

      for (let i = 0; i < J_U_S.length; i++) {
        allJ_U_S.push(J_U_S[i]);
      }
    }

    const dS = _getDeltaS({dU, J_U_S: allJ_U_S});
    if (dS === null) break;

    modelViewTransform = _updateModelViewTransform({modelViewTransform, dS});
  }
  return {modelViewTransform, err: err1};
}

const _updateModelViewTransform = ({modelViewTransform, dS}) => {
  /**
   * dS has 6 paragrams, first half is rotation, second half is translation
   * rotation is expressed in angle-axis, 
   *   [S[0], S[1] ,S[2]] is the axis of rotation, and the magnitude is the angle
   */
  let ra = dS[0] * dS[0] + dS[1] * dS[1] + dS[2] * dS[2];
  let q0, q1, q2;
  if( ra < 0.000001 ) {
    q0 = 1.0;
    q1 = 0.0;
    q2 = 0.0;
    ra = 0.0;
  } else {
    ra = Math.sqrt(ra);
    q0 = dS[0] / ra;
    q1 = dS[1] / ra;
    q2 = dS[2] / ra;
  }

  const cra = Math.cos(ra);
  const sra = Math.sin(ra);
  const one_cra = 1.0 - cra;

  // mat is [R|t], 3D rotation and translation
  mat[0][0] = q0*q0*one_cra + cra;
  mat[0][1] = q0*q1*one_cra - q2*sra;
  mat[0][2] = q0*q2*one_cra + q1*sra;
  mat[0][3] = dS[3];
  mat[1][0] = q1*q0*one_cra + q2*sra;
  mat[1][1] = q1*q1*one_cra + cra;
  mat[1][2] = q1*q2*one_cra - q0*sra;
  mat[1][3] = dS[4]
  mat[2][0] = q2*q0*one_cra - q1*sra;
  mat[2][1] = q2*q1*one_cra + q0*sra;
  mat[2][2] = q2*q2*one_cra + cra;
  mat[2][3] = dS[5];

  // the updated transform is the original transform x delta transform
  const mat2 = [[],[],[]];
  for (let j = 0; j < 3; j++ ) {
    for (let i = 0; i < 4; i++ ) {
      mat2[j][i] = modelViewTransform[j][0] * mat[0][i]
                   + modelViewTransform[j][1] * mat[1][i]
                   + modelViewTransform[j][2] * mat[2][i];
    }
    mat2[j][3] += modelViewTransform[j][3];
  }
  return mat2;
}

const _getDeltaS = ({dU, J_U_S}) => {
  const J = new Matrix(J_U_S);
  const U = new Matrix(dU);

  const JT = J.transpose();
  const JTJ = JT.mmul(J);
  const JTU = JT.mmul(U);

  let JTJInv;
  try {
    JTJInv = inverse(JTJ);
  } catch (e) {
    return null;
  }

  const S = JTJInv.mmul(JTU);
  return S.to1DArray();
}

const _getJ_U_S = ({modelViewProjectionTransform, modelViewTransform, projectionTransform, worldCoord}) => {
  const T = modelViewTransform;
  const {x, y, z} = worldCoord;

  const u = applyModelViewProjectionTransform(modelViewProjectionTransform, x, y, z);

  const z2 = u.z * u.z;
  // Question: This is the most confusing matrix to me. I've no idea how to derive this.
  //J_U_Xc[0][0] = (projectionTransform[0][0] * u.z - projectionTransform[2][0] * u.x) / z2;
  //J_U_Xc[0][1] = (projectionTransform[0][1] * u.z - projectionTransform[2][1] * u.x) / z2;
  //J_U_Xc[0][2] = (projectionTransform[0][2] * u.z - projectionTransform[2][2] * u.x) / z2;
  //J_U_Xc[1][0] = (projectionTransform[1][0] * u.z - projectionTransform[2][0] * u.y) / z2;
  //J_U_Xc[1][1] = (projectionTransform[1][1] * u.z - projectionTransform[2][1] * u.y) / z2;
  //J_U_Xc[1][2] = (projectionTransform[1][2] * u.z - projectionTransform[2][2] * u.y) / z2;
  
  // The above is the original implementation, but simplify to below becuase projetionTransform[2][0] and [2][1] are zero
  J_U_Xc[0][0] = (projectionTransform[0][0] * u.z) / z2;
  J_U_Xc[0][1] = (projectionTransform[0][1] * u.z) / z2;
  J_U_Xc[0][2] = (projectionTransform[0][2] * u.z - projectionTransform[2][2] * u.x) / z2;
  J_U_Xc[1][0] = (projectionTransform[1][0] * u.z) / z2;
  J_U_Xc[1][1] = (projectionTransform[1][1] * u.z) / z2;
  J_U_Xc[1][2] = (projectionTransform[1][2] * u.z - projectionTransform[2][2] * u.y) / z2;

  /*
    J_Xc_S should be like this, but z is zero, so we can simplify
    [T[0][2] * y - T[0][1] * z, T[0][0] * z - T[0][2] * x, T[0][1] * x - T[0][0] * y, T[0][0], T[0][1], T[0][2]],
    [T[1][2] * y - T[1][1] * z, T[1][0] * z - T[1][2] * x, T[1][1] * x - T[1][0] * y, T[1][0], T[1][1], T[1][2]],
    [T[2][2] * y - T[2][1] * z, T[2][0] * z - T[2][2] * x, T[2][1] * x - T[2][0] * y, T[2][0], T[2][1], T[2][2]],
  */
  J_Xc_S[0][0] = T[0][2] * y;
  J_Xc_S[0][1] = -T[0][2] * x;
  J_Xc_S[0][2] = T[0][1] * x - T[0][0] * y;
  J_Xc_S[0][3] = T[0][0];
  J_Xc_S[0][4] = T[0][1]; 
  J_Xc_S[0][5] = T[0][2];

  J_Xc_S[1][0] = T[1][2] * y;
  J_Xc_S[1][1] = -T[1][2] * x;
  J_Xc_S[1][2] = T[1][1] * x - T[1][0] * y;
  J_Xc_S[1][3] = T[1][0];
  J_Xc_S[1][4] = T[1][1];
  J_Xc_S[1][5] = T[1][2];

  J_Xc_S[2][0] = T[2][2] * y;
  J_Xc_S[2][1] = -T[2][2] * x;
  J_Xc_S[2][2] = T[2][1] * x - T[2][0] * y;
  J_Xc_S[2][3] = T[2][0];
  J_Xc_S[2][4] = T[2][1];
  J_Xc_S[2][5] = T[2][2];

  const J_U_S = [[], []];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 6; i++) {
      J_U_S[j][i] = 0.0;
      for (let k = 0; k < 3; k++ ) {
        J_U_S[j][i] += J_U_Xc[j][k] * J_Xc_S[k][i];
      }
    }
  }
  return J_U_S;
}

module.exports = {
  refineEstimate
}


/***/ }),

/***/ "./src/image-target/estimation/utils.js":
/*!**********************************************!*\
  !*** ./src/image-target/estimation/utils.js ***!
  \**********************************************/
/***/ ((module) => {

const buildModelViewProjectionTransform = (projectionTransform, modelViewTransform) => {
  // assume the projectTransform has the following format:
  // [[fx, 0, cx],
  //  [0, fy, cy]
  //  [0, 0, 1]]
  const modelViewProjectionTransform = [
    [
      projectionTransform[0][0] * modelViewTransform[0][0] + projectionTransform[0][2] * modelViewTransform[2][0],
      projectionTransform[0][0] * modelViewTransform[0][1] + projectionTransform[0][2] * modelViewTransform[2][1],
      projectionTransform[0][0] * modelViewTransform[0][2] + projectionTransform[0][2] * modelViewTransform[2][2],
      projectionTransform[0][0] * modelViewTransform[0][3] + projectionTransform[0][2] * modelViewTransform[2][3],
    ],
    [
      projectionTransform[1][1] * modelViewTransform[1][0] + projectionTransform[1][2] * modelViewTransform[2][0],
      projectionTransform[1][1] * modelViewTransform[1][1] + projectionTransform[1][2] * modelViewTransform[2][1],
      projectionTransform[1][1] * modelViewTransform[1][2] + projectionTransform[1][2] * modelViewTransform[2][2],
      projectionTransform[1][1] * modelViewTransform[1][3] + projectionTransform[1][2] * modelViewTransform[2][3],
    ],
    [
      modelViewTransform[2][0],
      modelViewTransform[2][1],
      modelViewTransform[2][2],
      modelViewTransform[2][3],
    ]
  ];
  return modelViewProjectionTransform;
  
  /*
  // this is the full computation if the projectTransform does not look like the expected format, but more computations
  //  
  const modelViewProjectionTransform = [[],[],[]];
  for (let j = 0; j < 3; j++ ) {
    for (let i = 0; i < 4; i++) {
      modelViewProjectionTransform[j][i] = projectionTransform[j][0] * modelViewTransform[0][i]
                                         + projectionTransform[j][1] * modelViewTransform[1][i]
                                         + projectionTransform[j][2] * modelViewTransform[2][i];
    }
  }
  return modelViewProjectionTransform;
  */
}

const applyModelViewProjectionTransform = (modelViewProjectionTransform, x, y, z) => {
  // assume z is zero
  const ux = modelViewProjectionTransform[0][0] * x + modelViewProjectionTransform[0][1] * y + modelViewProjectionTransform[0][3];
  const uy = modelViewProjectionTransform[1][0] * x + modelViewProjectionTransform[1][1] * y + modelViewProjectionTransform[1][3];
  const uz = modelViewProjectionTransform[2][0] * x + modelViewProjectionTransform[2][1] * y + modelViewProjectionTransform[2][3];
  return {x: ux, y: uy, z: uz};
}

const computeScreenCoordiate = (modelViewProjectionTransform, x, y, z) => {
  const {x: ux, y: uy, z: uz} = applyModelViewProjectionTransform(modelViewProjectionTransform, x, y, z);
  //if( Math.abs(uz) < 0.000001 ) return null;
  return {x: ux/uz, y: uy/uz};
}

const screenToMarkerCoordinate = (modelViewProjectionTransform, sx, sy) => {
  const c11 = modelViewProjectionTransform[2][0] * sx - modelViewProjectionTransform[0][0];
  const c12 = modelViewProjectionTransform[2][1] * sx - modelViewProjectionTransform[0][1];
  const c21 = modelViewProjectionTransform[2][0] * sy - modelViewProjectionTransform[1][0];
  const c22 = modelViewProjectionTransform[2][1] * sy - modelViewProjectionTransform[1][1];
  const b1  = modelViewProjectionTransform[0][3] - modelViewProjectionTransform[2][3] * sx;
  const b2  = modelViewProjectionTransform[1][3] - modelViewProjectionTransform[2][3] * sy;

  const m = c11 * c22 - c12 * c21;
  return {
    x: (c22 * b1 - c12 * b2) / m,
    y: (c11 * b2 - c21 * b1) / m
  }
}

module.exports = {
  buildModelViewProjectionTransform,
  applyModelViewProjectionTransform,
  computeScreenCoordiate,
}


/***/ }),

/***/ "./src/image-target/matching/hamming-distance.js":
/*!*******************************************************!*\
  !*** ./src/image-target/matching/hamming-distance.js ***!
  \*******************************************************/
/***/ ((module) => {

// Fast computation on number of bit sets
// Ref: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
const compute = (options) => {
  const {v1, v2} = options;
  let d = 0;

  for (let i = 0; i < v1.length; i++) {
    let x = (v1[i] ^ v2[i]) >>> 0;
    d += bitCount(x);
  }
  return d;
}

const bitCount = (v) => {
  var c = v - ((v >> 1) & 0x55555555);
  c = ((c >> 2) & 0x33333333) + (c & 0x33333333);
  c = ((c >> 4) + c) & 0x0F0F0F0F;
  c = ((c >> 8) + c) & 0x00FF00FF;
  c = ((c >> 16) + c) & 0x0000FFFF;
  return c;
}

module.exports = {
  compute
};


/***/ }),

/***/ "./src/image-target/matching/hough.js":
/*!********************************************!*\
  !*** ./src/image-target/matching/hough.js ***!
  \********************************************/
/***/ ((module) => {

const kHoughBinDelta = 1;

// mathces [querypointIndex:x, keypointIndex: x]
const computeHoughMatches = (options) => {
  const {keywidth, keyheight, querywidth, queryheight, matches} = options;

  const maxX = querywidth * 1.2;
  const minX = -maxX;
  const maxY = queryheight * 1.2;
  const minY = -maxY;
  const numAngleBins = 12;
  const numScaleBins = 10;
  const minScale = -1;
  const maxScale = 1;
  const scaleK = 10.0;
  const scaleOneOverLogK = 1.0 / Math.log(scaleK);
  const maxDim = Math.max(keywidth, keyheight);
  const keycenterX = Math.floor(keywidth / 2);
  const keycenterY = Math.floor(keyheight / 2);

  // compute numXBins and numYBins based on matches
  const projectedDims = [];
  for (let i = 0; i < matches.length; i++) {
    const queryscale = matches[i].querypoint.scale;
    const keyscale = matches[i].keypoint.scale;
    if (keyscale == 0) console.log("ERROR divide zero");
    const scale = queryscale / keyscale;
    projectedDims.push( scale * maxDim );
  }

  // TODO optimize median
  //   weird. median should be [Math.floor(projectedDims.length/2) - 1] ?
  projectedDims.sort((a1, a2) => {return a1 - a2});
  const medianProjectedDim = projectedDims[ Math.floor(projectedDims.length/2) - (projectedDims.length%2==0?1:0) -1 ];

  const binSize = 0.25 * medianProjectedDim;
  const numXBins = Math.max(5, Math.ceil((maxX - minX) / binSize));
  const numYBins = Math.max(5, Math.ceil((maxY - minY) / binSize));

  const numXYBins = numXBins * numYBins;
  const numXYAngleBins = numXYBins * numAngleBins;

  // do voting
  const querypointValids = [];
  const querypointBinLocations = [];
  const votes = {};
  for (let i = 0; i < matches.length; i++) {
    const querypoint = matches[i].querypoint;
    const keypoint = matches[i].keypoint;

    const {x, y, scale, angle} = _mapCorrespondence({querypoint, keypoint, keycenterX, keycenterY, scaleOneOverLogK});

    // Check that the vote is within range
    if (x < minX || x >= maxX || y < minY || y >= maxY || angle <= -Math.PI || angle > Math.PI || scale < minScale || scale >= maxScale) {
      querypointValids[i] = false;
      continue;
    }

    // map properties to bins
    let fbinX = numXBins * (x - minX) / (maxX - minX);
    let fbinY = numYBins * (y - minY) / (maxY - minY);
    let fbinAngle = numAngleBins * (angle + Math.PI) / (2.0 * Math.PI);
    let fbinScale = numScaleBins * (scale - minScale) / (maxScale - minScale);

    querypointBinLocations[i] = {binX: fbinX, binY: fbinY, binAngle: fbinAngle, binScale: fbinScale};

    let binX = Math.floor(fbinX - 0.5);
    let binY = Math.floor(fbinY - 0.5);
    let binScale = Math.floor(fbinScale - 0.5);
    let binAngle = (Math.floor(fbinAngle - 0.5) + numAngleBins) % numAngleBins;

    // check can vote all 16 bins
    if (binX < 0 || binX + 1 >= numXBins || binY < 0 || binY + 1 >= numYBins || binScale < 0 || binScale +1 >= numScaleBins) {
      querypointValids[i] = false;
      continue;
    }

    for (let dx = 0; dx < 2; dx++) {
      let binX2 = binX + dx;

      for (let dy = 0; dy < 2; dy++) {
        let binY2 = binY + dy;

        for (let dangle = 0; dangle < 2; dangle++) {
          let binAngle2 = (binAngle + dangle) % numAngleBins;

          for (let dscale = 0; dscale < 2; dscale++) {
            let binScale2 = binScale + dscale;

            const binIndex = binX2 + binY2 * numXBins + binAngle2 * numXYBins + binScale2 * numXYAngleBins;

            if (votes[binIndex] === undefined) votes[binIndex] = 0;
            votes[binIndex] += 1;
          }
        }
      }
    }
    querypointValids[i] = true;
  }

  let maxVotes = 0;
  let maxVoteIndex = -1;
  Object.keys(votes).forEach((index) => {
    if (votes[index] > maxVotes) {
      maxVotes = votes[index];
      maxVoteIndex = index;
    }
  });

  if (maxVotes < 3) return [];

  // get back bins from vote index
  const binX = Math.floor(((maxVoteIndex % numXYAngleBins) % numXYBins) % numXBins);
  const binY = Math.floor((((maxVoteIndex - binX) % numXYAngleBins) % numXYBins) / numXBins);
  const binAngle = Math.floor(((maxVoteIndex - binX - (binY * numXBins)) % numXYAngleBins) / numXYBins);
  const binScale = Math.floor((maxVoteIndex - binX - (binY * numXBins) - (binAngle * numXYBins)) / numXYAngleBins);

  //console.log("hough voted: ", {binX, binY, binAngle, binScale, maxVoteIndex});

  const houghMatches = [];
  for (let i = 0; i < matches.length; i++) {
    if (!querypointValids[i]) continue;

    const queryBins = querypointBinLocations[i];
    // compute bin difference
    const distBinX = Math.abs(queryBins.binX - (binX+0.5));
    if (distBinX >= kHoughBinDelta) continue;

    const distBinY = Math.abs(queryBins.binY - (binY+0.5));
    if (distBinY >= kHoughBinDelta) continue;

    const distBinScale = Math.abs(queryBins.binScale - (binScale+0.5));
    if (distBinScale >= kHoughBinDelta) continue;

    const temp = Math.abs(queryBins.binAngle - (binAngle+0.5));
    const distBinAngle = Math.min(temp, numAngleBins - temp);
    if (distBinAngle >= kHoughBinDelta) continue;

    houghMatches.push(matches[i]);
  }
  return houghMatches;
}

const _mapCorrespondence = ({querypoint, keypoint, keycenterX, keycenterY, scaleOneOverLogK}) => {
  // map angle to (-pi, pi]
  let angle = querypoint.angle - keypoint.angle;
  if (angle <= -Math.PI) angle += 2*Math.PI;
  else if (angle > Math.PI) angle -= 2*Math.PI;

  const scale = querypoint.scale / keypoint.scale;

  // 2x2 similarity
  const cos = scale * Math.cos(angle);
  const sin = scale * Math.sin(angle);
  const S = [cos, -sin, sin, cos];

  const tp = [
    S[0] * keypoint.x + S[1] * keypoint.y,
    S[2] * keypoint.x + S[3] * keypoint.y
  ];
  const tx = querypoint.x - tp[0];
  const ty = querypoint.y - tp[1];

  return {
    x: S[0] * keycenterX + S[1] * keycenterY + tx,
    y: S[2] * keycenterX + S[3] * keycenterY + ty,
    angle: angle,
    scale: Math.log(scale) * scaleOneOverLogK
  }
}

module.exports = {
  computeHoughMatches
}


/***/ }),

/***/ "./src/image-target/matching/matcher.js":
/*!**********************************************!*\
  !*** ./src/image-target/matching/matcher.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {match} = __webpack_require__(/*! ./matching */ "./src/image-target/matching/matching.js");

class Matcher {
  constructor(queryWidth, queryHeight, debugMode = false) {
    this.queryWidth = queryWidth;
    this.queryHeight = queryHeight;
    this.debugMode = debugMode;
  }

  matchDetection(keyframes, featurePoints) {
    let debugExtra = {frames: []};

    let bestResult = null;
    for (let i = 0; i < keyframes.length; i++) {
      const {H, matches, debugExtra: frameDebugExtra} = match({keyframe: keyframes[i], querypoints: featurePoints, querywidth: this.queryWidth, queryheight: this.queryHeight, debugMode: this.debugMode});
      debugExtra.frames.push(frameDebugExtra);

      if (H) {
	if (bestResult === null || bestResult.matches.length < matches.length) {
	  bestResult = {keyframeIndex: i, H, matches};
	}
      }
    }

    if (bestResult === null) {
      return {keyframeIndex: -1, debugExtra};
    }

    const screenCoords = [];
    const worldCoords = [];
    const keyframe = keyframes[bestResult.keyframeIndex];
    for (let i = 0; i < bestResult.matches.length; i++) {
      const querypoint = bestResult.matches[i].querypoint;
      const keypoint = bestResult.matches[i].keypoint;
      screenCoords.push({
        x: querypoint.x,
        y: querypoint.y,
      })
      worldCoords.push({
        x: (keypoint.x + 0.5) / keyframe.scale,
        y: (keypoint.y + 0.5) / keyframe.scale,
        z: 0,
      })
    }
    return {screenCoords, worldCoords, keyframeIndex: bestResult.keyframeIndex, debugExtra};
  }
}

module.exports = {
  Matcher
}


/***/ }),

/***/ "./src/image-target/matching/matching.js":
/*!***********************************************!*\
  !*** ./src/image-target/matching/matching.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const TinyQueue = __webpack_require__(/*! tinyqueue */ "./node_modules/tinyqueue/index.js").default;
const {compute: hammingCompute} = __webpack_require__(/*! ./hamming-distance.js */ "./src/image-target/matching/hamming-distance.js");
const {computeHoughMatches} = __webpack_require__(/*! ./hough.js */ "./src/image-target/matching/hough.js");
const {computeHomography} = __webpack_require__(/*! ./ransacHomography.js */ "./src/image-target/matching/ransacHomography.js");
const {multiplyPointHomographyInhomogenous, matrixInverse33} = __webpack_require__(/*! ../utils/geometry.js */ "./src/image-target/utils/geometry.js");

const INLIER_THRESHOLD = 3;
//const MIN_NUM_INLIERS = 8;  //default
const MIN_NUM_INLIERS = 6;
const CLUSTER_MAX_POP = 8;
const HAMMING_THRESHOLD = 0.7;

// match list of querpoints against pre-built list of keyframes
const match = ({keyframe, querypoints, querywidth, queryheight, debugMode}) => {
  let debugExtra = {};

  const matches = [];
  for (let j = 0; j < querypoints.length; j++) {
    const querypoint = querypoints[j];
    const keypoints = querypoint.maxima? keyframe.maximaPoints: keyframe.minimaPoints;
    if (keypoints.length === 0) continue;

    const rootNode = querypoint.maxima? keyframe.maximaPointsCluster.rootNode: keyframe.minimaPointsCluster.rootNode;

    const keypointIndexes = [];
    const queue = new TinyQueue([], (a1, a2) => {return a1.d - a2.d});

    // query all potential keypoints
    _query({node: rootNode, keypoints, querypoint, queue, keypointIndexes, numPop: 0});

    let bestIndex = -1;
    let bestD1 = Number.MAX_SAFE_INTEGER;
    let bestD2 = Number.MAX_SAFE_INTEGER;

    for (let k = 0; k < keypointIndexes.length; k++) {
      const keypoint = keypoints[keypointIndexes[k]];

      const d = hammingCompute({v1: keypoint.descriptors, v2: querypoint.descriptors});
      if (d < bestD1) {
	bestD2 = bestD1;
	bestD1 = d;
	bestIndex = keypointIndexes[k];
      } else if (d < bestD2) {
	bestD2 = d;
      }
    }
    if (bestIndex !== -1 && (bestD2 === Number.MAX_SAFE_INTEGER || (1.0 * bestD1 / bestD2) < HAMMING_THRESHOLD)) {
      matches.push({querypoint, keypoint: keypoints[bestIndex]});
    }
  }

  if (debugMode) {
    debugExtra.matches = matches;
  }

  if (matches.length < MIN_NUM_INLIERS) return {debugExtra};

  const houghMatches = computeHoughMatches({
    keywidth: keyframe.width,
    keyheight: keyframe.height,
    querywidth,
    queryheight,
    matches,
  });

  if (debugMode) {
    debugExtra.houghMatches = houghMatches;
  }

  const H = computeHomography({
    srcPoints: houghMatches.map((m) => [m.keypoint.x, m.keypoint.y]),
    dstPoints: houghMatches.map((m) => [m.querypoint.x, m.querypoint.y]),
    keyframe,
  });

  if (H === null) return {debugExtra};

  const inlierMatches = _findInlierMatches({
    H,
    matches: houghMatches,
    threshold: INLIER_THRESHOLD
  });
  
  if (debugMode) {
    debugExtra.inlierMatches = inlierMatches;
  }

  if (inlierMatches.length < MIN_NUM_INLIERS) return {debugExtra}; 

  // do another loop of match using the homography
  const HInv = matrixInverse33(H, 0.00001);
  const dThreshold2 = 10 * 10;
  const matches2 = [];
  for (let j = 0; j < querypoints.length; j++) {
    const querypoint = querypoints[j];
    const mapquerypoint = multiplyPointHomographyInhomogenous([querypoint.x, querypoint.y], HInv);

    let bestIndex = -1;
    let bestD1 = Number.MAX_SAFE_INTEGER;
    let bestD2 = Number.MAX_SAFE_INTEGER;

    const keypoints = querypoint.maxima? keyframe.maximaPoints: keyframe.minimaPoints;

    for (let k = 0; k < keypoints.length; k++) {
      const keypoint = keypoints[k];

      // check distance threshold
      const d2 = (keypoint.x - mapquerypoint[0]) * (keypoint.x - mapquerypoint[0])
		+ (keypoint.y - mapquerypoint[1]) * (keypoint.y - mapquerypoint[1]);
      if (d2 > dThreshold2) continue;

      const d = hammingCompute({v1: keypoint.descriptors, v2: querypoint.descriptors});
      if (d < bestD1) {
	bestD2 = bestD1;
	bestD1 = d;
	bestIndex = k;
      } else if (d < bestD2) {
	bestD2 = d;
      }
    }

    if (bestIndex !== -1 && (bestD2 === Number.MAX_SAFE_INTEGER || (1.0 * bestD1 / bestD2) < HAMMING_THRESHOLD)) {
      matches2.push({querypoint, keypoint: keypoints[bestIndex]});
    }
  }

  if (debugMode) {
    debugExtra.matches2 = matches2;
  }

  const houghMatches2 = computeHoughMatches({
    keywidth: keyframe.width,
    keyheight: keyframe.height,
    querywidth,
    queryheight,
    matches: matches2,
  });

  if (debugMode) {
    debugExtra.houghMatches2 = houghMatches2;
  }

  const H2 = computeHomography({
    srcPoints: houghMatches2.map((m) => [m.keypoint.x, m.keypoint.y]),
    dstPoints: houghMatches2.map((m) => [m.querypoint.x, m.querypoint.y]),
    keyframe,
  });

  if (H2 === null) return {debugExtra};

  const inlierMatches2 = _findInlierMatches({
    H: H2,
    matches: houghMatches2,
    threshold: INLIER_THRESHOLD
  });

  if (debugMode) {
    debugExtra.inlierMatches2 = inlierMatches2;
  }

  return {H: H2, matches: inlierMatches2, debugExtra};
};

const _query = ({node, keypoints, querypoint, queue, keypointIndexes, numPop}) => {
  if (node.leaf) {
    for (let i = 0; i < node.pointIndexes.length; i++) {
      keypointIndexes.push(node.pointIndexes[i]);
    }
    return;
  }

  const distances = [];
  for (let i = 0; i < node.children.length; i++) {
    const childNode = node.children[i];
    const centerPointIndex = childNode.centerPointIndex;
    const d = hammingCompute({v1: keypoints[centerPointIndex].descriptors, v2: querypoint.descriptors});
    distances.push(d);
  }

  let minD = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < node.children.length; i++) {
    minD = Math.min(minD, distances[i]);
  }

  for (let i = 0; i < node.children.length; i++) {
    if (distances[i] !== minD) {
      queue.push({node: node.children[i], d: distances[i]});
    }
  }
  for (let i = 0; i < node.children.length; i++) {
    if (distances[i] === minD) {
      _query({node: node.children[i], keypoints, querypoint, queue, keypointIndexes, numPop});
    }
  }

  if (numPop < CLUSTER_MAX_POP && queue.length > 0) {
    const {node, d} = queue.pop();
    numPop += 1;
    _query({node, keypoints, querypoint, queue, keypointIndexes, numPop});
  }
};

const _findInlierMatches = (options) => {
  const {H, matches, threshold} = options;

  const threshold2 = threshold * threshold;

  const goodMatches = [];
  for (let i = 0; i < matches.length; i++) {
    const querypoint = matches[i].querypoint;
    const keypoint = matches[i].keypoint;
    const mp = multiplyPointHomographyInhomogenous([keypoint.x, keypoint.y], H);
    const d2 = (mp[0] - querypoint.x) * (mp[0] - querypoint.x) + (mp[1] - querypoint.y) * (mp[1] - querypoint.y);
    if (d2 <= threshold2) {
      goodMatches.push( matches[i] );
    }
  }
  return goodMatches;
}

module.exports = {
  match
}


/***/ }),

/***/ "./src/image-target/matching/ransacHomography.js":
/*!*******************************************************!*\
  !*** ./src/image-target/matching/ransacHomography.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Matrix, inverse} = __webpack_require__(/*! ml-matrix */ "./node_modules/ml-matrix/src/index.js");
const {createRandomizer} = __webpack_require__(/*! ../utils/randomizer.js */ "./src/image-target/utils/randomizer.js");
const {quadrilateralConvex, matrixInverse33, smallestTriangleArea, multiplyPointHomographyInhomogenous, checkThreePointsConsistent, checkFourPointsConsistent, determinant} = __webpack_require__(/*! ../utils/geometry.js */ "./src/image-target/utils/geometry.js");
const {solveHomography} = __webpack_require__(/*! ../utils/homography */ "./src/image-target/utils/homography.js");

const CAUCHY_SCALE = 0.01;
const CHUNK_SIZE = 10;
const NUM_HYPOTHESES = 20;
const NUM_HYPOTHESES_QUICK = 10;

// Using RANSAC to estimate homography
const computeHomography = (options) => {
  const {srcPoints, dstPoints, keyframe, quickMode} = options;

  // testPoints is four corners of keyframe
  const testPoints = [
    [0, 0],
    [keyframe.width, 0],
    [keyframe.width, keyframe.height],
    [0, keyframe.height]
  ]

  const sampleSize = 4; // use four points to compute homography
  if (srcPoints.length < sampleSize) return null;

  const scale = CAUCHY_SCALE;
  const oneOverScale2 = 1.0 / (scale * scale);
  const chuckSize = Math.min(CHUNK_SIZE, srcPoints.length);

  const randomizer = createRandomizer();

  const perm = [];
  for (let i = 0; i < srcPoints.length; i++) {
    perm[i] = i;
  }

  randomizer.arrayShuffle({arr: perm, sampleSize: perm.length});

  const numHypothesis = quickMode? NUM_HYPOTHESES_QUICK: NUM_HYPOTHESES;
  const maxTrials = numHypothesis * 2;

  // build numerous hypotheses by randoming draw four points
  // TODO: optimize: if number of points is less than certain number, can brute force all combinations
  let trial = 0;
  const Hs = [];
  while (trial < maxTrials && Hs.length < numHypothesis) {
    trial +=1;

    randomizer.arrayShuffle({arr: perm, sampleSize: sampleSize});

    // their relative positions match each other
    if (!checkFourPointsConsistent(
      srcPoints[perm[0]], srcPoints[perm[1]], srcPoints[perm[2]], srcPoints[perm[3]],
      dstPoints[perm[0]], dstPoints[perm[1]], dstPoints[perm[2]], dstPoints[perm[3]])) {
      continue;
    }

    const H = solveHomography(
      [srcPoints[perm[0]], srcPoints[perm[1]], srcPoints[perm[2]], srcPoints[perm[3]]],
      [dstPoints[perm[0]], dstPoints[perm[1]], dstPoints[perm[2]], dstPoints[perm[3]]],
    );
    if (H === null) continue;

    if(!_checkHomographyPointsGeometricallyConsistent({H, testPoints})) {
      continue;
    }

    Hs.push(H);
  }

  if (Hs.length === 0) return null;

  // pick the best hypothesis
  const hypotheses = [];
  for (let i = 0; i < Hs.length; i++) {
    hypotheses.push({
      H: Hs[i],
      cost: 0
    })
  }

  let curChuckSize = chuckSize;
  for (let i = 0; i < srcPoints.length && hypotheses.length > 2; i += curChuckSize) {
    curChuckSize = Math.min(chuckSize, srcPoints.length - i);
    let chuckEnd = i + curChuckSize;

    for (let j = 0; j < hypotheses.length; j++) {
      for (let k = i; k < chuckEnd; k++) {
        const cost = _cauchyProjectiveReprojectionCost({H: hypotheses[j].H, srcPoint: srcPoints[k], dstPoint: dstPoints[k], oneOverScale2});
        hypotheses[j].cost += cost;
      }
    }

    hypotheses.sort((h1, h2) => {return h1.cost - h2.cost});
    hypotheses.splice(-Math.floor((hypotheses.length+1)/2)); // keep the best half
  }

  let finalH = null;
  for (let i = 0; i < hypotheses.length; i++) {
    const H = _normalizeHomography({inH: hypotheses[i].H});
    if (_checkHeuristics({H: H, testPoints, keyframe})) {
      finalH = H;
      break;
    }
  }
  return finalH;
}

const _checkHeuristics = ({H, testPoints, keyframe}) => {
  const HInv = matrixInverse33(H, 0.00001);
  if (HInv === null) return false;

  const mp = []
  for (let i = 0; i < testPoints.length; i++) { // 4 test points, corner of keyframe
    mp.push(multiplyPointHomographyInhomogenous(testPoints[i], HInv));
  }
  const smallArea = smallestTriangleArea(mp[0], mp[1], mp[2], mp[3]);

  if (smallArea < keyframe.width * keyframe.height * 0.0001) return false;

  if (!quadrilateralConvex(mp[0], mp[1], mp[2], mp[3])) return false;

  return true;
}

const _normalizeHomography = ({inH}) => {
  const oneOver = 1.0 / inH[8];

  const H = [];
  for (let i = 0; i < 8; i++) {
    H[i] = inH[i] * oneOver;
  }
  H[8] = 1.0;
  return H;
}

const _cauchyProjectiveReprojectionCost = ({H, srcPoint, dstPoint, oneOverScale2}) => {
  const x = multiplyPointHomographyInhomogenous(srcPoint, H);
  const f =[
    x[0] - dstPoint[0],
    x[1] - dstPoint[1]
  ];
  return Math.log(1 + (f[0]*f[0]+f[1]*f[1]) * oneOverScale2);
}

const _checkHomographyPointsGeometricallyConsistent = ({H, testPoints}) => {
  const mappedPoints = [];
  for (let i = 0; i < testPoints.length; i++) {
    mappedPoints[i] = multiplyPointHomographyInhomogenous(testPoints[i], H);
  }
  for (let i = 0; i < testPoints.length; i++) {
    const i1 = i;
    const i2 = (i+1) % testPoints.length;
    const i3 = (i+2) % testPoints.length;
    if (!checkThreePointsConsistent(
      testPoints[i1], testPoints[i2], testPoints[i3],
      mappedPoints[i1], mappedPoints[i2], mappedPoints[i3])) return false;
  }
  return true;
}

module.exports = {
  computeHomography,
}


/***/ }),

/***/ "./src/image-target/utils/geometry.js":
/*!********************************************!*\
  !*** ./src/image-target/utils/geometry.js ***!
  \********************************************/
/***/ ((module) => {

// check which side point C on the line from A to B
const linePointSide = (A, B, C) => {
  return ((B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]));
}

// srcPoints, dstPoints: array of four elements [x, y]
const checkFourPointsConsistent = (x1, x2, x3, x4, x1p, x2p, x3p, x4p) => {
  if ((linePointSide(x1, x2, x3) > 0) !== (linePointSide(x1p, x2p, x3p) > 0)) return false;
  if ((linePointSide(x2, x3, x4) > 0) !== (linePointSide(x2p, x3p, x4p) > 0)) return false;
  if ((linePointSide(x3, x4, x1) > 0) !== (linePointSide(x3p, x4p, x1p) > 0)) return false;
  if ((linePointSide(x4, x1, x2) > 0) !== (linePointSide(x4p, x1p, x2p) > 0)) return false;
  return true;
}

const checkThreePointsConsistent = (x1, x2, x3, x1p, x2p, x3p) => {
  if ((linePointSide(x1, x2, x3) > 0) !== (linePointSide(x1p, x2p, x3p) > 0)) return false;
  return true;
}

const determinant = (A) => {
  const C1 =  A[4] * A[8] - A[5] * A[7];
  const C2 =  A[3] * A[8] - A[5] * A[6];
  const C3 =  A[3] * A[7] - A[4] * A[6];
  return A[0] * C1 - A[1] * C2 + A[2] * C3;
}

const matrixInverse33 = (A, threshold) => {
  const det = determinant(A);
  if (Math.abs(det) <= threshold) return null;
  const oneOver = 1.0 / det;

  const B = [
    (A[4] * A[8] - A[5] * A[7]) * oneOver,
    (A[2] * A[7] - A[1] * A[8]) * oneOver,
    (A[1] * A[5] - A[2] * A[4]) * oneOver,
    (A[5] * A[6] - A[3] * A[8]) * oneOver,
    (A[0] * A[8] - A[2] * A[6]) * oneOver,
    (A[2] * A[3] - A[0] * A[5]) * oneOver,
    (A[3] * A[7] - A[4] * A[6]) * oneOver,
    (A[1] * A[6] - A[0] * A[7]) * oneOver,
    (A[0] * A[4] - A[1] * A[3]) * oneOver,
  ];
  return B;
}

const matrixMul33 = (A, B) => {
  const C = [];
  C[0] = A[0]*B[0] + A[1]*B[3] + A[2]*B[6];
  C[1] = A[0]*B[1] + A[1]*B[4] + A[2]*B[7];
  C[2] = A[0]*B[2] + A[1]*B[5] + A[2]*B[8];
  C[3] = A[3]*B[0] + A[4]*B[3] + A[5]*B[6];
  C[4] = A[3]*B[1] + A[4]*B[4] + A[5]*B[7];
  C[5] = A[3]*B[2] + A[4]*B[5] + A[5]*B[8];
  C[6] = A[6]*B[0] + A[7]*B[3] + A[8]*B[6];
  C[7] = A[6]*B[1] + A[7]*B[4] + A[8]*B[7];
  C[8] = A[6]*B[2] + A[7]*B[5] + A[8]*B[8];
  return C;
}

const multiplyPointHomographyInhomogenous = (x, H) => {
  const w = H[6]*x[0] + H[7]*x[1] + H[8];
  const xp = [];
  xp[0] = (H[0]*x[0] + H[1]*x[1] + H[2])/w;
  xp[1] = (H[3]*x[0] + H[4]*x[1] + H[5])/w;
  return xp;
}

const smallestTriangleArea = (x1, x2, x3, x4) => {
  const v12 = _vector(x2, x1);
  const v13 = _vector(x3, x1);
  const v14 = _vector(x4, x1);
  const v32 = _vector(x2, x3);
  const v34 = _vector(x4, x3);
  const a1 = _areaOfTriangle(v12, v13);
  const a2 = _areaOfTriangle(v13, v14);
  const a3 = _areaOfTriangle(v12, v14);
  const a4 = _areaOfTriangle(v32, v34);
  return Math.min(Math.min(Math.min(a1, a2), a3), a4);
}

// check if four points form a convex quadrilaternal.
// all four combinations should have same sign
const quadrilateralConvex = (x1, x2, x3, x4) => {
  const first = linePointSide(x1, x2, x3) <= 0;
  if ( (linePointSide(x2, x3, x4) <= 0) !== first) return false;
  if ( (linePointSide(x3, x4, x1) <= 0) !== first) return false;
  if ( (linePointSide(x4, x1, x2) <= 0) !== first) return false;

  //if (linePointSide(x1, x2, x3) <= 0) return false;
  //if (linePointSide(x2, x3, x4) <= 0) return false;
  //if (linePointSide(x3, x4, x1) <= 0) return false;
  //if (linePointSide(x4, x1, x2) <= 0) return false;
  return true;
}

const _vector = (a, b) => {
  return [
    a[0] - b[0],
    a[1] - b[1]
  ]
}

const _areaOfTriangle = (u, v) => {
  const a = u[0]*v[1] - u[1]*v[0];
  return Math.abs(a) * 0.5;
}

module.exports = {
  matrixInverse33,
  matrixMul33,
  quadrilateralConvex,
  smallestTriangleArea,
  multiplyPointHomographyInhomogenous,
  checkThreePointsConsistent,
  checkFourPointsConsistent,
  determinant
}



/***/ }),

/***/ "./src/image-target/utils/homography.js":
/*!**********************************************!*\
  !*** ./src/image-target/utils/homography.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Matrix, inverse} = __webpack_require__(/*! ml-matrix */ "./node_modules/ml-matrix/src/index.js");

const solveHomography = (srcPoints, dstPoints) => {
  const {normPoints: normSrcPoints, param: srcParam} = _normalizePoints(srcPoints);
  const {normPoints: normDstPoints, param: dstParam} = _normalizePoints(dstPoints);

  const num = normDstPoints.length;
  const AData = [];
  const BData = [];
  for (let j = 0; j < num; j++) {
    const row1 = [
      normSrcPoints[j][0],
      normSrcPoints[j][1],
      1,
      0,
      0,
      0,
      -(normSrcPoints[j][0] * normDstPoints[j][0]),
      -(normSrcPoints[j][1] * normDstPoints[j][0]),
    ];
    const row2 = [
      0,
      0,
      0,
      normSrcPoints[j][0],
      normSrcPoints[j][1],
      1,
      -(normSrcPoints[j][0] * normDstPoints[j][1]),
      -(normSrcPoints[j][1] * normDstPoints[j][1]),
    ];
    AData.push(row1);
    AData.push(row2);

    BData.push([normDstPoints[j][0]]);
    BData.push([normDstPoints[j][1]]);
  }

  try {
    const A = new Matrix(AData);
    const B = new Matrix(BData);
    const AT = A.transpose();
    const ATA = AT.mmul(A);
    const ATB = AT.mmul(B);
    const ATAInv = inverse(ATA);
    const C = ATAInv.mmul(ATB).to1DArray();
    const H = _denormalizeHomography(C, srcParam, dstParam);
    return H;
  } catch (e) {
    return null;
  }
}

// centroid at origin and avg distance from origin is sqrt(2)
const _normalizePoints = (coords) => {
  //return {normalizedCoords: coords, param: {meanX: 0, meanY: 0, s: 1}}; // skip normalization

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < coords.length; i++) {
    sumX += coords[i][0];
    sumY += coords[i][1];
  }
  let meanX = sumX / coords.length;
  let meanY = sumY / coords.length;

  let sumDiff = 0;
  for (let i = 0; i < coords.length; i++) {
    const diffX = coords[i][0] - meanX;
    const diffY = coords[i][1] - meanY;
    sumDiff += Math.sqrt(diffX * diffX + diffY * diffY);
  }
  let s = Math.sqrt(2) * coords.length / sumDiff;

  const normPoints = [];
  for (let i = 0; i < coords.length; i++) {
    normPoints.push([
      (coords[i][0] - meanX) * s,
      (coords[i][1] - meanY) * s,
    ]);
  }
  return {normPoints, param: {meanX, meanY, s}};
}

// Denormalize homography
// where T is the normalization matrix, i.e.
//
//     [1  0  -meanX]
// T = [0  1  -meanY]
//     [0  0     1/s]
//
//          [1  0  s*meanX]
// inv(T) = [0  1  s*meanY]
// 	    [0  0        s]
//
// H = inv(Tdst) * Hn * Tsrc
//
// @param {
//   nH: normH,
//   srcParam: param of src transform,
//   dstParam: param of dst transform
// }
const _denormalizeHomography = (nH, srcParam, dstParam) => {
  /*
  Matrix version
  const normH = new Matrix([
    [nH[0], nH[1], nH[2]],
    [nH[3], nH[4], nH[5]],
    [nH[6], nH[7], 1],
  ]);
  const Tsrc = new Matrix([
    [1, 0, -srcParam.meanX],
    [0, 1, -srcParam.meanY],
    [0, 0,    1/srcParam.s],
  ]);

  const invTdst = new Matrix([
    [1, 0, dstParam.s * dstParam.meanX],
    [0, 1, dstParam.s * dstParam.meanY],
    [0, 0, dstParam.s],
  ]);
  const H = invTdst.mmul(normH).mmul(Tsrc);
  */

  // plain implementation of the above using Matrix
  const sMeanX = dstParam.s * dstParam.meanX;
  const sMeanY = dstParam.s * dstParam.meanY;

  const H = [
      nH[0] + sMeanX * nH[6], 
      nH[1] + sMeanX * nH[7],
      (nH[0] + sMeanX * nH[6]) * -srcParam.meanX + (nH[1] + sMeanX * nH[7]) * -srcParam.meanY + (nH[2] + sMeanX) / srcParam.s,
      nH[3] + sMeanY * nH[6], 
      nH[4] + sMeanY * nH[7],
      (nH[3] + sMeanY * nH[6]) * -srcParam.meanX + (nH[4] + sMeanY * nH[7]) * -srcParam.meanY + (nH[5] + sMeanY) / srcParam.s,
      dstParam.s * nH[6],
      dstParam.s * nH[7],
      dstParam.s * nH[6] * -srcParam.meanX + dstParam.s * nH[7] * -srcParam.meanY + dstParam.s / srcParam.s,
  ];

  // make H[8] === 1;
  for (let i = 0; i < 9; i++) {
    H[i] = H[i] / H[8];
  }
  return H;
}

module.exports = {
  solveHomography
}


/***/ }),

/***/ "./src/image-target/utils/randomizer.js":
/*!**********************************************!*\
  !*** ./src/image-target/utils/randomizer.js ***!
  \**********************************************/
/***/ ((module) => {

const mRandSeed = 1234;

const createRandomizer = () => {
  const randomizer = {
    seed: mRandSeed,

    arrayShuffle(options) {
      const {arr, sampleSize} = options;
      for (let i = 0; i < sampleSize; i++) {

        this.seed = (214013 * this.seed + 2531011) % (1 << 31);
        let k = (this.seed >> 16) & 0x7fff;
        k = k % arr.length;

        let tmp = arr[i];
        arr[i] = arr[k];
        arr[k] = tmp;
      }
    },

    nextInt(maxValue) {
      this.seed = (214013 * this.seed + 2531011) % (1 << 31);
      let k = (this.seed >> 16) & 0x7fff;
      k = k % maxValue;
      return k;
    }
  }
  return randomizer;
}

module.exports = {
  createRandomizer
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************************!*\
  !*** ./src/image-target/controller.worker.js ***!
  \***********************************************/
const {Matcher} = __webpack_require__(/*! ./matching/matcher.js */ "./src/image-target/matching/matcher.js");
const {Estimator} = __webpack_require__(/*! ./estimation/estimator.js */ "./src/image-target/estimation/estimator.js");

let projectionTransform = null;
let matchingDataList = null;
let debugMode = false;
let matcher = null;
let estimator = null;

onmessage = (msg) => {
  const {data} = msg;

  if (data.type === 'setup') {
    projectionTransform = data.projectionTransform;
    matchingDataList = data.matchingDataList;
    debugMode = data.debugMode;
    matcher = new Matcher(data.inputWidth, data.inputHeight, debugMode);
    estimator = new Estimator(data.projectionTransform);
  }
  else if (data.type === 'match') {
    const interestedTargetIndexes = data.targetIndexes;

    let matchedTargetIndex = -1;
    let matchedModelViewTransform = null;
    let matchedDebugExtra = null;

    for (let i = 0; i < interestedTargetIndexes.length; i++) {
      const matchingIndex = interestedTargetIndexes[i];

      const {keyframeIndex, screenCoords, worldCoords, debugExtra} = matcher.matchDetection(matchingDataList[matchingIndex], data.featurePoints);
      matchedDebugExtra = debugExtra;

      if (keyframeIndex !== -1) {
	const modelViewTransform = estimator.estimate({screenCoords, worldCoords});

	if (modelViewTransform) {
	  matchedTargetIndex = matchingIndex;
	  matchedModelViewTransform = modelViewTransform;
	}
	break;
      }
    }

    postMessage({
      type: 'matchDone',
      targetIndex: matchedTargetIndex,
      modelViewTransform: matchedModelViewTransform,
      debugExtra: matchedDebugExtra
    });
  }
  else if (data.type === 'trackUpdate') {
    const {modelViewTransform, worldCoords, screenCoords} = data;
    const finalModelViewTransform = estimator.refineEstimate({initialModelViewTransform: modelViewTransform, worldCoords, screenCoords});
    postMessage({
      type: 'trackUpdateDone',
      modelViewTransform: finalModelViewTransform,
    });
  }
};


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9ub2RlX21vZHVsZXMvaXMtYW55LWFycmF5L3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9ub2RlX21vZHVsZXMvbWwtYXJyYXktbWF4L2xpYi1lczYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvbm9kZV9tb2R1bGVzL21sLWFycmF5LW1pbi9saWItZXM2L2luZGV4LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L25vZGVfbW9kdWxlcy9tbC1hcnJheS1yZXNjYWxlL2xpYi1lczYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL2NvcnJlbGF0aW9uLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9jb3ZhcmlhbmNlLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9kYy9jaG9sZXNreS5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvZGMvZXZkLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9kYy9sdS5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvZGMvbmlwYWxzLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9kYy9xci5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvZGMvc3ZkLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9kYy91dGlsLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9kZWNvbXBvc2l0aW9ucy5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvZGV0ZXJtaW5hbnQuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL2luZGV4LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9pbnNwZWN0LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9saW5lYXJEZXBlbmRlbmNpZXMuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL21hdGhPcGVyYXRpb25zLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy9tYXRyaXguanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3BzZXVkb0ludmVyc2UuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3N0YXQuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3ZpZXdzL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3ZpZXdzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvdmlld3MvY29sdW1uU2VsZWN0aW9uLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy92aWV3cy9mbGlwQ29sdW1uLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy92aWV3cy9mbGlwUm93LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy92aWV3cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvdmlld3Mvcm93LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy92aWV3cy9yb3dTZWxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3ZpZXdzL3NlbGVjdGlvbi5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvdmlld3Mvc3ViLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy92aWV3cy90cmFuc3Bvc2UuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL25vZGVfbW9kdWxlcy9tbC1tYXRyaXgvc3JjL3dyYXAvV3JhcHBlck1hdHJpeDFELmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvbWwtbWF0cml4L3NyYy93cmFwL1dyYXBwZXJNYXRyaXgyRC5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vbm9kZV9tb2R1bGVzL21sLW1hdHJpeC9zcmMvd3JhcC93cmFwLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9ub2RlX21vZHVsZXMvdGlueXF1ZXVlL2luZGV4LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L2VzdGltYXRpb24vZXN0aW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvZXN0aW1hdGlvbi9lc3RpbWF0b3IuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvZXN0aW1hdGlvbi9yZWZpbmUtZXN0aW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvZXN0aW1hdGlvbi91dGlscy5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC9tYXRjaGluZy9oYW1taW5nLWRpc3RhbmNlLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L21hdGNoaW5nL2hvdWdoLmpzIiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L21hdGNoaW5nL21hdGNoZXIuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvbWF0Y2hpbmcvbWF0Y2hpbmcuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci8uL3NyYy9pbWFnZS10YXJnZXQvbWF0Y2hpbmcvcmFuc2FjSG9tb2dyYXBoeS5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC91dGlscy9nZW9tZXRyeS5qcyIsIndlYnBhY2s6Ly9taW5kLWFyLy4vc3JjL2ltYWdlLXRhcmdldC91dGlscy9ob21vZ3JhcGh5LmpzIiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L3V0aWxzL3JhbmRvbWl6ZXIuanMiLCJ3ZWJwYWNrOi8vbWluZC1hci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW5kLWFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9taW5kLWFyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWluZC1hci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21pbmQtYXIvLi9zcmMvaW1hZ2UtdGFyZ2V0L2NvbnRyb2xsZXIud29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FB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QUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0EsUUFBUSx5REFBTyxPQUFPLHdCQUF3QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxXQUFXLG1CQUFtQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBLFFBQVEseURBQU87QUFDZjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLFlBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQyxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsT0FBTztBQUMxQixxQkFBcUIsT0FBTztBQUM1Qix1QkFBdUIsT0FBTztBQUM5Qix5QkFBeUIsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxpREFBVTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkMsK0JBQStCLGdCQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkMsK0JBQStCLGdCQUFnQjtBQUMvQztBQUNBLDBEQUEwRCxXQUFXO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDLDRCQUE0QixhQUFhO0FBQ3pDO0FBQ0EsNkRBQTZELFdBQVc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxpREFBVTtBQUNkLG1CQUFtQixpQkFBaUI7QUFDcEMscUJBQXFCLG9CQUFvQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLG1EQUFZO0FBQzlCO0FBQ0EsbUJBQW1CLHdCQUF3QjtBQUMzQztBQUNBLHFCQUFxQiwyQkFBMkI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLCtDQUFRO0FBQ3ZCO0FBQ0EsZUFBZSxrREFBVztBQUMxQjtBQUNBLGVBQWUsNkNBQU07QUFDckI7QUFDQSwyQ0FBMkMsR0FBRztBQUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbURBQVk7QUFDM0I7QUFDQSxlQUFlLHNEQUFlO0FBQzlCO0FBQ0EsZUFBZSxpREFBVTtBQUN6QjtBQUNBLDJDQUEyQyxHQUFHO0FBQzlDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZUFBZTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxHQUFHO0FBQzlDO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyx3Q0FBd0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0RBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsdURBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGtEQUFXO0FBQzFCO0FBQ0E7QUFDQSwyQ0FBMkMsR0FBRztBQUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcseUJBQXlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLGtEQUFXO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEscURBQWM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxnREFBUztBQUNqQjtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsR0FBRztBQUM5QztBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFhO0FBQy9CLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxpREFBVTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1REFBZ0I7QUFDbEMsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLG9EQUFhO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtEQUFXO0FBQzdCLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSwrQ0FBUTtBQUNoQjtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsR0FBRztBQUM5QztBQUNBOztBQUVBO0FBQ0EsV0FBVyxrRUFBd0I7QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sbURBQWE7QUFDbkI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLG9EQUFhO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9EQUFhO0FBQ2pCLDhCQUE4QixxREFBYztBQUM1QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUksdURBQWdCO0FBQ3BCLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0EscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBLDZCQUE2QixrQkFBa0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksdURBQWdCO0FBQ3BCLFlBQVksd0RBQWlCO0FBQzdCLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQSxZQUFZLFdBQVc7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxzQkFBc0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzRUFBcUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25pRE07QUFDRzs7QUFFdkI7QUFDUCxXQUFXLHdEQUFrQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNENBQUcsVUFBVSxzQkFBc0I7O0FBRTNEO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsaURBQVc7QUFDM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQmtDOztBQUUzQjtBQUNQLFlBQVksK0NBQVE7QUFDcEIsaUJBQWlCLGlCQUFpQjtBQUNsQyxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUCxZQUFZLCtDQUFRO0FBQ3BCLGlCQUFpQixpQkFBaUI7QUFDbEMsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQLFlBQVksK0NBQVE7QUFDcEIsaUJBQWlCLGlCQUFpQjtBQUNsQyxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUCxZQUFZLCtDQUFRO0FBQ3BCLGlCQUFpQixpQkFBaUI7QUFDbEMsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsVUFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsVUFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsVUFBVTtBQUMzQixtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRU87QUFDUCxpQkFBaUIsaUJBQWlCO0FBQ2xDLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUCxpQkFBaUIsaUJBQWlCO0FBQ2xDLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUCxpQkFBaUIsaUJBQWlCO0FBQ2xDLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQLGlCQUFpQixpQkFBaUI7QUFDbEMsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1AsaUJBQWlCLGlCQUFpQjtBQUNsQyxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckMsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1AsaUJBQWlCLGlCQUFpQjtBQUNsQyxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxRQUFRO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxRQUFRO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLGFBQWE7QUFDeEIsWUFBWTtBQUNaLFlBQVk7QUFDWjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsYUFBYTtBQUN4QixZQUFZO0FBQ1osWUFBWTtBQUNaO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsS0FBSztBQUNoQztBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEoyQzs7QUFFNUIsdUJBQXVCLG1EQUFjO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUMkM7O0FBRWI7O0FBRWYsK0JBQStCLDBDQUFRO0FBQ3REO0FBQ0EsSUFBSSx1REFBZ0I7QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjZDOztBQUVmOztBQUVmLHdDQUF3QywwQ0FBUTtBQUMvRDtBQUNBLG9CQUFvQix5REFBa0I7QUFDdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25COEI7O0FBRWYsbUNBQW1DLDBDQUFRO0FBQzFEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmOEI7O0FBRWYsZ0NBQWdDLDBDQUFRO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZnVEO0FBQ2tCO0FBQ1Y7QUFDTjtBQUNSO0FBQ2tCO0FBQ047QUFDWjtBQUNZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSckI7O0FBRVY7O0FBRWYsNEJBQTRCLDBDQUFRO0FBQ25EO0FBQ0EsSUFBSSxvREFBYTtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25CMEM7O0FBRVo7O0FBRWYscUNBQXFDLDBDQUFRO0FBQzVEO0FBQ0EsaUJBQWlCLHNEQUFlO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkJ1Qzs7QUFFVDs7QUFFZixrQ0FBa0MsMENBQVE7QUFDekQ7QUFDQSxrQkFBa0IsbURBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0JxQzs7QUFFUDs7QUFFZiw0QkFBNEIsMENBQVE7QUFDbkQ7QUFDQSxJQUFJLGlEQUFVO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQjhCOztBQUVmLGtDQUFrQywwQ0FBUTtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZjJDOztBQUU1Qiw4QkFBOEIsbURBQWM7QUFDM0QsZ0NBQWdDO0FBQ2hDLFdBQVcsV0FBVzs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdCMkM7O0FBRTVCLDhCQUE4QixtREFBYztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCZ0Q7QUFDQTs7QUFFekM7QUFDUDtBQUNBO0FBQ0EsaUJBQWlCLHFEQUFlO0FBQ2hDLEtBQUs7QUFDTCxpQkFBaUIscURBQWU7QUFDaEM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1plO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsUUFBUTtBQUN4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLGNBQWM7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOUVBLE9BQU8sZ0JBQWdCLEdBQUcsbUJBQU8sQ0FBQyx3REFBVztBQUM3QyxPQUFPLGdCQUFnQixHQUFHLG1CQUFPLENBQUMsbUVBQXFCOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwrQ0FBK0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDakVBLE9BQU8sU0FBUyxHQUFHLG1CQUFPLENBQUMsZ0VBQWU7QUFDMUMsT0FBTyxlQUFlLEdBQUcsbUJBQU8sQ0FBQyw4RUFBc0I7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLDBCQUEwQjtBQUN0Qyx5Q0FBeUMseUVBQXlFO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixxREFBcUQ7QUFDekUsa0JBQWtCLHFEQUFxRDtBQUN2RSxzREFBc0Qsb0dBQW9HO0FBQzFKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDMUJBLE9BQU8sZ0JBQWdCLEdBQUcsbUJBQU8sQ0FBQyx3REFBVztBQUM3QyxPQUFPLDhHQUE4RyxHQUFHLG1CQUFPLENBQUMsMERBQVk7O0FBRTVJLDRCQUE0QjtBQUM1QixzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQjtBQUNBLHFCQUFxQjtBQUNyQix3QkFBd0I7O0FBRXhCLHlCQUF5QiwwRUFBMEU7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsd0JBQXdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsd0JBQXdCO0FBQ3pDLGdDQUFnQyx3RUFBd0U7QUFDeEc7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBLGlCQUFpQix3QkFBd0I7QUFDekMsd0JBQXdCLHdKQUF3Sjs7QUFFaEw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0ZBQXNGO0FBQ3ZHOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQzs7QUFFQSxtQkFBbUIsd0JBQXdCO0FBQzNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHdCQUF3QjtBQUM3QztBQUNBO0FBQ0EseUJBQXlCLFlBQVk7O0FBRXJDO0FBQ0EscUJBQXFCLHdCQUF3QjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLHdCQUF3QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHdCQUF3QjtBQUMzQztBQUNBO0FBQ0E7O0FBRUEsK0JBQStCLGtHQUFrRzs7QUFFakk7QUFDQTs7QUFFQSx1QkFBdUIsT0FBTztBQUM5Qix5QkFBeUIsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsa0JBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsb0JBQW9CO0FBQy9DOztBQUVBLG9EQUFvRCx1QkFBdUI7QUFDM0U7QUFDQSxVQUFVO0FBQ1Y7O0FBRUEsb0NBQW9DLHVCQUF1QjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixrRkFBa0Y7QUFDdEc7QUFDQSxTQUFTLFFBQVE7O0FBRWpCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixtQkFBbUIsT0FBTztBQUMxQjtBQUNBLHFCQUFxQixPQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QjtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMzRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxPQUFPO0FBQ2hCOztBQUVBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDeEJBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLHNEQUFzRDs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0MsZUFBZTtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTs7QUFFQSxXQUFXLG1CQUFtQix1QkFBdUIsK0RBQStEOztBQUVwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixRQUFRO0FBQzVCOztBQUVBLHNCQUFzQixRQUFRO0FBQzlCOztBQUVBLDRCQUE0QixZQUFZO0FBQ3hDOztBQUVBLDhCQUE4QixZQUFZO0FBQzFDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDLDZDQUE2Qzs7QUFFL0U7QUFDQSxpQkFBaUIsb0JBQW9CO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLCtEQUErRDtBQUM1RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzdLQSxPQUFPLE1BQU0sR0FBRyxtQkFBTyxDQUFDLDJEQUFZOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7O0FBRXRCO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QyxhQUFhLHdDQUF3QyxVQUFVLDBJQUEwSTtBQUN6TTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsK0JBQStCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbERBLGtCQUFrQixpRkFBNEI7QUFDOUMsT0FBTyx3QkFBd0IsR0FBRyxtQkFBTyxDQUFDLDhFQUF1QjtBQUNqRSxPQUFPLG9CQUFvQixHQUFHLG1CQUFPLENBQUMsd0RBQVk7QUFDbEQsT0FBTyxrQkFBa0IsR0FBRyxtQkFBTyxDQUFDLDhFQUF1QjtBQUMzRCxPQUFPLHFEQUFxRCxHQUFHLG1CQUFPLENBQUMsa0VBQXNCOztBQUU3RjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsMERBQTBEO0FBQzFFOztBQUVBO0FBQ0EsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpREFBaUQsbUJBQW1COztBQUVwRTtBQUNBLFlBQVkseUVBQXlFOztBQUVyRjtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDRCQUE0QjtBQUMvQzs7QUFFQSxnQ0FBZ0MscURBQXFEO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJDQUEyQztBQUMvRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnREFBZ0Q7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNELFk7O0FBRXREO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsc0JBQXNCO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDQUFnQyxxREFBcUQ7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLDJDQUEyQztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFQSxpQkFBaUIsNERBQTREO0FBQzdFO0FBQ0EsbUJBQW1CLDhCQUE4QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBLDhCQUE4Qix3RUFBd0U7QUFDdEc7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTs7QUFFQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0Esa0JBQWtCLHdDQUF3QztBQUMxRDtBQUNBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBLGNBQWMsOEVBQThFO0FBQzVGO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxZQUFZLDREQUE0RDtBQUN4RTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxzQkFBc0I7O0FBRS9COztBQUVBO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOU5BLE9BQU8sZ0JBQWdCLEdBQUcsbUJBQU8sQ0FBQyx3REFBVztBQUM3QyxPQUFPLGlCQUFpQixHQUFHLG1CQUFPLENBQUMsc0VBQXdCO0FBQzNELE9BQU8sb0tBQW9LLEdBQUcsbUJBQU8sQ0FBQyxrRUFBc0I7QUFDNU0sT0FBTyxnQkFBZ0IsR0FBRyxtQkFBTyxDQUFDLG1FQUFxQjs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsMENBQTBDOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBOztBQUVBLDJCQUEyQixtQ0FBbUM7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixrQ0FBa0M7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsaUJBQWlCLCtDQUErQztBQUNoRTtBQUNBOztBQUVBLG1CQUFtQix1QkFBdUI7QUFDMUMscUJBQXFCLGNBQWM7QUFDbkMsd0RBQXdELGtGQUFrRjtBQUMxSTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLHlCQUF5QjtBQUMxRCw0REFBNEQ7QUFDNUQ7O0FBRUE7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDLG9DQUFvQyxxQkFBcUI7QUFDekQsMEJBQTBCLDJCQUEyQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLHdCQUF3QjtBQUNuRDtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVCQUF1QixPQUFPO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLCtCQUErQixJQUFJO0FBQ25DOztBQUVBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Q0FBNEMscUNBQXFDO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUF3RCxjQUFjO0FBQ3RFO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ25LQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEhBLE9BQU8sZ0JBQWdCLEdBQUcsbUJBQU8sQ0FBQyx3REFBVzs7QUFFN0M7QUFDQSxTQUFTLDJDQUEyQztBQUNwRCxTQUFTLDJDQUEyQzs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxrQ0FBa0MsMkJBQTJCOztBQUV6RTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxvQkFBb0I7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcEpBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLHFCQUFxQixnQkFBZ0I7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztVQ2hDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7O0FDTkEsT0FBTyxRQUFRLEdBQUcsbUJBQU8sQ0FBQyxxRUFBdUI7QUFDakQsT0FBTyxVQUFVLEdBQUcsbUJBQU8sQ0FBQyw2RUFBMkI7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTLEtBQUs7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsb0NBQW9DO0FBQ3ZEOztBQUVBLGFBQWEscURBQXFEO0FBQ2xFOztBQUVBO0FBQ0EsZ0RBQWdELDBCQUEwQjs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsV0FBVyw4Q0FBOEM7QUFDekQsOERBQThELHlFQUF5RTtBQUN2STtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSIsImZpbGUiOiJjb250cm9sbGVyLndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNBbnlBcnJheShvYmplY3QpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqZWN0KS5lbmRzV2l0aCgnQXJyYXldJyk7XG59XG4iLCJpbXBvcnQgaXNBcnJheSBmcm9tICdpcy1hbnktYXJyYXknO1xuXG5mdW5jdGlvbiBtYXgoaW5wdXQpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIGlmICghaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnB1dCBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gIH1cblxuICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW5wdXQgbXVzdCBub3QgYmUgZW1wdHknKTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRmcm9tSW5kZXggPSBvcHRpb25zLmZyb21JbmRleCxcbiAgICAgIGZyb21JbmRleCA9IF9vcHRpb25zJGZyb21JbmRleCA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJGZyb21JbmRleCxcbiAgICAgIF9vcHRpb25zJHRvSW5kZXggPSBvcHRpb25zLnRvSW5kZXgsXG4gICAgICB0b0luZGV4ID0gX29wdGlvbnMkdG9JbmRleCA9PT0gdm9pZCAwID8gaW5wdXQubGVuZ3RoIDogX29wdGlvbnMkdG9JbmRleDtcblxuICBpZiAoZnJvbUluZGV4IDwgMCB8fCBmcm9tSW5kZXggPj0gaW5wdXQubGVuZ3RoIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGZyb21JbmRleCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Zyb21JbmRleCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBzbWFsbGVyIHRoYW4gbGVuZ3RoJyk7XG4gIH1cblxuICBpZiAodG9JbmRleCA8PSBmcm9tSW5kZXggfHwgdG9JbmRleCA+IGlucHV0Lmxlbmd0aCB8fCAhTnVtYmVyLmlzSW50ZWdlcih0b0luZGV4KSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9JbmRleCBtdXN0IGJlIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIGZyb21JbmRleCBhbmQgYXQgbW9zdCBlcXVhbCB0byBsZW5ndGgnKTtcbiAgfVxuXG4gIHZhciBtYXhWYWx1ZSA9IGlucHV0W2Zyb21JbmRleF07XG5cbiAgZm9yICh2YXIgaSA9IGZyb21JbmRleCArIDE7IGkgPCB0b0luZGV4OyBpKyspIHtcbiAgICBpZiAoaW5wdXRbaV0gPiBtYXhWYWx1ZSkgbWF4VmFsdWUgPSBpbnB1dFtpXTtcbiAgfVxuXG4gIHJldHVybiBtYXhWYWx1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWF4O1xuIiwiaW1wb3J0IGlzQXJyYXkgZnJvbSAnaXMtYW55LWFycmF5JztcblxuZnVuY3Rpb24gbWluKGlucHV0KSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICBpZiAoIWlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW5wdXQgbXVzdCBiZSBhbiBhcnJheScpO1xuICB9XG5cbiAgaWYgKGlucHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2lucHV0IG11c3Qgbm90IGJlIGVtcHR5Jyk7XG4gIH1cblxuICB2YXIgX29wdGlvbnMkZnJvbUluZGV4ID0gb3B0aW9ucy5mcm9tSW5kZXgsXG4gICAgICBmcm9tSW5kZXggPSBfb3B0aW9ucyRmcm9tSW5kZXggPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyRmcm9tSW5kZXgsXG4gICAgICBfb3B0aW9ucyR0b0luZGV4ID0gb3B0aW9ucy50b0luZGV4LFxuICAgICAgdG9JbmRleCA9IF9vcHRpb25zJHRvSW5kZXggPT09IHZvaWQgMCA/IGlucHV0Lmxlbmd0aCA6IF9vcHRpb25zJHRvSW5kZXg7XG5cbiAgaWYgKGZyb21JbmRleCA8IDAgfHwgZnJvbUluZGV4ID49IGlucHV0Lmxlbmd0aCB8fCAhTnVtYmVyLmlzSW50ZWdlcihmcm9tSW5kZXgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmcm9tSW5kZXggbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIgc21hbGxlciB0aGFuIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKHRvSW5kZXggPD0gZnJvbUluZGV4IHx8IHRvSW5kZXggPiBpbnB1dC5sZW5ndGggfHwgIU51bWJlci5pc0ludGVnZXIodG9JbmRleCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RvSW5kZXggbXVzdCBiZSBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBmcm9tSW5kZXggYW5kIGF0IG1vc3QgZXF1YWwgdG8gbGVuZ3RoJyk7XG4gIH1cblxuICB2YXIgbWluVmFsdWUgPSBpbnB1dFtmcm9tSW5kZXhdO1xuXG4gIGZvciAodmFyIGkgPSBmcm9tSW5kZXggKyAxOyBpIDwgdG9JbmRleDsgaSsrKSB7XG4gICAgaWYgKGlucHV0W2ldIDwgbWluVmFsdWUpIG1pblZhbHVlID0gaW5wdXRbaV07XG4gIH1cblxuICByZXR1cm4gbWluVmFsdWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1pbjtcbiIsImltcG9ydCBpc0FycmF5IGZyb20gJ2lzLWFueS1hcnJheSc7XG5pbXBvcnQgbWF4IGZyb20gJ21sLWFycmF5LW1heCc7XG5pbXBvcnQgbWluIGZyb20gJ21sLWFycmF5LW1pbic7XG5cbmZ1bmN0aW9uIHJlc2NhbGUoaW5wdXQpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIGlmICghaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnB1dCBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gIH0gZWxzZSBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW5wdXQgbXVzdCBub3QgYmUgZW1wdHknKTtcbiAgfVxuXG4gIHZhciBvdXRwdXQ7XG5cbiAgaWYgKG9wdGlvbnMub3V0cHV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoIWlzQXJyYXkob3B0aW9ucy5vdXRwdXQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvdXRwdXQgb3B0aW9uIG11c3QgYmUgYW4gYXJyYXkgaWYgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgb3V0cHV0ID0gb3B0aW9ucy5vdXRwdXQ7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0gbmV3IEFycmF5KGlucHV0Lmxlbmd0aCk7XG4gIH1cblxuICB2YXIgY3VycmVudE1pbiA9IG1pbihpbnB1dCk7XG4gIHZhciBjdXJyZW50TWF4ID0gbWF4KGlucHV0KTtcblxuICBpZiAoY3VycmVudE1pbiA9PT0gY3VycmVudE1heCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdtaW5pbXVtIGFuZCBtYXhpbXVtIGlucHV0IHZhbHVlcyBhcmUgZXF1YWwuIENhbm5vdCByZXNjYWxlIGEgY29uc3RhbnQgYXJyYXknKTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRtaW4gPSBvcHRpb25zLm1pbixcbiAgICAgIG1pblZhbHVlID0gX29wdGlvbnMkbWluID09PSB2b2lkIDAgPyBvcHRpb25zLmF1dG9NaW5NYXggPyBjdXJyZW50TWluIDogMCA6IF9vcHRpb25zJG1pbixcbiAgICAgIF9vcHRpb25zJG1heCA9IG9wdGlvbnMubWF4LFxuICAgICAgbWF4VmFsdWUgPSBfb3B0aW9ucyRtYXggPT09IHZvaWQgMCA/IG9wdGlvbnMuYXV0b01pbk1heCA/IGN1cnJlbnRNYXggOiAxIDogX29wdGlvbnMkbWF4O1xuXG4gIGlmIChtaW5WYWx1ZSA+PSBtYXhWYWx1ZSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdtaW4gb3B0aW9uIG11c3QgYmUgc21hbGxlciB0aGFuIG1heCBvcHRpb24nKTtcbiAgfVxuXG4gIHZhciBmYWN0b3IgPSAobWF4VmFsdWUgLSBtaW5WYWx1ZSkgLyAoY3VycmVudE1heCAtIGN1cnJlbnRNaW4pO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRbaV0gPSAoaW5wdXRbaV0gLSBjdXJyZW50TWluKSAqIGZhY3RvciArIG1pblZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVzY2FsZTtcbiIsImltcG9ydCBNYXRyaXggZnJvbSAnLi9tYXRyaXgnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29ycmVsYXRpb24oeE1hdHJpeCwgeU1hdHJpeCA9IHhNYXRyaXgsIG9wdGlvbnMgPSB7fSkge1xuICB4TWF0cml4ID0gbmV3IE1hdHJpeCh4TWF0cml4KTtcbiAgbGV0IHlJc1NhbWUgPSBmYWxzZTtcbiAgaWYgKFxuICAgIHR5cGVvZiB5TWF0cml4ID09PSAnb2JqZWN0JyAmJlxuICAgICFNYXRyaXguaXNNYXRyaXgoeU1hdHJpeCkgJiZcbiAgICAhQXJyYXkuaXNBcnJheSh5TWF0cml4KVxuICApIHtcbiAgICBvcHRpb25zID0geU1hdHJpeDtcbiAgICB5TWF0cml4ID0geE1hdHJpeDtcbiAgICB5SXNTYW1lID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB5TWF0cml4ID0gbmV3IE1hdHJpeCh5TWF0cml4KTtcbiAgfVxuICBpZiAoeE1hdHJpeC5yb3dzICE9PSB5TWF0cml4LnJvd3MpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb3RoIG1hdHJpY2VzIG11c3QgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2Ygcm93cycpO1xuICB9XG5cbiAgY29uc3QgeyBjZW50ZXIgPSB0cnVlLCBzY2FsZSA9IHRydWUgfSA9IG9wdGlvbnM7XG4gIGlmIChjZW50ZXIpIHtcbiAgICB4TWF0cml4LmNlbnRlcignY29sdW1uJyk7XG4gICAgaWYgKCF5SXNTYW1lKSB7XG4gICAgICB5TWF0cml4LmNlbnRlcignY29sdW1uJyk7XG4gICAgfVxuICB9XG4gIGlmIChzY2FsZSkge1xuICAgIHhNYXRyaXguc2NhbGUoJ2NvbHVtbicpO1xuICAgIGlmICgheUlzU2FtZSkge1xuICAgICAgeU1hdHJpeC5zY2FsZSgnY29sdW1uJyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2R4ID0geE1hdHJpeC5zdGFuZGFyZERldmlhdGlvbignY29sdW1uJywgeyB1bmJpYXNlZDogdHJ1ZSB9KTtcbiAgY29uc3Qgc2R5ID0geUlzU2FtZVxuICAgID8gc2R4XG4gICAgOiB5TWF0cml4LnN0YW5kYXJkRGV2aWF0aW9uKCdjb2x1bW4nLCB7IHVuYmlhc2VkOiB0cnVlIH0pO1xuXG4gIGNvbnN0IGNvcnIgPSB4TWF0cml4LnRyYW5zcG9zZSgpLm1tdWwoeU1hdHJpeCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29yci5yb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvcnIuY29sdW1uczsgaisrKSB7XG4gICAgICBjb3JyLnNldChcbiAgICAgICAgaSxcbiAgICAgICAgaixcbiAgICAgICAgY29yci5nZXQoaSwgaikgKiAoMSAvIChzZHhbaV0gKiBzZHlbal0pKSAqICgxIC8gKHhNYXRyaXgucm93cyAtIDEpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3JyO1xufVxuIiwiaW1wb3J0IE1hdHJpeCBmcm9tICcuL21hdHJpeCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3ZhcmlhbmNlKHhNYXRyaXgsIHlNYXRyaXggPSB4TWF0cml4LCBvcHRpb25zID0ge30pIHtcbiAgeE1hdHJpeCA9IG5ldyBNYXRyaXgoeE1hdHJpeCk7XG4gIGxldCB5SXNTYW1lID0gZmFsc2U7XG4gIGlmIChcbiAgICB0eXBlb2YgeU1hdHJpeCA9PT0gJ29iamVjdCcgJiZcbiAgICAhTWF0cml4LmlzTWF0cml4KHlNYXRyaXgpICYmXG4gICAgIUFycmF5LmlzQXJyYXkoeU1hdHJpeClcbiAgKSB7XG4gICAgb3B0aW9ucyA9IHlNYXRyaXg7XG4gICAgeU1hdHJpeCA9IHhNYXRyaXg7XG4gICAgeUlzU2FtZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgeU1hdHJpeCA9IG5ldyBNYXRyaXgoeU1hdHJpeCk7XG4gIH1cbiAgaWYgKHhNYXRyaXgucm93cyAhPT0geU1hdHJpeC5yb3dzKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm90aCBtYXRyaWNlcyBtdXN0IGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHJvd3MnKTtcbiAgfVxuICBjb25zdCB7IGNlbnRlciA9IHRydWUgfSA9IG9wdGlvbnM7XG4gIGlmIChjZW50ZXIpIHtcbiAgICB4TWF0cml4ID0geE1hdHJpeC5jZW50ZXIoJ2NvbHVtbicpO1xuICAgIGlmICgheUlzU2FtZSkge1xuICAgICAgeU1hdHJpeCA9IHlNYXRyaXguY2VudGVyKCdjb2x1bW4nKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgY292ID0geE1hdHJpeC50cmFuc3Bvc2UoKS5tbXVsKHlNYXRyaXgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdi5yb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdi5jb2x1bW5zOyBqKyspIHtcbiAgICAgIGNvdi5zZXQoaSwgaiwgY292LmdldChpLCBqKSAqICgxIC8gKHhNYXRyaXgucm93cyAtIDEpKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3Y7XG59XG4iLCJpbXBvcnQgTWF0cml4IGZyb20gJy4uL21hdHJpeCc7XG5pbXBvcnQgV3JhcHBlck1hdHJpeDJEIGZyb20gJy4uL3dyYXAvV3JhcHBlck1hdHJpeDJEJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hvbGVza3lEZWNvbXBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB2YWx1ZSA9IFdyYXBwZXJNYXRyaXgyRC5jaGVja01hdHJpeCh2YWx1ZSk7XG4gICAgaWYgKCF2YWx1ZS5pc1N5bW1ldHJpYygpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hdHJpeCBpcyBub3Qgc3ltbWV0cmljJyk7XG4gICAgfVxuXG4gICAgbGV0IGEgPSB2YWx1ZTtcbiAgICBsZXQgZGltZW5zaW9uID0gYS5yb3dzO1xuICAgIGxldCBsID0gbmV3IE1hdHJpeChkaW1lbnNpb24sIGRpbWVuc2lvbik7XG4gICAgbGV0IHBvc2l0aXZlRGVmaW5pdGUgPSB0cnVlO1xuICAgIGxldCBpLCBqLCBrO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IGRpbWVuc2lvbjsgaisrKSB7XG4gICAgICBsZXQgZCA9IDA7XG4gICAgICBmb3IgKGsgPSAwOyBrIDwgajsgaysrKSB7XG4gICAgICAgIGxldCBzID0gMDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGs7IGkrKykge1xuICAgICAgICAgIHMgKz0gbC5nZXQoaywgaSkgKiBsLmdldChqLCBpKTtcbiAgICAgICAgfVxuICAgICAgICBzID0gKGEuZ2V0KGosIGspIC0gcykgLyBsLmdldChrLCBrKTtcbiAgICAgICAgbC5zZXQoaiwgaywgcyk7XG4gICAgICAgIGQgPSBkICsgcyAqIHM7XG4gICAgICB9XG5cbiAgICAgIGQgPSBhLmdldChqLCBqKSAtIGQ7XG5cbiAgICAgIHBvc2l0aXZlRGVmaW5pdGUgJj0gZCA+IDA7XG4gICAgICBsLnNldChqLCBqLCBNYXRoLnNxcnQoTWF0aC5tYXgoZCwgMCkpKTtcbiAgICAgIGZvciAoayA9IGogKyAxOyBrIDwgZGltZW5zaW9uOyBrKyspIHtcbiAgICAgICAgbC5zZXQoaiwgaywgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5MID0gbDtcbiAgICB0aGlzLnBvc2l0aXZlRGVmaW5pdGUgPSBCb29sZWFuKHBvc2l0aXZlRGVmaW5pdGUpO1xuICB9XG5cbiAgaXNQb3NpdGl2ZURlZmluaXRlKCkge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aXZlRGVmaW5pdGU7XG4gIH1cblxuICBzb2x2ZSh2YWx1ZSkge1xuICAgIHZhbHVlID0gV3JhcHBlck1hdHJpeDJELmNoZWNrTWF0cml4KHZhbHVlKTtcblxuICAgIGxldCBsID0gdGhpcy5MO1xuICAgIGxldCBkaW1lbnNpb24gPSBsLnJvd3M7XG5cbiAgICBpZiAodmFsdWUucm93cyAhPT0gZGltZW5zaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hdHJpeCBkaW1lbnNpb25zIGRvIG5vdCBtYXRjaCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1Bvc2l0aXZlRGVmaW5pdGUoKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF0cml4IGlzIG5vdCBwb3NpdGl2ZSBkZWZpbml0ZScpO1xuICAgIH1cblxuICAgIGxldCBjb3VudCA9IHZhbHVlLmNvbHVtbnM7XG4gICAgbGV0IEIgPSB2YWx1ZS5jbG9uZSgpO1xuICAgIGxldCBpLCBqLCBrO1xuXG4gICAgZm9yIChrID0gMDsgayA8IGRpbWVuc2lvbjsgaysrKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgY291bnQ7IGorKykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgazsgaSsrKSB7XG4gICAgICAgICAgQi5zZXQoaywgaiwgQi5nZXQoaywgaikgLSBCLmdldChpLCBqKSAqIGwuZ2V0KGssIGkpKTtcbiAgICAgICAgfVxuICAgICAgICBCLnNldChrLCBqLCBCLmdldChrLCBqKSAvIGwuZ2V0KGssIGspKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGsgPSBkaW1lbnNpb24gLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgZm9yIChqID0gMDsgaiA8IGNvdW50OyBqKyspIHtcbiAgICAgICAgZm9yIChpID0gayArIDE7IGkgPCBkaW1lbnNpb247IGkrKykge1xuICAgICAgICAgIEIuc2V0KGssIGosIEIuZ2V0KGssIGopIC0gQi5nZXQoaSwgaikgKiBsLmdldChpLCBrKSk7XG4gICAgICAgIH1cbiAgICAgICAgQi5zZXQoaywgaiwgQi5nZXQoaywgaikgLyBsLmdldChrLCBrKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEI7XG4gIH1cblxuICBnZXQgbG93ZXJUcmlhbmd1bGFyTWF0cml4KCkge1xuICAgIHJldHVybiB0aGlzLkw7XG4gIH1cbn1cbiIsImltcG9ydCBNYXRyaXggZnJvbSAnLi4vbWF0cml4JztcbmltcG9ydCBXcmFwcGVyTWF0cml4MkQgZnJvbSAnLi4vd3JhcC9XcmFwcGVyTWF0cml4MkQnO1xuXG5pbXBvcnQgeyBoeXBvdGVudXNlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWlnZW52YWx1ZURlY29tcG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcihtYXRyaXgsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgYXNzdW1lU3ltbWV0cmljID0gZmFsc2UgfSA9IG9wdGlvbnM7XG5cbiAgICBtYXRyaXggPSBXcmFwcGVyTWF0cml4MkQuY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAoIW1hdHJpeC5pc1NxdWFyZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hdHJpeCBpcyBub3QgYSBzcXVhcmUgbWF0cml4Jyk7XG4gICAgfVxuXG4gICAgaWYgKG1hdHJpeC5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF0cml4IG11c3QgYmUgbm9uLWVtcHR5Jyk7XG4gICAgfVxuXG4gICAgbGV0IG4gPSBtYXRyaXguY29sdW1ucztcbiAgICBsZXQgViA9IG5ldyBNYXRyaXgobiwgbik7XG4gICAgbGV0IGQgPSBuZXcgRmxvYXQ2NEFycmF5KG4pO1xuICAgIGxldCBlID0gbmV3IEZsb2F0NjRBcnJheShuKTtcbiAgICBsZXQgdmFsdWUgPSBtYXRyaXg7XG4gICAgbGV0IGksIGo7XG5cbiAgICBsZXQgaXNTeW1tZXRyaWMgPSBmYWxzZTtcbiAgICBpZiAoYXNzdW1lU3ltbWV0cmljKSB7XG4gICAgICBpc1N5bW1ldHJpYyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzU3ltbWV0cmljID0gbWF0cml4LmlzU3ltbWV0cmljKCk7XG4gICAgfVxuXG4gICAgaWYgKGlzU3ltbWV0cmljKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBuOyBqKyspIHtcbiAgICAgICAgICBWLnNldChpLCBqLCB2YWx1ZS5nZXQoaSwgaikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0cmVkMihuLCBlLCBkLCBWKTtcbiAgICAgIHRxbDIobiwgZSwgZCwgVik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBIID0gbmV3IE1hdHJpeChuLCBuKTtcbiAgICAgIGxldCBvcnQgPSBuZXcgRmxvYXQ2NEFycmF5KG4pO1xuICAgICAgZm9yIChqID0gMDsgaiA8IG47IGorKykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgSC5zZXQoaSwgaiwgdmFsdWUuZ2V0KGksIGopKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3J0aGVzKG4sIEgsIG9ydCwgVik7XG4gICAgICBocXIyKG4sIGUsIGQsIFYsIEgpO1xuICAgIH1cblxuICAgIHRoaXMubiA9IG47XG4gICAgdGhpcy5lID0gZTtcbiAgICB0aGlzLmQgPSBkO1xuICAgIHRoaXMuViA9IFY7XG4gIH1cblxuICBnZXQgcmVhbEVpZ2VudmFsdWVzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZCk7XG4gIH1cblxuICBnZXQgaW1hZ2luYXJ5RWlnZW52YWx1ZXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5lKTtcbiAgfVxuXG4gIGdldCBlaWdlbnZlY3Rvck1hdHJpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5WO1xuICB9XG5cbiAgZ2V0IGRpYWdvbmFsTWF0cml4KCkge1xuICAgIGxldCBuID0gdGhpcy5uO1xuICAgIGxldCBlID0gdGhpcy5lO1xuICAgIGxldCBkID0gdGhpcy5kO1xuICAgIGxldCBYID0gbmV3IE1hdHJpeChuLCBuKTtcbiAgICBsZXQgaSwgajtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgbjsgaisrKSB7XG4gICAgICAgIFguc2V0KGksIGosIDApO1xuICAgICAgfVxuICAgICAgWC5zZXQoaSwgaSwgZFtpXSk7XG4gICAgICBpZiAoZVtpXSA+IDApIHtcbiAgICAgICAgWC5zZXQoaSwgaSArIDEsIGVbaV0pO1xuICAgICAgfSBlbHNlIGlmIChlW2ldIDwgMCkge1xuICAgICAgICBYLnNldChpLCBpIC0gMSwgZVtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBYO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyZWQyKG4sIGUsIGQsIFYpIHtcbiAgbGV0IGYsIGcsIGgsIGksIGosIGssIGhoLCBzY2FsZTtcblxuICBmb3IgKGogPSAwOyBqIDwgbjsgaisrKSB7XG4gICAgZFtqXSA9IFYuZ2V0KG4gLSAxLCBqKTtcbiAgfVxuXG4gIGZvciAoaSA9IG4gLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgc2NhbGUgPSAwO1xuICAgIGggPSAwO1xuICAgIGZvciAoayA9IDA7IGsgPCBpOyBrKyspIHtcbiAgICAgIHNjYWxlID0gc2NhbGUgKyBNYXRoLmFicyhkW2tdKTtcbiAgICB9XG5cbiAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgIGVbaV0gPSBkW2kgLSAxXTtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgZFtqXSA9IFYuZ2V0KGkgLSAxLCBqKTtcbiAgICAgICAgVi5zZXQoaSwgaiwgMCk7XG4gICAgICAgIFYuc2V0KGosIGksIDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGsgPSAwOyBrIDwgaTsgaysrKSB7XG4gICAgICAgIGRba10gLz0gc2NhbGU7XG4gICAgICAgIGggKz0gZFtrXSAqIGRba107XG4gICAgICB9XG5cbiAgICAgIGYgPSBkW2kgLSAxXTtcbiAgICAgIGcgPSBNYXRoLnNxcnQoaCk7XG4gICAgICBpZiAoZiA+IDApIHtcbiAgICAgICAgZyA9IC1nO1xuICAgICAgfVxuXG4gICAgICBlW2ldID0gc2NhbGUgKiBnO1xuICAgICAgaCA9IGggLSBmICogZztcbiAgICAgIGRbaSAtIDFdID0gZiAtIGc7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgIGVbal0gPSAwO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgIGYgPSBkW2pdO1xuICAgICAgICBWLnNldChqLCBpLCBmKTtcbiAgICAgICAgZyA9IGVbal0gKyBWLmdldChqLCBqKSAqIGY7XG4gICAgICAgIGZvciAoayA9IGogKyAxOyBrIDw9IGkgLSAxOyBrKyspIHtcbiAgICAgICAgICBnICs9IFYuZ2V0KGssIGopICogZFtrXTtcbiAgICAgICAgICBlW2tdICs9IFYuZ2V0KGssIGopICogZjtcbiAgICAgICAgfVxuICAgICAgICBlW2pdID0gZztcbiAgICAgIH1cblxuICAgICAgZiA9IDA7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgIGVbal0gLz0gaDtcbiAgICAgICAgZiArPSBlW2pdICogZFtqXTtcbiAgICAgIH1cblxuICAgICAgaGggPSBmIC8gKGggKyBoKTtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgZVtqXSAtPSBoaCAqIGRbal07XG4gICAgICB9XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgZiA9IGRbal07XG4gICAgICAgIGcgPSBlW2pdO1xuICAgICAgICBmb3IgKGsgPSBqOyBrIDw9IGkgLSAxOyBrKyspIHtcbiAgICAgICAgICBWLnNldChrLCBqLCBWLmdldChrLCBqKSAtIChmICogZVtrXSArIGcgKiBkW2tdKSk7XG4gICAgICAgIH1cbiAgICAgICAgZFtqXSA9IFYuZ2V0KGkgLSAxLCBqKTtcbiAgICAgICAgVi5zZXQoaSwgaiwgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIGRbaV0gPSBoO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICBWLnNldChuIC0gMSwgaSwgVi5nZXQoaSwgaSkpO1xuICAgIFYuc2V0KGksIGksIDEpO1xuICAgIGggPSBkW2kgKyAxXTtcbiAgICBpZiAoaCAhPT0gMCkge1xuICAgICAgZm9yIChrID0gMDsgayA8PSBpOyBrKyspIHtcbiAgICAgICAgZFtrXSA9IFYuZ2V0KGssIGkgKyAxKSAvIGg7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgIGcgPSAwO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDw9IGk7IGsrKykge1xuICAgICAgICAgIGcgKz0gVi5nZXQoaywgaSArIDEpICogVi5nZXQoaywgaik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrID0gMDsgayA8PSBpOyBrKyspIHtcbiAgICAgICAgICBWLnNldChrLCBqLCBWLmdldChrLCBqKSAtIGcgKiBkW2tdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoayA9IDA7IGsgPD0gaTsgaysrKSB7XG4gICAgICBWLnNldChrLCBpICsgMSwgMCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChqID0gMDsgaiA8IG47IGorKykge1xuICAgIGRbal0gPSBWLmdldChuIC0gMSwgaik7XG4gICAgVi5zZXQobiAtIDEsIGosIDApO1xuICB9XG5cbiAgVi5zZXQobiAtIDEsIG4gLSAxLCAxKTtcbiAgZVswXSA9IDA7XG59XG5cbmZ1bmN0aW9uIHRxbDIobiwgZSwgZCwgVikge1xuICBsZXQgZywgaCwgaSwgaiwgaywgbCwgbSwgcCwgciwgZGwxLCBjLCBjMiwgYzMsIGVsMSwgcywgczIsIGl0ZXI7XG5cbiAgZm9yIChpID0gMTsgaSA8IG47IGkrKykge1xuICAgIGVbaSAtIDFdID0gZVtpXTtcbiAgfVxuXG4gIGVbbiAtIDFdID0gMDtcblxuICBsZXQgZiA9IDA7XG4gIGxldCB0c3QxID0gMDtcbiAgbGV0IGVwcyA9IE51bWJlci5FUFNJTE9OO1xuXG4gIGZvciAobCA9IDA7IGwgPCBuOyBsKyspIHtcbiAgICB0c3QxID0gTWF0aC5tYXgodHN0MSwgTWF0aC5hYnMoZFtsXSkgKyBNYXRoLmFicyhlW2xdKSk7XG4gICAgbSA9IGw7XG4gICAgd2hpbGUgKG0gPCBuKSB7XG4gICAgICBpZiAoTWF0aC5hYnMoZVttXSkgPD0gZXBzICogdHN0MSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG0rKztcbiAgICB9XG5cbiAgICBpZiAobSA+IGwpIHtcbiAgICAgIGl0ZXIgPSAwO1xuICAgICAgZG8ge1xuICAgICAgICBpdGVyID0gaXRlciArIDE7XG5cbiAgICAgICAgZyA9IGRbbF07XG4gICAgICAgIHAgPSAoZFtsICsgMV0gLSBnKSAvICgyICogZVtsXSk7XG4gICAgICAgIHIgPSBoeXBvdGVudXNlKHAsIDEpO1xuICAgICAgICBpZiAocCA8IDApIHtcbiAgICAgICAgICByID0gLXI7XG4gICAgICAgIH1cblxuICAgICAgICBkW2xdID0gZVtsXSAvIChwICsgcik7XG4gICAgICAgIGRbbCArIDFdID0gZVtsXSAqIChwICsgcik7XG4gICAgICAgIGRsMSA9IGRbbCArIDFdO1xuICAgICAgICBoID0gZyAtIGRbbF07XG4gICAgICAgIGZvciAoaSA9IGwgKyAyOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgZFtpXSAtPSBoO1xuICAgICAgICB9XG5cbiAgICAgICAgZiA9IGYgKyBoO1xuXG4gICAgICAgIHAgPSBkW21dO1xuICAgICAgICBjID0gMTtcbiAgICAgICAgYzIgPSBjO1xuICAgICAgICBjMyA9IGM7XG4gICAgICAgIGVsMSA9IGVbbCArIDFdO1xuICAgICAgICBzID0gMDtcbiAgICAgICAgczIgPSAwO1xuICAgICAgICBmb3IgKGkgPSBtIC0gMTsgaSA+PSBsOyBpLS0pIHtcbiAgICAgICAgICBjMyA9IGMyO1xuICAgICAgICAgIGMyID0gYztcbiAgICAgICAgICBzMiA9IHM7XG4gICAgICAgICAgZyA9IGMgKiBlW2ldO1xuICAgICAgICAgIGggPSBjICogcDtcbiAgICAgICAgICByID0gaHlwb3RlbnVzZShwLCBlW2ldKTtcbiAgICAgICAgICBlW2kgKyAxXSA9IHMgKiByO1xuICAgICAgICAgIHMgPSBlW2ldIC8gcjtcbiAgICAgICAgICBjID0gcCAvIHI7XG4gICAgICAgICAgcCA9IGMgKiBkW2ldIC0gcyAqIGc7XG4gICAgICAgICAgZFtpICsgMV0gPSBoICsgcyAqIChjICogZyArIHMgKiBkW2ldKTtcblxuICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBuOyBrKyspIHtcbiAgICAgICAgICAgIGggPSBWLmdldChrLCBpICsgMSk7XG4gICAgICAgICAgICBWLnNldChrLCBpICsgMSwgcyAqIFYuZ2V0KGssIGkpICsgYyAqIGgpO1xuICAgICAgICAgICAgVi5zZXQoaywgaSwgYyAqIFYuZ2V0KGssIGkpIC0gcyAqIGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHAgPSAoLXMgKiBzMiAqIGMzICogZWwxICogZVtsXSkgLyBkbDE7XG4gICAgICAgIGVbbF0gPSBzICogcDtcbiAgICAgICAgZFtsXSA9IGMgKiBwO1xuICAgICAgfSB3aGlsZSAoTWF0aC5hYnMoZVtsXSkgPiBlcHMgKiB0c3QxKTtcbiAgICB9XG4gICAgZFtsXSA9IGRbbF0gKyBmO1xuICAgIGVbbF0gPSAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICBrID0gaTtcbiAgICBwID0gZFtpXTtcbiAgICBmb3IgKGogPSBpICsgMTsgaiA8IG47IGorKykge1xuICAgICAgaWYgKGRbal0gPCBwKSB7XG4gICAgICAgIGsgPSBqO1xuICAgICAgICBwID0gZFtqXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoayAhPT0gaSkge1xuICAgICAgZFtrXSA9IGRbaV07XG4gICAgICBkW2ldID0gcDtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBuOyBqKyspIHtcbiAgICAgICAgcCA9IFYuZ2V0KGosIGkpO1xuICAgICAgICBWLnNldChqLCBpLCBWLmdldChqLCBrKSk7XG4gICAgICAgIFYuc2V0KGosIGssIHApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBvcnRoZXMobiwgSCwgb3J0LCBWKSB7XG4gIGxldCBsb3cgPSAwO1xuICBsZXQgaGlnaCA9IG4gLSAxO1xuICBsZXQgZiwgZywgaCwgaSwgaiwgbTtcbiAgbGV0IHNjYWxlO1xuXG4gIGZvciAobSA9IGxvdyArIDE7IG0gPD0gaGlnaCAtIDE7IG0rKykge1xuICAgIHNjYWxlID0gMDtcbiAgICBmb3IgKGkgPSBtOyBpIDw9IGhpZ2g7IGkrKykge1xuICAgICAgc2NhbGUgPSBzY2FsZSArIE1hdGguYWJzKEguZ2V0KGksIG0gLSAxKSk7XG4gICAgfVxuXG4gICAgaWYgKHNjYWxlICE9PSAwKSB7XG4gICAgICBoID0gMDtcbiAgICAgIGZvciAoaSA9IGhpZ2g7IGkgPj0gbTsgaS0tKSB7XG4gICAgICAgIG9ydFtpXSA9IEguZ2V0KGksIG0gLSAxKSAvIHNjYWxlO1xuICAgICAgICBoICs9IG9ydFtpXSAqIG9ydFtpXTtcbiAgICAgIH1cblxuICAgICAgZyA9IE1hdGguc3FydChoKTtcbiAgICAgIGlmIChvcnRbbV0gPiAwKSB7XG4gICAgICAgIGcgPSAtZztcbiAgICAgIH1cblxuICAgICAgaCA9IGggLSBvcnRbbV0gKiBnO1xuICAgICAgb3J0W21dID0gb3J0W21dIC0gZztcblxuICAgICAgZm9yIChqID0gbTsgaiA8IG47IGorKykge1xuICAgICAgICBmID0gMDtcbiAgICAgICAgZm9yIChpID0gaGlnaDsgaSA+PSBtOyBpLS0pIHtcbiAgICAgICAgICBmICs9IG9ydFtpXSAqIEguZ2V0KGksIGopO1xuICAgICAgICB9XG5cbiAgICAgICAgZiA9IGYgLyBoO1xuICAgICAgICBmb3IgKGkgPSBtOyBpIDw9IGhpZ2g7IGkrKykge1xuICAgICAgICAgIEguc2V0KGksIGosIEguZ2V0KGksIGopIC0gZiAqIG9ydFtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8PSBoaWdoOyBpKyspIHtcbiAgICAgICAgZiA9IDA7XG4gICAgICAgIGZvciAoaiA9IGhpZ2g7IGogPj0gbTsgai0tKSB7XG4gICAgICAgICAgZiArPSBvcnRbal0gKiBILmdldChpLCBqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGYgPSBmIC8gaDtcbiAgICAgICAgZm9yIChqID0gbTsgaiA8PSBoaWdoOyBqKyspIHtcbiAgICAgICAgICBILnNldChpLCBqLCBILmdldChpLCBqKSAtIGYgKiBvcnRbal0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9ydFttXSA9IHNjYWxlICogb3J0W21dO1xuICAgICAgSC5zZXQobSwgbSAtIDEsIHNjYWxlICogZyk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgIGZvciAoaiA9IDA7IGogPCBuOyBqKyspIHtcbiAgICAgIFYuc2V0KGksIGosIGkgPT09IGogPyAxIDogMCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChtID0gaGlnaCAtIDE7IG0gPj0gbG93ICsgMTsgbS0tKSB7XG4gICAgaWYgKEguZ2V0KG0sIG0gLSAxKSAhPT0gMCkge1xuICAgICAgZm9yIChpID0gbSArIDE7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgIG9ydFtpXSA9IEguZ2V0KGksIG0gLSAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChqID0gbTsgaiA8PSBoaWdoOyBqKyspIHtcbiAgICAgICAgZyA9IDA7XG4gICAgICAgIGZvciAoaSA9IG07IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgICAgZyArPSBvcnRbaV0gKiBWLmdldChpLCBqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGcgPSBnIC8gb3J0W21dIC8gSC5nZXQobSwgbSAtIDEpO1xuICAgICAgICBmb3IgKGkgPSBtOyBpIDw9IGhpZ2g7IGkrKykge1xuICAgICAgICAgIFYuc2V0KGksIGosIFYuZ2V0KGksIGopICsgZyAqIG9ydFtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaHFyMihubiwgZSwgZCwgViwgSCkge1xuICBsZXQgbiA9IG5uIC0gMTtcbiAgbGV0IGxvdyA9IDA7XG4gIGxldCBoaWdoID0gbm4gLSAxO1xuICBsZXQgZXBzID0gTnVtYmVyLkVQU0lMT047XG4gIGxldCBleHNoaWZ0ID0gMDtcbiAgbGV0IG5vcm0gPSAwO1xuICBsZXQgcCA9IDA7XG4gIGxldCBxID0gMDtcbiAgbGV0IHIgPSAwO1xuICBsZXQgcyA9IDA7XG4gIGxldCB6ID0gMDtcbiAgbGV0IGl0ZXIgPSAwO1xuICBsZXQgaSwgaiwgaywgbCwgbSwgdCwgdywgeCwgeTtcbiAgbGV0IHJhLCBzYSwgdnIsIHZpO1xuICBsZXQgbm90bGFzdCwgY2RpdnJlcztcblxuICBmb3IgKGkgPSAwOyBpIDwgbm47IGkrKykge1xuICAgIGlmIChpIDwgbG93IHx8IGkgPiBoaWdoKSB7XG4gICAgICBkW2ldID0gSC5nZXQoaSwgaSk7XG4gICAgICBlW2ldID0gMDtcbiAgICB9XG5cbiAgICBmb3IgKGogPSBNYXRoLm1heChpIC0gMSwgMCk7IGogPCBubjsgaisrKSB7XG4gICAgICBub3JtID0gbm9ybSArIE1hdGguYWJzKEguZ2V0KGksIGopKTtcbiAgICB9XG4gIH1cblxuICB3aGlsZSAobiA+PSBsb3cpIHtcbiAgICBsID0gbjtcbiAgICB3aGlsZSAobCA+IGxvdykge1xuICAgICAgcyA9IE1hdGguYWJzKEguZ2V0KGwgLSAxLCBsIC0gMSkpICsgTWF0aC5hYnMoSC5nZXQobCwgbCkpO1xuICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgcyA9IG5vcm07XG4gICAgICB9XG4gICAgICBpZiAoTWF0aC5hYnMoSC5nZXQobCwgbCAtIDEpKSA8IGVwcyAqIHMpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBsLS07XG4gICAgfVxuXG4gICAgaWYgKGwgPT09IG4pIHtcbiAgICAgIEguc2V0KG4sIG4sIEguZ2V0KG4sIG4pICsgZXhzaGlmdCk7XG4gICAgICBkW25dID0gSC5nZXQobiwgbik7XG4gICAgICBlW25dID0gMDtcbiAgICAgIG4tLTtcbiAgICAgIGl0ZXIgPSAwO1xuICAgIH0gZWxzZSBpZiAobCA9PT0gbiAtIDEpIHtcbiAgICAgIHcgPSBILmdldChuLCBuIC0gMSkgKiBILmdldChuIC0gMSwgbik7XG4gICAgICBwID0gKEguZ2V0KG4gLSAxLCBuIC0gMSkgLSBILmdldChuLCBuKSkgLyAyO1xuICAgICAgcSA9IHAgKiBwICsgdztcbiAgICAgIHogPSBNYXRoLnNxcnQoTWF0aC5hYnMocSkpO1xuICAgICAgSC5zZXQobiwgbiwgSC5nZXQobiwgbikgKyBleHNoaWZ0KTtcbiAgICAgIEguc2V0KG4gLSAxLCBuIC0gMSwgSC5nZXQobiAtIDEsIG4gLSAxKSArIGV4c2hpZnQpO1xuICAgICAgeCA9IEguZ2V0KG4sIG4pO1xuXG4gICAgICBpZiAocSA+PSAwKSB7XG4gICAgICAgIHogPSBwID49IDAgPyBwICsgeiA6IHAgLSB6O1xuICAgICAgICBkW24gLSAxXSA9IHggKyB6O1xuICAgICAgICBkW25dID0gZFtuIC0gMV07XG4gICAgICAgIGlmICh6ICE9PSAwKSB7XG4gICAgICAgICAgZFtuXSA9IHggLSB3IC8gejtcbiAgICAgICAgfVxuICAgICAgICBlW24gLSAxXSA9IDA7XG4gICAgICAgIGVbbl0gPSAwO1xuICAgICAgICB4ID0gSC5nZXQobiwgbiAtIDEpO1xuICAgICAgICBzID0gTWF0aC5hYnMoeCkgKyBNYXRoLmFicyh6KTtcbiAgICAgICAgcCA9IHggLyBzO1xuICAgICAgICBxID0geiAvIHM7XG4gICAgICAgIHIgPSBNYXRoLnNxcnQocCAqIHAgKyBxICogcSk7XG4gICAgICAgIHAgPSBwIC8gcjtcbiAgICAgICAgcSA9IHEgLyByO1xuXG4gICAgICAgIGZvciAoaiA9IG4gLSAxOyBqIDwgbm47IGorKykge1xuICAgICAgICAgIHogPSBILmdldChuIC0gMSwgaik7XG4gICAgICAgICAgSC5zZXQobiAtIDEsIGosIHEgKiB6ICsgcCAqIEguZ2V0KG4sIGopKTtcbiAgICAgICAgICBILnNldChuLCBqLCBxICogSC5nZXQobiwgaikgLSBwICogeik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IG47IGkrKykge1xuICAgICAgICAgIHogPSBILmdldChpLCBuIC0gMSk7XG4gICAgICAgICAgSC5zZXQoaSwgbiAtIDEsIHEgKiB6ICsgcCAqIEguZ2V0KGksIG4pKTtcbiAgICAgICAgICBILnNldChpLCBuLCBxICogSC5nZXQoaSwgbikgLSBwICogeik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgICAgeiA9IFYuZ2V0KGksIG4gLSAxKTtcbiAgICAgICAgICBWLnNldChpLCBuIC0gMSwgcSAqIHogKyBwICogVi5nZXQoaSwgbikpO1xuICAgICAgICAgIFYuc2V0KGksIG4sIHEgKiBWLmdldChpLCBuKSAtIHAgKiB6KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZFtuIC0gMV0gPSB4ICsgcDtcbiAgICAgICAgZFtuXSA9IHggKyBwO1xuICAgICAgICBlW24gLSAxXSA9IHo7XG4gICAgICAgIGVbbl0gPSAtejtcbiAgICAgIH1cblxuICAgICAgbiA9IG4gLSAyO1xuICAgICAgaXRlciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSBILmdldChuLCBuKTtcbiAgICAgIHkgPSAwO1xuICAgICAgdyA9IDA7XG4gICAgICBpZiAobCA8IG4pIHtcbiAgICAgICAgeSA9IEguZ2V0KG4gLSAxLCBuIC0gMSk7XG4gICAgICAgIHcgPSBILmdldChuLCBuIC0gMSkgKiBILmdldChuIC0gMSwgbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVyID09PSAxMCkge1xuICAgICAgICBleHNoaWZ0ICs9IHg7XG4gICAgICAgIGZvciAoaSA9IGxvdzsgaSA8PSBuOyBpKyspIHtcbiAgICAgICAgICBILnNldChpLCBpLCBILmdldChpLCBpKSAtIHgpO1xuICAgICAgICB9XG4gICAgICAgIHMgPSBNYXRoLmFicyhILmdldChuLCBuIC0gMSkpICsgTWF0aC5hYnMoSC5nZXQobiAtIDEsIG4gLSAyKSk7XG4gICAgICAgIHggPSB5ID0gMC43NSAqIHM7XG4gICAgICAgIHcgPSAtMC40Mzc1ICogcyAqIHM7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVyID09PSAzMCkge1xuICAgICAgICBzID0gKHkgLSB4KSAvIDI7XG4gICAgICAgIHMgPSBzICogcyArIHc7XG4gICAgICAgIGlmIChzID4gMCkge1xuICAgICAgICAgIHMgPSBNYXRoLnNxcnQocyk7XG4gICAgICAgICAgaWYgKHkgPCB4KSB7XG4gICAgICAgICAgICBzID0gLXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHMgPSB4IC0gdyAvICgoeSAtIHgpIC8gMiArIHMpO1xuICAgICAgICAgIGZvciAoaSA9IGxvdzsgaSA8PSBuOyBpKyspIHtcbiAgICAgICAgICAgIEguc2V0KGksIGksIEguZ2V0KGksIGkpIC0gcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4c2hpZnQgKz0gcztcbiAgICAgICAgICB4ID0geSA9IHcgPSAwLjk2NDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpdGVyID0gaXRlciArIDE7XG5cbiAgICAgIG0gPSBuIC0gMjtcbiAgICAgIHdoaWxlIChtID49IGwpIHtcbiAgICAgICAgeiA9IEguZ2V0KG0sIG0pO1xuICAgICAgICByID0geCAtIHo7XG4gICAgICAgIHMgPSB5IC0gejtcbiAgICAgICAgcCA9IChyICogcyAtIHcpIC8gSC5nZXQobSArIDEsIG0pICsgSC5nZXQobSwgbSArIDEpO1xuICAgICAgICBxID0gSC5nZXQobSArIDEsIG0gKyAxKSAtIHogLSByIC0gcztcbiAgICAgICAgciA9IEguZ2V0KG0gKyAyLCBtICsgMSk7XG4gICAgICAgIHMgPSBNYXRoLmFicyhwKSArIE1hdGguYWJzKHEpICsgTWF0aC5hYnMocik7XG4gICAgICAgIHAgPSBwIC8gcztcbiAgICAgICAgcSA9IHEgLyBzO1xuICAgICAgICByID0gciAvIHM7XG4gICAgICAgIGlmIChtID09PSBsKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIE1hdGguYWJzKEguZ2V0KG0sIG0gLSAxKSkgKiAoTWF0aC5hYnMocSkgKyBNYXRoLmFicyhyKSkgPFxuICAgICAgICAgIGVwcyAqXG4gICAgICAgICAgICAoTWF0aC5hYnMocCkgKlxuICAgICAgICAgICAgICAoTWF0aC5hYnMoSC5nZXQobSAtIDEsIG0gLSAxKSkgK1xuICAgICAgICAgICAgICAgIE1hdGguYWJzKHopICtcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhILmdldChtICsgMSwgbSArIDEpKSkpXG4gICAgICAgICkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG0tLTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gbSArIDI7IGkgPD0gbjsgaSsrKSB7XG4gICAgICAgIEguc2V0KGksIGkgLSAyLCAwKTtcbiAgICAgICAgaWYgKGkgPiBtICsgMikge1xuICAgICAgICAgIEguc2V0KGksIGkgLSAzLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGsgPSBtOyBrIDw9IG4gLSAxOyBrKyspIHtcbiAgICAgICAgbm90bGFzdCA9IGsgIT09IG4gLSAxO1xuICAgICAgICBpZiAoayAhPT0gbSkge1xuICAgICAgICAgIHAgPSBILmdldChrLCBrIC0gMSk7XG4gICAgICAgICAgcSA9IEguZ2V0KGsgKyAxLCBrIC0gMSk7XG4gICAgICAgICAgciA9IG5vdGxhc3QgPyBILmdldChrICsgMiwgayAtIDEpIDogMDtcbiAgICAgICAgICB4ID0gTWF0aC5hYnMocCkgKyBNYXRoLmFicyhxKSArIE1hdGguYWJzKHIpO1xuICAgICAgICAgIGlmICh4ICE9PSAwKSB7XG4gICAgICAgICAgICBwID0gcCAvIHg7XG4gICAgICAgICAgICBxID0gcSAvIHg7XG4gICAgICAgICAgICByID0gciAvIHg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHggPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHMgPSBNYXRoLnNxcnQocCAqIHAgKyBxICogcSArIHIgKiByKTtcbiAgICAgICAgaWYgKHAgPCAwKSB7XG4gICAgICAgICAgcyA9IC1zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHMgIT09IDApIHtcbiAgICAgICAgICBpZiAoayAhPT0gbSkge1xuICAgICAgICAgICAgSC5zZXQoaywgayAtIDEsIC1zICogeCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChsICE9PSBtKSB7XG4gICAgICAgICAgICBILnNldChrLCBrIC0gMSwgLUguZ2V0KGssIGsgLSAxKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcCA9IHAgKyBzO1xuICAgICAgICAgIHggPSBwIC8gcztcbiAgICAgICAgICB5ID0gcSAvIHM7XG4gICAgICAgICAgeiA9IHIgLyBzO1xuICAgICAgICAgIHEgPSBxIC8gcDtcbiAgICAgICAgICByID0gciAvIHA7XG5cbiAgICAgICAgICBmb3IgKGogPSBrOyBqIDwgbm47IGorKykge1xuICAgICAgICAgICAgcCA9IEguZ2V0KGssIGopICsgcSAqIEguZ2V0KGsgKyAxLCBqKTtcbiAgICAgICAgICAgIGlmIChub3RsYXN0KSB7XG4gICAgICAgICAgICAgIHAgPSBwICsgciAqIEguZ2V0KGsgKyAyLCBqKTtcbiAgICAgICAgICAgICAgSC5zZXQoayArIDIsIGosIEguZ2V0KGsgKyAyLCBqKSAtIHAgKiB6KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgSC5zZXQoaywgaiwgSC5nZXQoaywgaikgLSBwICogeCk7XG4gICAgICAgICAgICBILnNldChrICsgMSwgaiwgSC5nZXQoayArIDEsIGopIC0gcCAqIHkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPD0gTWF0aC5taW4obiwgayArIDMpOyBpKyspIHtcbiAgICAgICAgICAgIHAgPSB4ICogSC5nZXQoaSwgaykgKyB5ICogSC5nZXQoaSwgayArIDEpO1xuICAgICAgICAgICAgaWYgKG5vdGxhc3QpIHtcbiAgICAgICAgICAgICAgcCA9IHAgKyB6ICogSC5nZXQoaSwgayArIDIpO1xuICAgICAgICAgICAgICBILnNldChpLCBrICsgMiwgSC5nZXQoaSwgayArIDIpIC0gcCAqIHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBILnNldChpLCBrLCBILmdldChpLCBrKSAtIHApO1xuICAgICAgICAgICAgSC5zZXQoaSwgayArIDEsIEguZ2V0KGksIGsgKyAxKSAtIHAgKiBxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICAgICAgICBwID0geCAqIFYuZ2V0KGksIGspICsgeSAqIFYuZ2V0KGksIGsgKyAxKTtcbiAgICAgICAgICAgIGlmIChub3RsYXN0KSB7XG4gICAgICAgICAgICAgIHAgPSBwICsgeiAqIFYuZ2V0KGksIGsgKyAyKTtcbiAgICAgICAgICAgICAgVi5zZXQoaSwgayArIDIsIFYuZ2V0KGksIGsgKyAyKSAtIHAgKiByKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVi5zZXQoaSwgaywgVi5nZXQoaSwgaykgLSBwKTtcbiAgICAgICAgICAgIFYuc2V0KGksIGsgKyAxLCBWLmdldChpLCBrICsgMSkgLSBwICogcSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG5vcm0gPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKG4gPSBubiAtIDE7IG4gPj0gMDsgbi0tKSB7XG4gICAgcCA9IGRbbl07XG4gICAgcSA9IGVbbl07XG5cbiAgICBpZiAocSA9PT0gMCkge1xuICAgICAgbCA9IG47XG4gICAgICBILnNldChuLCBuLCAxKTtcbiAgICAgIGZvciAoaSA9IG4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB3ID0gSC5nZXQoaSwgaSkgLSBwO1xuICAgICAgICByID0gMDtcbiAgICAgICAgZm9yIChqID0gbDsgaiA8PSBuOyBqKyspIHtcbiAgICAgICAgICByID0gciArIEguZ2V0KGksIGopICogSC5nZXQoaiwgbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZVtpXSA8IDApIHtcbiAgICAgICAgICB6ID0gdztcbiAgICAgICAgICBzID0gcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsID0gaTtcbiAgICAgICAgICBpZiAoZVtpXSA9PT0gMCkge1xuICAgICAgICAgICAgSC5zZXQoaSwgbiwgdyAhPT0gMCA/IC1yIC8gdyA6IC1yIC8gKGVwcyAqIG5vcm0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IEguZ2V0KGksIGkgKyAxKTtcbiAgICAgICAgICAgIHkgPSBILmdldChpICsgMSwgaSk7XG4gICAgICAgICAgICBxID0gKGRbaV0gLSBwKSAqIChkW2ldIC0gcCkgKyBlW2ldICogZVtpXTtcbiAgICAgICAgICAgIHQgPSAoeCAqIHMgLSB6ICogcikgLyBxO1xuICAgICAgICAgICAgSC5zZXQoaSwgbiwgdCk7XG4gICAgICAgICAgICBILnNldChcbiAgICAgICAgICAgICAgaSArIDEsXG4gICAgICAgICAgICAgIG4sXG4gICAgICAgICAgICAgIE1hdGguYWJzKHgpID4gTWF0aC5hYnMoeikgPyAoLXIgLSB3ICogdCkgLyB4IDogKC1zIC0geSAqIHQpIC8geixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdCA9IE1hdGguYWJzKEguZ2V0KGksIG4pKTtcbiAgICAgICAgICBpZiAoZXBzICogdCAqIHQgPiAxKSB7XG4gICAgICAgICAgICBmb3IgKGogPSBpOyBqIDw9IG47IGorKykge1xuICAgICAgICAgICAgICBILnNldChqLCBuLCBILmdldChqLCBuKSAvIHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocSA8IDApIHtcbiAgICAgIGwgPSBuIC0gMTtcblxuICAgICAgaWYgKE1hdGguYWJzKEguZ2V0KG4sIG4gLSAxKSkgPiBNYXRoLmFicyhILmdldChuIC0gMSwgbikpKSB7XG4gICAgICAgIEguc2V0KG4gLSAxLCBuIC0gMSwgcSAvIEguZ2V0KG4sIG4gLSAxKSk7XG4gICAgICAgIEguc2V0KG4gLSAxLCBuLCAtKEguZ2V0KG4sIG4pIC0gcCkgLyBILmdldChuLCBuIC0gMSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2RpdnJlcyA9IGNkaXYoMCwgLUguZ2V0KG4gLSAxLCBuKSwgSC5nZXQobiAtIDEsIG4gLSAxKSAtIHAsIHEpO1xuICAgICAgICBILnNldChuIC0gMSwgbiAtIDEsIGNkaXZyZXNbMF0pO1xuICAgICAgICBILnNldChuIC0gMSwgbiwgY2RpdnJlc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIEguc2V0KG4sIG4gLSAxLCAwKTtcbiAgICAgIEguc2V0KG4sIG4sIDEpO1xuICAgICAgZm9yIChpID0gbiAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHJhID0gMDtcbiAgICAgICAgc2EgPSAwO1xuICAgICAgICBmb3IgKGogPSBsOyBqIDw9IG47IGorKykge1xuICAgICAgICAgIHJhID0gcmEgKyBILmdldChpLCBqKSAqIEguZ2V0KGosIG4gLSAxKTtcbiAgICAgICAgICBzYSA9IHNhICsgSC5nZXQoaSwgaikgKiBILmdldChqLCBuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHcgPSBILmdldChpLCBpKSAtIHA7XG5cbiAgICAgICAgaWYgKGVbaV0gPCAwKSB7XG4gICAgICAgICAgeiA9IHc7XG4gICAgICAgICAgciA9IHJhO1xuICAgICAgICAgIHMgPSBzYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsID0gaTtcbiAgICAgICAgICBpZiAoZVtpXSA9PT0gMCkge1xuICAgICAgICAgICAgY2RpdnJlcyA9IGNkaXYoLXJhLCAtc2EsIHcsIHEpO1xuICAgICAgICAgICAgSC5zZXQoaSwgbiAtIDEsIGNkaXZyZXNbMF0pO1xuICAgICAgICAgICAgSC5zZXQoaSwgbiwgY2RpdnJlc1sxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSBILmdldChpLCBpICsgMSk7XG4gICAgICAgICAgICB5ID0gSC5nZXQoaSArIDEsIGkpO1xuICAgICAgICAgICAgdnIgPSAoZFtpXSAtIHApICogKGRbaV0gLSBwKSArIGVbaV0gKiBlW2ldIC0gcSAqIHE7XG4gICAgICAgICAgICB2aSA9IChkW2ldIC0gcCkgKiAyICogcTtcbiAgICAgICAgICAgIGlmICh2ciA9PT0gMCAmJiB2aSA9PT0gMCkge1xuICAgICAgICAgICAgICB2ciA9XG4gICAgICAgICAgICAgICAgZXBzICpcbiAgICAgICAgICAgICAgICBub3JtICpcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnModykgK1xuICAgICAgICAgICAgICAgICAgTWF0aC5hYnMocSkgK1xuICAgICAgICAgICAgICAgICAgTWF0aC5hYnMoeCkgK1xuICAgICAgICAgICAgICAgICAgTWF0aC5hYnMoeSkgK1xuICAgICAgICAgICAgICAgICAgTWF0aC5hYnMoeikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2RpdnJlcyA9IGNkaXYoXG4gICAgICAgICAgICAgIHggKiByIC0geiAqIHJhICsgcSAqIHNhLFxuICAgICAgICAgICAgICB4ICogcyAtIHogKiBzYSAtIHEgKiByYSxcbiAgICAgICAgICAgICAgdnIsXG4gICAgICAgICAgICAgIHZpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIEguc2V0KGksIG4gLSAxLCBjZGl2cmVzWzBdKTtcbiAgICAgICAgICAgIEguc2V0KGksIG4sIGNkaXZyZXNbMV0pO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHgpID4gTWF0aC5hYnMoeikgKyBNYXRoLmFicyhxKSkge1xuICAgICAgICAgICAgICBILnNldChcbiAgICAgICAgICAgICAgICBpICsgMSxcbiAgICAgICAgICAgICAgICBuIC0gMSxcbiAgICAgICAgICAgICAgICAoLXJhIC0gdyAqIEguZ2V0KGksIG4gLSAxKSArIHEgKiBILmdldChpLCBuKSkgLyB4LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBILnNldChcbiAgICAgICAgICAgICAgICBpICsgMSxcbiAgICAgICAgICAgICAgICBuLFxuICAgICAgICAgICAgICAgICgtc2EgLSB3ICogSC5nZXQoaSwgbikgLSBxICogSC5nZXQoaSwgbiAtIDEpKSAvIHgsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjZGl2cmVzID0gY2RpdihcbiAgICAgICAgICAgICAgICAtciAtIHkgKiBILmdldChpLCBuIC0gMSksXG4gICAgICAgICAgICAgICAgLXMgLSB5ICogSC5nZXQoaSwgbiksXG4gICAgICAgICAgICAgICAgeixcbiAgICAgICAgICAgICAgICBxLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBILnNldChpICsgMSwgbiAtIDEsIGNkaXZyZXNbMF0pO1xuICAgICAgICAgICAgICBILnNldChpICsgMSwgbiwgY2RpdnJlc1sxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdCA9IE1hdGgubWF4KE1hdGguYWJzKEguZ2V0KGksIG4gLSAxKSksIE1hdGguYWJzKEguZ2V0KGksIG4pKSk7XG4gICAgICAgICAgaWYgKGVwcyAqIHQgKiB0ID4gMSkge1xuICAgICAgICAgICAgZm9yIChqID0gaTsgaiA8PSBuOyBqKyspIHtcbiAgICAgICAgICAgICAgSC5zZXQoaiwgbiAtIDEsIEguZ2V0KGosIG4gLSAxKSAvIHQpO1xuICAgICAgICAgICAgICBILnNldChqLCBuLCBILmdldChqLCBuKSAvIHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBubjsgaSsrKSB7XG4gICAgaWYgKGkgPCBsb3cgfHwgaSA+IGhpZ2gpIHtcbiAgICAgIGZvciAoaiA9IGk7IGogPCBubjsgaisrKSB7XG4gICAgICAgIFYuc2V0KGksIGosIEguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGogPSBubiAtIDE7IGogPj0gbG93OyBqLS0pIHtcbiAgICBmb3IgKGkgPSBsb3c7IGkgPD0gaGlnaDsgaSsrKSB7XG4gICAgICB6ID0gMDtcbiAgICAgIGZvciAoayA9IGxvdzsgayA8PSBNYXRoLm1pbihqLCBoaWdoKTsgaysrKSB7XG4gICAgICAgIHogPSB6ICsgVi5nZXQoaSwgaykgKiBILmdldChrLCBqKTtcbiAgICAgIH1cbiAgICAgIFYuc2V0KGksIGosIHopO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjZGl2KHhyLCB4aSwgeXIsIHlpKSB7XG4gIGxldCByLCBkO1xuICBpZiAoTWF0aC5hYnMoeXIpID4gTWF0aC5hYnMoeWkpKSB7XG4gICAgciA9IHlpIC8geXI7XG4gICAgZCA9IHlyICsgciAqIHlpO1xuICAgIHJldHVybiBbKHhyICsgciAqIHhpKSAvIGQsICh4aSAtIHIgKiB4cikgLyBkXTtcbiAgfSBlbHNlIHtcbiAgICByID0geXIgLyB5aTtcbiAgICBkID0geWkgKyByICogeXI7XG4gICAgcmV0dXJuIFsociAqIHhyICsgeGkpIC8gZCwgKHIgKiB4aSAtIHhyKSAvIGRdO1xuICB9XG59XG4iLCJpbXBvcnQgTWF0cml4IGZyb20gJy4uL21hdHJpeCc7XG5pbXBvcnQgV3JhcHBlck1hdHJpeDJEIGZyb20gJy4uL3dyYXAvV3JhcHBlck1hdHJpeDJEJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTHVEZWNvbXBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IobWF0cml4KSB7XG4gICAgbWF0cml4ID0gV3JhcHBlck1hdHJpeDJELmNoZWNrTWF0cml4KG1hdHJpeCk7XG5cbiAgICBsZXQgbHUgPSBtYXRyaXguY2xvbmUoKTtcbiAgICBsZXQgcm93cyA9IGx1LnJvd3M7XG4gICAgbGV0IGNvbHVtbnMgPSBsdS5jb2x1bW5zO1xuICAgIGxldCBwaXZvdFZlY3RvciA9IG5ldyBGbG9hdDY0QXJyYXkocm93cyk7XG4gICAgbGV0IHBpdm90U2lnbiA9IDE7XG4gICAgbGV0IGksIGosIGssIHAsIHMsIHQsIHY7XG4gICAgbGV0IExVY29saiwga21heDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIHBpdm90VmVjdG9yW2ldID0gaTtcbiAgICB9XG5cbiAgICBMVWNvbGogPSBuZXcgRmxvYXQ2NEFycmF5KHJvd3MpO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IGNvbHVtbnM7IGorKykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICBMVWNvbGpbaV0gPSBsdS5nZXQoaSwgaik7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAga21heCA9IE1hdGgubWluKGksIGopO1xuICAgICAgICBzID0gMDtcbiAgICAgICAgZm9yIChrID0gMDsgayA8IGttYXg7IGsrKykge1xuICAgICAgICAgIHMgKz0gbHUuZ2V0KGksIGspICogTFVjb2xqW2tdO1xuICAgICAgICB9XG4gICAgICAgIExVY29saltpXSAtPSBzO1xuICAgICAgICBsdS5zZXQoaSwgaiwgTFVjb2xqW2ldKTtcbiAgICAgIH1cblxuICAgICAgcCA9IGo7XG4gICAgICBmb3IgKGkgPSBqICsgMTsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICBpZiAoTWF0aC5hYnMoTFVjb2xqW2ldKSA+IE1hdGguYWJzKExVY29saltwXSkpIHtcbiAgICAgICAgICBwID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocCAhPT0gaikge1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgY29sdW1uczsgaysrKSB7XG4gICAgICAgICAgdCA9IGx1LmdldChwLCBrKTtcbiAgICAgICAgICBsdS5zZXQocCwgaywgbHUuZ2V0KGosIGspKTtcbiAgICAgICAgICBsdS5zZXQoaiwgaywgdCk7XG4gICAgICAgIH1cblxuICAgICAgICB2ID0gcGl2b3RWZWN0b3JbcF07XG4gICAgICAgIHBpdm90VmVjdG9yW3BdID0gcGl2b3RWZWN0b3Jbal07XG4gICAgICAgIHBpdm90VmVjdG9yW2pdID0gdjtcblxuICAgICAgICBwaXZvdFNpZ24gPSAtcGl2b3RTaWduO1xuICAgICAgfVxuXG4gICAgICBpZiAoaiA8IHJvd3MgJiYgbHUuZ2V0KGosIGopICE9PSAwKSB7XG4gICAgICAgIGZvciAoaSA9IGogKyAxOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICAgICAgbHUuc2V0KGksIGosIGx1LmdldChpLCBqKSAvIGx1LmdldChqLCBqKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLkxVID0gbHU7XG4gICAgdGhpcy5waXZvdFZlY3RvciA9IHBpdm90VmVjdG9yO1xuICAgIHRoaXMucGl2b3RTaWduID0gcGl2b3RTaWduO1xuICB9XG5cbiAgaXNTaW5ndWxhcigpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuTFU7XG4gICAgbGV0IGNvbCA9IGRhdGEuY29sdW1ucztcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbDsgaisrKSB7XG4gICAgICBpZiAoZGF0YS5nZXQoaiwgaikgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNvbHZlKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBNYXRyaXguY2hlY2tNYXRyaXgodmFsdWUpO1xuXG4gICAgbGV0IGx1ID0gdGhpcy5MVTtcbiAgICBsZXQgcm93cyA9IGx1LnJvd3M7XG5cbiAgICBpZiAocm93cyAhPT0gdmFsdWUucm93cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1hdHJpeCBkaW1lbnNpb25zJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzU2luZ3VsYXIoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMVSBtYXRyaXggaXMgc2luZ3VsYXInKTtcbiAgICB9XG5cbiAgICBsZXQgY291bnQgPSB2YWx1ZS5jb2x1bW5zO1xuICAgIGxldCBYID0gdmFsdWUuc3ViTWF0cml4Um93KHRoaXMucGl2b3RWZWN0b3IsIDAsIGNvdW50IC0gMSk7XG4gICAgbGV0IGNvbHVtbnMgPSBsdS5jb2x1bW5zO1xuICAgIGxldCBpLCBqLCBrO1xuXG4gICAgZm9yIChrID0gMDsgayA8IGNvbHVtbnM7IGsrKykge1xuICAgICAgZm9yIChpID0gayArIDE7IGkgPCBjb2x1bW5zOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvdW50OyBqKyspIHtcbiAgICAgICAgICBYLnNldChpLCBqLCBYLmdldChpLCBqKSAtIFguZ2V0KGssIGopICogbHUuZ2V0KGksIGspKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGsgPSBjb2x1bW5zIC0gMTsgayA+PSAwOyBrLS0pIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBjb3VudDsgaisrKSB7XG4gICAgICAgIFguc2V0KGssIGosIFguZ2V0KGssIGopIC8gbHUuZ2V0KGssIGspKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvdW50OyBqKyspIHtcbiAgICAgICAgICBYLnNldChpLCBqLCBYLmdldChpLCBqKSAtIFguZ2V0KGssIGopICogbHUuZ2V0KGksIGspKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWDtcbiAgfVxuXG4gIGdldCBkZXRlcm1pbmFudCgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuTFU7XG4gICAgaWYgKCFkYXRhLmlzU3F1YXJlKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWF0cml4IG11c3QgYmUgc3F1YXJlJyk7XG4gICAgfVxuICAgIGxldCBkZXRlcm1pbmFudCA9IHRoaXMucGl2b3RTaWduO1xuICAgIGxldCBjb2wgPSBkYXRhLmNvbHVtbnM7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2w7IGorKykge1xuICAgICAgZGV0ZXJtaW5hbnQgKj0gZGF0YS5nZXQoaiwgaik7XG4gICAgfVxuICAgIHJldHVybiBkZXRlcm1pbmFudDtcbiAgfVxuXG4gIGdldCBsb3dlclRyaWFuZ3VsYXJNYXRyaXgoKSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLkxVO1xuICAgIGxldCByb3dzID0gZGF0YS5yb3dzO1xuICAgIGxldCBjb2x1bW5zID0gZGF0YS5jb2x1bW5zO1xuICAgIGxldCBYID0gbmV3IE1hdHJpeChyb3dzLCBjb2x1bW5zKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgaWYgKGkgPiBqKSB7XG4gICAgICAgICAgWC5zZXQoaSwgaiwgZGF0YS5nZXQoaSwgaikpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPT09IGopIHtcbiAgICAgICAgICBYLnNldChpLCBqLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBYLnNldChpLCBqLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWDtcbiAgfVxuXG4gIGdldCB1cHBlclRyaWFuZ3VsYXJNYXRyaXgoKSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLkxVO1xuICAgIGxldCByb3dzID0gZGF0YS5yb3dzO1xuICAgIGxldCBjb2x1bW5zID0gZGF0YS5jb2x1bW5zO1xuICAgIGxldCBYID0gbmV3IE1hdHJpeChyb3dzLCBjb2x1bW5zKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgaWYgKGkgPD0gaikge1xuICAgICAgICAgIFguc2V0KGksIGosIGRhdGEuZ2V0KGksIGopKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBYLnNldChpLCBqLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWDtcbiAgfVxuXG4gIGdldCBwaXZvdFBlcm11dGF0aW9uVmVjdG9yKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucGl2b3RWZWN0b3IpO1xuICB9XG59XG4iLCJpbXBvcnQgTWF0cml4IGZyb20gJy4uL21hdHJpeCc7XG5pbXBvcnQgV3JhcHBlck1hdHJpeDJEIGZyb20gJy4uL3dyYXAvV3JhcHBlck1hdHJpeDJEJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgbmlwYWxzIHtcbiAgY29uc3RydWN0b3IoWCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgWCA9IFdyYXBwZXJNYXRyaXgyRC5jaGVja01hdHJpeChYKTtcbiAgICBsZXQgeyBZIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IHtcbiAgICAgIHNjYWxlU2NvcmVzID0gZmFsc2UsXG4gICAgICBtYXhJdGVyYXRpb25zID0gMTAwMCxcbiAgICAgIHRlcm1pbmF0aW9uQ3JpdGVyaWEgPSAxZS0xMCxcbiAgICB9ID0gb3B0aW9ucztcblxuICAgIGxldCB1O1xuICAgIGlmIChZKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShZKSAmJiB0eXBlb2YgWVswXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgWSA9IE1hdHJpeC5jb2x1bW5WZWN0b3IoWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBZID0gV3JhcHBlck1hdHJpeDJELmNoZWNrTWF0cml4KFkpO1xuICAgICAgfVxuICAgICAgaWYgKCFZLmlzQ29sdW1uVmVjdG9yKCkgfHwgWS5yb3dzICE9PSBYLnJvd3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZIG11c3QgYmUgYSBjb2x1bW4gdmVjdG9yIG9mIGxlbmd0aCBYLnJvd3MnKTtcbiAgICAgIH1cbiAgICAgIHUgPSBZO1xuICAgIH0gZWxzZSB7XG4gICAgICB1ID0gWC5nZXRDb2x1bW5WZWN0b3IoMCk7XG4gICAgfVxuXG4gICAgbGV0IGRpZmYgPSAxO1xuICAgIGxldCB0LCBxLCB3LCB0T2xkO1xuXG4gICAgZm9yIChcbiAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgIGNvdW50ZXIgPCBtYXhJdGVyYXRpb25zICYmIGRpZmYgPiB0ZXJtaW5hdGlvbkNyaXRlcmlhO1xuICAgICAgY291bnRlcisrXG4gICAgKSB7XG4gICAgICB3ID0gWC50cmFuc3Bvc2UoKS5tbXVsKHUpLmRpdih1LnRyYW5zcG9zZSgpLm1tdWwodSkuZ2V0KDAsIDApKTtcbiAgICAgIHcgPSB3LmRpdih3Lm5vcm0oKSk7XG5cbiAgICAgIHQgPSBYLm1tdWwodykuZGl2KHcudHJhbnNwb3NlKCkubW11bCh3KS5nZXQoMCwgMCkpO1xuXG4gICAgICBpZiAoY291bnRlciA+IDApIHtcbiAgICAgICAgZGlmZiA9IHQuY2xvbmUoKS5zdWIodE9sZCkucG93KDIpLnN1bSgpO1xuICAgICAgfVxuICAgICAgdE9sZCA9IHQuY2xvbmUoKTtcblxuICAgICAgaWYgKFkpIHtcbiAgICAgICAgcSA9IFkudHJhbnNwb3NlKCkubW11bCh0KS5kaXYodC50cmFuc3Bvc2UoKS5tbXVsKHQpLmdldCgwLCAwKSk7XG4gICAgICAgIHEgPSBxLmRpdihxLm5vcm0oKSk7XG5cbiAgICAgICAgdSA9IFkubW11bChxKS5kaXYocS50cmFuc3Bvc2UoKS5tbXVsKHEpLmdldCgwLCAwKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1ID0gdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoWSkge1xuICAgICAgbGV0IHAgPSBYLnRyYW5zcG9zZSgpLm1tdWwodCkuZGl2KHQudHJhbnNwb3NlKCkubW11bCh0KS5nZXQoMCwgMCkpO1xuICAgICAgcCA9IHAuZGl2KHAubm9ybSgpKTtcbiAgICAgIGxldCB4UmVzaWR1YWwgPSBYLmNsb25lKCkuc3ViKHQuY2xvbmUoKS5tbXVsKHAudHJhbnNwb3NlKCkpKTtcbiAgICAgIGxldCByZXNpZHVhbCA9IHUudHJhbnNwb3NlKCkubW11bCh0KS5kaXYodC50cmFuc3Bvc2UoKS5tbXVsKHQpLmdldCgwLCAwKSk7XG4gICAgICBsZXQgeVJlc2lkdWFsID0gWS5jbG9uZSgpLnN1YihcbiAgICAgICAgdC5jbG9uZSgpLm11bFMocmVzaWR1YWwuZ2V0KDAsIDApKS5tbXVsKHEudHJhbnNwb3NlKCkpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy50ID0gdDtcbiAgICAgIHRoaXMucCA9IHAudHJhbnNwb3NlKCk7XG4gICAgICB0aGlzLncgPSB3LnRyYW5zcG9zZSgpO1xuICAgICAgdGhpcy5xID0gcTtcbiAgICAgIHRoaXMudSA9IHU7XG4gICAgICB0aGlzLnMgPSB0LnRyYW5zcG9zZSgpLm1tdWwodCk7XG4gICAgICB0aGlzLnhSZXNpZHVhbCA9IHhSZXNpZHVhbDtcbiAgICAgIHRoaXMueVJlc2lkdWFsID0geVJlc2lkdWFsO1xuICAgICAgdGhpcy5iZXRhcyA9IHJlc2lkdWFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLncgPSB3LnRyYW5zcG9zZSgpO1xuICAgICAgdGhpcy5zID0gdC50cmFuc3Bvc2UoKS5tbXVsKHQpLnNxcnQoKTtcbiAgICAgIGlmIChzY2FsZVNjb3Jlcykge1xuICAgICAgICB0aGlzLnQgPSB0LmNsb25lKCkuZGl2KHRoaXMucy5nZXQoMCwgMCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50ID0gdDtcbiAgICAgIH1cbiAgICAgIHRoaXMueFJlc2lkdWFsID0gWC5zdWIodC5tbXVsKHcudHJhbnNwb3NlKCkpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBNYXRyaXggZnJvbSAnLi4vbWF0cml4JztcbmltcG9ydCBXcmFwcGVyTWF0cml4MkQgZnJvbSAnLi4vd3JhcC9XcmFwcGVyTWF0cml4MkQnO1xuXG5pbXBvcnQgeyBoeXBvdGVudXNlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXJEZWNvbXBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB2YWx1ZSA9IFdyYXBwZXJNYXRyaXgyRC5jaGVja01hdHJpeCh2YWx1ZSk7XG5cbiAgICBsZXQgcXIgPSB2YWx1ZS5jbG9uZSgpO1xuICAgIGxldCBtID0gdmFsdWUucm93cztcbiAgICBsZXQgbiA9IHZhbHVlLmNvbHVtbnM7XG4gICAgbGV0IHJkaWFnID0gbmV3IEZsb2F0NjRBcnJheShuKTtcbiAgICBsZXQgaSwgaiwgaywgcztcblxuICAgIGZvciAoayA9IDA7IGsgPCBuOyBrKyspIHtcbiAgICAgIGxldCBucm0gPSAwO1xuICAgICAgZm9yIChpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICBucm0gPSBoeXBvdGVudXNlKG5ybSwgcXIuZ2V0KGksIGspKTtcbiAgICAgIH1cbiAgICAgIGlmIChucm0gIT09IDApIHtcbiAgICAgICAgaWYgKHFyLmdldChrLCBrKSA8IDApIHtcbiAgICAgICAgICBucm0gPSAtbnJtO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IGs7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICBxci5zZXQoaSwgaywgcXIuZ2V0KGksIGspIC8gbnJtKTtcbiAgICAgICAgfVxuICAgICAgICBxci5zZXQoaywgaywgcXIuZ2V0KGssIGspICsgMSk7XG4gICAgICAgIGZvciAoaiA9IGsgKyAxOyBqIDwgbjsgaisrKSB7XG4gICAgICAgICAgcyA9IDA7XG4gICAgICAgICAgZm9yIChpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgcyArPSBxci5nZXQoaSwgaykgKiBxci5nZXQoaSwgaik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHMgPSAtcyAvIHFyLmdldChrLCBrKTtcbiAgICAgICAgICBmb3IgKGkgPSBrOyBpIDwgbTsgaSsrKSB7XG4gICAgICAgICAgICBxci5zZXQoaSwgaiwgcXIuZ2V0KGksIGopICsgcyAqIHFyLmdldChpLCBrKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZGlhZ1trXSA9IC1ucm07XG4gICAgfVxuXG4gICAgdGhpcy5RUiA9IHFyO1xuICAgIHRoaXMuUmRpYWcgPSByZGlhZztcbiAgfVxuXG4gIHNvbHZlKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBNYXRyaXguY2hlY2tNYXRyaXgodmFsdWUpO1xuXG4gICAgbGV0IHFyID0gdGhpcy5RUjtcbiAgICBsZXQgbSA9IHFyLnJvd3M7XG5cbiAgICBpZiAodmFsdWUucm93cyAhPT0gbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXRyaXggcm93IGRpbWVuc2lvbnMgbXVzdCBhZ3JlZScpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNGdWxsUmFuaygpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hdHJpeCBpcyByYW5rIGRlZmljaWVudCcpO1xuICAgIH1cblxuICAgIGxldCBjb3VudCA9IHZhbHVlLmNvbHVtbnM7XG4gICAgbGV0IFggPSB2YWx1ZS5jbG9uZSgpO1xuICAgIGxldCBuID0gcXIuY29sdW1ucztcbiAgICBsZXQgaSwgaiwgaywgcztcblxuICAgIGZvciAoayA9IDA7IGsgPCBuOyBrKyspIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBjb3VudDsgaisrKSB7XG4gICAgICAgIHMgPSAwO1xuICAgICAgICBmb3IgKGkgPSBrOyBpIDwgbTsgaSsrKSB7XG4gICAgICAgICAgcyArPSBxci5nZXQoaSwgaykgKiBYLmdldChpLCBqKTtcbiAgICAgICAgfVxuICAgICAgICBzID0gLXMgLyBxci5nZXQoaywgayk7XG4gICAgICAgIGZvciAoaSA9IGs7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICBYLnNldChpLCBqLCBYLmdldChpLCBqKSArIHMgKiBxci5nZXQoaSwgaykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoayA9IG4gLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgZm9yIChqID0gMDsgaiA8IGNvdW50OyBqKyspIHtcbiAgICAgICAgWC5zZXQoaywgaiwgWC5nZXQoaywgaikgLyB0aGlzLlJkaWFnW2tdKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvdW50OyBqKyspIHtcbiAgICAgICAgICBYLnNldChpLCBqLCBYLmdldChpLCBqKSAtIFguZ2V0KGssIGopICogcXIuZ2V0KGksIGspKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBYLnN1Yk1hdHJpeCgwLCBuIC0gMSwgMCwgY291bnQgLSAxKTtcbiAgfVxuXG4gIGlzRnVsbFJhbmsoKSB7XG4gICAgbGV0IGNvbHVtbnMgPSB0aGlzLlFSLmNvbHVtbnM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5zOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLlJkaWFnW2ldID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgdXBwZXJUcmlhbmd1bGFyTWF0cml4KCkge1xuICAgIGxldCBxciA9IHRoaXMuUVI7XG4gICAgbGV0IG4gPSBxci5jb2x1bW5zO1xuICAgIGxldCBYID0gbmV3IE1hdHJpeChuLCBuKTtcbiAgICBsZXQgaSwgajtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgbjsgaisrKSB7XG4gICAgICAgIGlmIChpIDwgaikge1xuICAgICAgICAgIFguc2V0KGksIGosIHFyLmdldChpLCBqKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gaikge1xuICAgICAgICAgIFguc2V0KGksIGosIHRoaXMuUmRpYWdbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFguc2V0KGksIGosIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBYO1xuICB9XG5cbiAgZ2V0IG9ydGhvZ29uYWxNYXRyaXgoKSB7XG4gICAgbGV0IHFyID0gdGhpcy5RUjtcbiAgICBsZXQgcm93cyA9IHFyLnJvd3M7XG4gICAgbGV0IGNvbHVtbnMgPSBxci5jb2x1bW5zO1xuICAgIGxldCBYID0gbmV3IE1hdHJpeChyb3dzLCBjb2x1bW5zKTtcbiAgICBsZXQgaSwgaiwgaywgcztcblxuICAgIGZvciAoayA9IGNvbHVtbnMgLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICBYLnNldChpLCBrLCAwKTtcbiAgICAgIH1cbiAgICAgIFguc2V0KGssIGssIDEpO1xuICAgICAgZm9yIChqID0gazsgaiA8IGNvbHVtbnM7IGorKykge1xuICAgICAgICBpZiAocXIuZ2V0KGssIGspICE9PSAwKSB7XG4gICAgICAgICAgcyA9IDA7XG4gICAgICAgICAgZm9yIChpID0gazsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICAgICAgcyArPSBxci5nZXQoaSwgaykgKiBYLmdldChpLCBqKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzID0gLXMgLyBxci5nZXQoaywgayk7XG5cbiAgICAgICAgICBmb3IgKGkgPSBrOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICAgICAgICBYLnNldChpLCBqLCBYLmdldChpLCBqKSArIHMgKiBxci5nZXQoaSwgaykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWDtcbiAgfVxufVxuIiwiaW1wb3J0IE1hdHJpeCBmcm9tICcuLi9tYXRyaXgnO1xuaW1wb3J0IFdyYXBwZXJNYXRyaXgyRCBmcm9tICcuLi93cmFwL1dyYXBwZXJNYXRyaXgyRCc7XG5cbmltcG9ydCB7IGh5cG90ZW51c2UgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW5ndWxhclZhbHVlRGVjb21wb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICB2YWx1ZSA9IFdyYXBwZXJNYXRyaXgyRC5jaGVja01hdHJpeCh2YWx1ZSk7XG5cbiAgICBpZiAodmFsdWUuaXNFbXB0eSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hdHJpeCBtdXN0IGJlIG5vbi1lbXB0eScpO1xuICAgIH1cblxuICAgIGxldCBtID0gdmFsdWUucm93cztcbiAgICBsZXQgbiA9IHZhbHVlLmNvbHVtbnM7XG5cbiAgICBjb25zdCB7XG4gICAgICBjb21wdXRlTGVmdFNpbmd1bGFyVmVjdG9ycyA9IHRydWUsXG4gICAgICBjb21wdXRlUmlnaHRTaW5ndWxhclZlY3RvcnMgPSB0cnVlLFxuICAgICAgYXV0b1RyYW5zcG9zZSA9IGZhbHNlLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgbGV0IHdhbnR1ID0gQm9vbGVhbihjb21wdXRlTGVmdFNpbmd1bGFyVmVjdG9ycyk7XG4gICAgbGV0IHdhbnR2ID0gQm9vbGVhbihjb21wdXRlUmlnaHRTaW5ndWxhclZlY3RvcnMpO1xuXG4gICAgbGV0IHN3YXBwZWQgPSBmYWxzZTtcbiAgICBsZXQgYTtcbiAgICBpZiAobSA8IG4pIHtcbiAgICAgIGlmICghYXV0b1RyYW5zcG9zZSkge1xuICAgICAgICBhID0gdmFsdWUuY2xvbmUoKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdDb21wdXRpbmcgU1ZEIG9uIGEgbWF0cml4IHdpdGggbW9yZSBjb2x1bW5zIHRoYW4gcm93cy4gQ29uc2lkZXIgZW5hYmxpbmcgYXV0b1RyYW5zcG9zZScsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhID0gdmFsdWUudHJhbnNwb3NlKCk7XG4gICAgICAgIG0gPSBhLnJvd3M7XG4gICAgICAgIG4gPSBhLmNvbHVtbnM7XG4gICAgICAgIHN3YXBwZWQgPSB0cnVlO1xuICAgICAgICBsZXQgYXV4ID0gd2FudHU7XG4gICAgICAgIHdhbnR1ID0gd2FudHY7XG4gICAgICAgIHdhbnR2ID0gYXV4O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhID0gdmFsdWUuY2xvbmUoKTtcbiAgICB9XG5cbiAgICBsZXQgbnUgPSBNYXRoLm1pbihtLCBuKTtcbiAgICBsZXQgbmkgPSBNYXRoLm1pbihtICsgMSwgbik7XG4gICAgbGV0IHMgPSBuZXcgRmxvYXQ2NEFycmF5KG5pKTtcbiAgICBsZXQgVSA9IG5ldyBNYXRyaXgobSwgbnUpO1xuICAgIGxldCBWID0gbmV3IE1hdHJpeChuLCBuKTtcblxuICAgIGxldCBlID0gbmV3IEZsb2F0NjRBcnJheShuKTtcbiAgICBsZXQgd29yayA9IG5ldyBGbG9hdDY0QXJyYXkobSk7XG5cbiAgICBsZXQgc2kgPSBuZXcgRmxvYXQ2NEFycmF5KG5pKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5pOyBpKyspIHNpW2ldID0gaTtcblxuICAgIGxldCBuY3QgPSBNYXRoLm1pbihtIC0gMSwgbik7XG4gICAgbGV0IG5ydCA9IE1hdGgubWF4KDAsIE1hdGgubWluKG4gLSAyLCBtKSk7XG4gICAgbGV0IG1yYyA9IE1hdGgubWF4KG5jdCwgbnJ0KTtcblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbXJjOyBrKyspIHtcbiAgICAgIGlmIChrIDwgbmN0KSB7XG4gICAgICAgIHNba10gPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICAgIHNba10gPSBoeXBvdGVudXNlKHNba10sIGEuZ2V0KGksIGspKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc1trXSAhPT0gMCkge1xuICAgICAgICAgIGlmIChhLmdldChrLCBrKSA8IDApIHtcbiAgICAgICAgICAgIHNba10gPSAtc1trXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGs7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgIGEuc2V0KGksIGssIGEuZ2V0KGksIGspIC8gc1trXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGEuc2V0KGssIGssIGEuZ2V0KGssIGspICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgc1trXSA9IC1zW2tdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBqID0gayArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgICAgaWYgKGsgPCBuY3QgJiYgc1trXSAhPT0gMCkge1xuICAgICAgICAgIGxldCB0ID0gMDtcbiAgICAgICAgICBmb3IgKGxldCBpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgdCArPSBhLmdldChpLCBrKSAqIGEuZ2V0KGksIGopO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ID0gLXQgLyBhLmdldChrLCBrKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgYS5zZXQoaSwgaiwgYS5nZXQoaSwgaikgKyB0ICogYS5nZXQoaSwgaykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlW2pdID0gYS5nZXQoaywgaik7XG4gICAgICB9XG5cbiAgICAgIGlmICh3YW50dSAmJiBrIDwgbmN0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBrOyBpIDwgbTsgaSsrKSB7XG4gICAgICAgICAgVS5zZXQoaSwgaywgYS5nZXQoaSwgaykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChrIDwgbnJ0KSB7XG4gICAgICAgIGVba10gPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gayArIDE7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICBlW2tdID0gaHlwb3RlbnVzZShlW2tdLCBlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZVtrXSAhPT0gMCkge1xuICAgICAgICAgIGlmIChlW2sgKyAxXSA8IDApIHtcbiAgICAgICAgICAgIGVba10gPSAwIC0gZVtrXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGsgKyAxOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBlW2ldIC89IGVba107XG4gICAgICAgICAgfVxuICAgICAgICAgIGVbayArIDFdICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZVtrXSA9IC1lW2tdO1xuICAgICAgICBpZiAoayArIDEgPCBtICYmIGVba10gIT09IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gayArIDE7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgIHdvcmtbaV0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGxldCBpID0gayArIDE7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBrICsgMTsgaiA8IG47IGorKykge1xuICAgICAgICAgICAgICB3b3JrW2ldICs9IGVbal0gKiBhLmdldChpLCBqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChsZXQgaiA9IGsgKyAxOyBqIDwgbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdCA9IC1lW2pdIC8gZVtrICsgMV07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gayArIDE7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgICAgYS5zZXQoaSwgaiwgYS5nZXQoaSwgaikgKyB0ICogd29ya1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh3YW50dikge1xuICAgICAgICAgIGZvciAobGV0IGkgPSBrICsgMTsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgVi5zZXQoaSwgaywgZVtpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHAgPSBNYXRoLm1pbihuLCBtICsgMSk7XG4gICAgaWYgKG5jdCA8IG4pIHtcbiAgICAgIHNbbmN0XSA9IGEuZ2V0KG5jdCwgbmN0KTtcbiAgICB9XG4gICAgaWYgKG0gPCBwKSB7XG4gICAgICBzW3AgLSAxXSA9IDA7XG4gICAgfVxuICAgIGlmIChucnQgKyAxIDwgcCkge1xuICAgICAgZVtucnRdID0gYS5nZXQobnJ0LCBwIC0gMSk7XG4gICAgfVxuICAgIGVbcCAtIDFdID0gMDtcblxuICAgIGlmICh3YW50dSkge1xuICAgICAgZm9yIChsZXQgaiA9IG5jdDsgaiA8IG51OyBqKyspIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICBVLnNldChpLCBqLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBVLnNldChqLCBqLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGsgPSBuY3QgLSAxOyBrID49IDA7IGstLSkge1xuICAgICAgICBpZiAoc1trXSAhPT0gMCkge1xuICAgICAgICAgIGZvciAobGV0IGogPSBrICsgMTsgaiA8IG51OyBqKyspIHtcbiAgICAgICAgICAgIGxldCB0ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBrOyBpIDwgbTsgaSsrKSB7XG4gICAgICAgICAgICAgIHQgKz0gVS5nZXQoaSwgaykgKiBVLmdldChpLCBqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQgPSAtdCAvIFUuZ2V0KGssIGspO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGs7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgICAgICAgVS5zZXQoaSwgaiwgVS5nZXQoaSwgaikgKyB0ICogVS5nZXQoaSwgaykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGxldCBpID0gazsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgVS5zZXQoaSwgaywgLVUuZ2V0KGksIGspKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgVS5zZXQoaywgaywgMSArIFUuZ2V0KGssIGspKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGsgLSAxOyBpKyspIHtcbiAgICAgICAgICAgIFUuc2V0KGksIGssIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgVS5zZXQoaSwgaywgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFUuc2V0KGssIGssIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdhbnR2KSB7XG4gICAgICBmb3IgKGxldCBrID0gbiAtIDE7IGsgPj0gMDsgay0tKSB7XG4gICAgICAgIGlmIChrIDwgbnJ0ICYmIGVba10gIT09IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gayArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgICAgICAgIGxldCB0ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBrICsgMTsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICB0ICs9IFYuZ2V0KGksIGspICogVi5nZXQoaSwgaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ID0gLXQgLyBWLmdldChrICsgMSwgayk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gayArIDE7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgVi5zZXQoaSwgaiwgVi5nZXQoaSwgaikgKyB0ICogVi5nZXQoaSwgaykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgIFYuc2V0KGksIGssIDApO1xuICAgICAgICB9XG4gICAgICAgIFYuc2V0KGssIGssIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcCA9IHAgLSAxO1xuICAgIGxldCBpdGVyID0gMDtcbiAgICBsZXQgZXBzID0gTnVtYmVyLkVQU0lMT047XG4gICAgd2hpbGUgKHAgPiAwKSB7XG4gICAgICBsZXQgaywga2FzZTtcbiAgICAgIGZvciAoayA9IHAgLSAyOyBrID49IC0xOyBrLS0pIHtcbiAgICAgICAgaWYgKGsgPT09IC0xKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWxwaGEgPVxuICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUgKyBlcHMgKiBNYXRoLmFicyhzW2tdICsgTWF0aC5hYnMoc1trICsgMV0pKTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGVba10pIDw9IGFscGhhIHx8IE51bWJlci5pc05hTihlW2tdKSkge1xuICAgICAgICAgIGVba10gPSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoayA9PT0gcCAtIDIpIHtcbiAgICAgICAga2FzZSA9IDQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQga3M7XG4gICAgICAgIGZvciAoa3MgPSBwIC0gMTsga3MgPj0gazsga3MtLSkge1xuICAgICAgICAgIGlmIChrcyA9PT0gaykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB0ID1cbiAgICAgICAgICAgIChrcyAhPT0gcCA/IE1hdGguYWJzKGVba3NdKSA6IDApICtcbiAgICAgICAgICAgIChrcyAhPT0gayArIDEgPyBNYXRoLmFicyhlW2tzIC0gMV0pIDogMCk7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKHNba3NdKSA8PSBlcHMgKiB0KSB7XG4gICAgICAgICAgICBzW2tzXSA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtzID09PSBrKSB7XG4gICAgICAgICAga2FzZSA9IDM7XG4gICAgICAgIH0gZWxzZSBpZiAoa3MgPT09IHAgLSAxKSB7XG4gICAgICAgICAga2FzZSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAga2FzZSA9IDI7XG4gICAgICAgICAgayA9IGtzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGsrKztcblxuICAgICAgc3dpdGNoIChrYXNlKSB7XG4gICAgICAgIGNhc2UgMToge1xuICAgICAgICAgIGxldCBmID0gZVtwIC0gMl07XG4gICAgICAgICAgZVtwIC0gMl0gPSAwO1xuICAgICAgICAgIGZvciAobGV0IGogPSBwIC0gMjsgaiA+PSBrOyBqLS0pIHtcbiAgICAgICAgICAgIGxldCB0ID0gaHlwb3RlbnVzZShzW2pdLCBmKTtcbiAgICAgICAgICAgIGxldCBjcyA9IHNbal0gLyB0O1xuICAgICAgICAgICAgbGV0IHNuID0gZiAvIHQ7XG4gICAgICAgICAgICBzW2pdID0gdDtcbiAgICAgICAgICAgIGlmIChqICE9PSBrKSB7XG4gICAgICAgICAgICAgIGYgPSAtc24gKiBlW2ogLSAxXTtcbiAgICAgICAgICAgICAgZVtqIC0gMV0gPSBjcyAqIGVbaiAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdhbnR2KSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdCA9IGNzICogVi5nZXQoaSwgaikgKyBzbiAqIFYuZ2V0KGksIHAgLSAxKTtcbiAgICAgICAgICAgICAgICBWLnNldChpLCBwIC0gMSwgLXNuICogVi5nZXQoaSwgaikgKyBjcyAqIFYuZ2V0KGksIHAgLSAxKSk7XG4gICAgICAgICAgICAgICAgVi5zZXQoaSwgaiwgdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAyOiB7XG4gICAgICAgICAgbGV0IGYgPSBlW2sgLSAxXTtcbiAgICAgICAgICBlW2sgLSAxXSA9IDA7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IGs7IGogPCBwOyBqKyspIHtcbiAgICAgICAgICAgIGxldCB0ID0gaHlwb3RlbnVzZShzW2pdLCBmKTtcbiAgICAgICAgICAgIGxldCBjcyA9IHNbal0gLyB0O1xuICAgICAgICAgICAgbGV0IHNuID0gZiAvIHQ7XG4gICAgICAgICAgICBzW2pdID0gdDtcbiAgICAgICAgICAgIGYgPSAtc24gKiBlW2pdO1xuICAgICAgICAgICAgZVtqXSA9IGNzICogZVtqXTtcbiAgICAgICAgICAgIGlmICh3YW50dSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgICAgIHQgPSBjcyAqIFUuZ2V0KGksIGopICsgc24gKiBVLmdldChpLCBrIC0gMSk7XG4gICAgICAgICAgICAgICAgVS5zZXQoaSwgayAtIDEsIC1zbiAqIFUuZ2V0KGksIGopICsgY3MgKiBVLmdldChpLCBrIC0gMSkpO1xuICAgICAgICAgICAgICAgIFUuc2V0KGksIGosIHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMzoge1xuICAgICAgICAgIGNvbnN0IHNjYWxlID0gTWF0aC5tYXgoXG4gICAgICAgICAgICBNYXRoLmFicyhzW3AgLSAxXSksXG4gICAgICAgICAgICBNYXRoLmFicyhzW3AgLSAyXSksXG4gICAgICAgICAgICBNYXRoLmFicyhlW3AgLSAyXSksXG4gICAgICAgICAgICBNYXRoLmFicyhzW2tdKSxcbiAgICAgICAgICAgIE1hdGguYWJzKGVba10pLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3Qgc3AgPSBzW3AgLSAxXSAvIHNjYWxlO1xuICAgICAgICAgIGNvbnN0IHNwbTEgPSBzW3AgLSAyXSAvIHNjYWxlO1xuICAgICAgICAgIGNvbnN0IGVwbTEgPSBlW3AgLSAyXSAvIHNjYWxlO1xuICAgICAgICAgIGNvbnN0IHNrID0gc1trXSAvIHNjYWxlO1xuICAgICAgICAgIGNvbnN0IGVrID0gZVtrXSAvIHNjYWxlO1xuICAgICAgICAgIGNvbnN0IGIgPSAoKHNwbTEgKyBzcCkgKiAoc3BtMSAtIHNwKSArIGVwbTEgKiBlcG0xKSAvIDI7XG4gICAgICAgICAgY29uc3QgYyA9IHNwICogZXBtMSAqIChzcCAqIGVwbTEpO1xuICAgICAgICAgIGxldCBzaGlmdCA9IDA7XG4gICAgICAgICAgaWYgKGIgIT09IDAgfHwgYyAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKGIgPCAwKSB7XG4gICAgICAgICAgICAgIHNoaWZ0ID0gMCAtIE1hdGguc3FydChiICogYiArIGMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2hpZnQgPSBNYXRoLnNxcnQoYiAqIGIgKyBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoaWZ0ID0gYyAvIChiICsgc2hpZnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgZiA9IChzayArIHNwKSAqIChzayAtIHNwKSArIHNoaWZ0O1xuICAgICAgICAgIGxldCBnID0gc2sgKiBlaztcbiAgICAgICAgICBmb3IgKGxldCBqID0gazsgaiA8IHAgLSAxOyBqKyspIHtcbiAgICAgICAgICAgIGxldCB0ID0gaHlwb3RlbnVzZShmLCBnKTtcbiAgICAgICAgICAgIGlmICh0ID09PSAwKSB0ID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgICAgICAgIGxldCBjcyA9IGYgLyB0O1xuICAgICAgICAgICAgbGV0IHNuID0gZyAvIHQ7XG4gICAgICAgICAgICBpZiAoaiAhPT0gaykge1xuICAgICAgICAgICAgICBlW2ogLSAxXSA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmID0gY3MgKiBzW2pdICsgc24gKiBlW2pdO1xuICAgICAgICAgICAgZVtqXSA9IGNzICogZVtqXSAtIHNuICogc1tqXTtcbiAgICAgICAgICAgIGcgPSBzbiAqIHNbaiArIDFdO1xuICAgICAgICAgICAgc1tqICsgMV0gPSBjcyAqIHNbaiArIDFdO1xuICAgICAgICAgICAgaWYgKHdhbnR2KSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdCA9IGNzICogVi5nZXQoaSwgaikgKyBzbiAqIFYuZ2V0KGksIGogKyAxKTtcbiAgICAgICAgICAgICAgICBWLnNldChpLCBqICsgMSwgLXNuICogVi5nZXQoaSwgaikgKyBjcyAqIFYuZ2V0KGksIGogKyAxKSk7XG4gICAgICAgICAgICAgICAgVi5zZXQoaSwgaiwgdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQgPSBoeXBvdGVudXNlKGYsIGcpO1xuICAgICAgICAgICAgaWYgKHQgPT09IDApIHQgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICAgICAgY3MgPSBmIC8gdDtcbiAgICAgICAgICAgIHNuID0gZyAvIHQ7XG4gICAgICAgICAgICBzW2pdID0gdDtcbiAgICAgICAgICAgIGYgPSBjcyAqIGVbal0gKyBzbiAqIHNbaiArIDFdO1xuICAgICAgICAgICAgc1tqICsgMV0gPSAtc24gKiBlW2pdICsgY3MgKiBzW2ogKyAxXTtcbiAgICAgICAgICAgIGcgPSBzbiAqIGVbaiArIDFdO1xuICAgICAgICAgICAgZVtqICsgMV0gPSBjcyAqIGVbaiArIDFdO1xuICAgICAgICAgICAgaWYgKHdhbnR1ICYmIGogPCBtIC0gMSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgICAgIHQgPSBjcyAqIFUuZ2V0KGksIGopICsgc24gKiBVLmdldChpLCBqICsgMSk7XG4gICAgICAgICAgICAgICAgVS5zZXQoaSwgaiArIDEsIC1zbiAqIFUuZ2V0KGksIGopICsgY3MgKiBVLmdldChpLCBqICsgMSkpO1xuICAgICAgICAgICAgICAgIFUuc2V0KGksIGosIHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVbcCAtIDJdID0gZjtcbiAgICAgICAgICBpdGVyID0gaXRlciArIDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSA0OiB7XG4gICAgICAgICAgaWYgKHNba10gPD0gMCkge1xuICAgICAgICAgICAgc1trXSA9IHNba10gPCAwID8gLXNba10gOiAwO1xuICAgICAgICAgICAgaWYgKHdhbnR2KSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHBwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBWLnNldChpLCBrLCAtVi5nZXQoaSwgaykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlIChrIDwgcHApIHtcbiAgICAgICAgICAgIGlmIChzW2tdID49IHNbayArIDFdKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHQgPSBzW2tdO1xuICAgICAgICAgICAgc1trXSA9IHNbayArIDFdO1xuICAgICAgICAgICAgc1trICsgMV0gPSB0O1xuICAgICAgICAgICAgaWYgKHdhbnR2ICYmIGsgPCBuIC0gMSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIHQgPSBWLmdldChpLCBrICsgMSk7XG4gICAgICAgICAgICAgICAgVi5zZXQoaSwgayArIDEsIFYuZ2V0KGksIGspKTtcbiAgICAgICAgICAgICAgICBWLnNldChpLCBrLCB0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdhbnR1ICYmIGsgPCBtIC0gMSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgICAgIHQgPSBVLmdldChpLCBrICsgMSk7XG4gICAgICAgICAgICAgICAgVS5zZXQoaSwgayArIDEsIFUuZ2V0KGksIGspKTtcbiAgICAgICAgICAgICAgICBVLnNldChpLCBrLCB0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVyID0gMDtcbiAgICAgICAgICBwLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm8gZGVmYXVsdFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzd2FwcGVkKSB7XG4gICAgICBsZXQgdG1wID0gVjtcbiAgICAgIFYgPSBVO1xuICAgICAgVSA9IHRtcDtcbiAgICB9XG5cbiAgICB0aGlzLm0gPSBtO1xuICAgIHRoaXMubiA9IG47XG4gICAgdGhpcy5zID0gcztcbiAgICB0aGlzLlUgPSBVO1xuICAgIHRoaXMuViA9IFY7XG4gIH1cblxuICBzb2x2ZSh2YWx1ZSkge1xuICAgIGxldCBZID0gdmFsdWU7XG4gICAgbGV0IGUgPSB0aGlzLnRocmVzaG9sZDtcbiAgICBsZXQgc2NvbHMgPSB0aGlzLnMubGVuZ3RoO1xuICAgIGxldCBMcyA9IE1hdHJpeC56ZXJvcyhzY29scywgc2NvbHMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY29sczsgaSsrKSB7XG4gICAgICBpZiAoTWF0aC5hYnModGhpcy5zW2ldKSA8PSBlKSB7XG4gICAgICAgIExzLnNldChpLCBpLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIExzLnNldChpLCBpLCAxIC8gdGhpcy5zW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgVSA9IHRoaXMuVTtcbiAgICBsZXQgViA9IHRoaXMucmlnaHRTaW5ndWxhclZlY3RvcnM7XG5cbiAgICBsZXQgVkwgPSBWLm1tdWwoTHMpO1xuICAgIGxldCB2cm93cyA9IFYucm93cztcbiAgICBsZXQgdXJvd3MgPSBVLnJvd3M7XG4gICAgbGV0IFZMVSA9IE1hdHJpeC56ZXJvcyh2cm93cywgdXJvd3MpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2cm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVyb3dzOyBqKyspIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc2NvbHM7IGsrKykge1xuICAgICAgICAgIHN1bSArPSBWTC5nZXQoaSwgaykgKiBVLmdldChqLCBrKTtcbiAgICAgICAgfVxuICAgICAgICBWTFUuc2V0KGksIGosIHN1bSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFZMVS5tbXVsKFkpO1xuICB9XG5cbiAgc29sdmVGb3JEaWFnb25hbCh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNvbHZlKE1hdHJpeC5kaWFnKHZhbHVlKSk7XG4gIH1cblxuICBpbnZlcnNlKCkge1xuICAgIGxldCBWID0gdGhpcy5WO1xuICAgIGxldCBlID0gdGhpcy50aHJlc2hvbGQ7XG4gICAgbGV0IHZyb3dzID0gVi5yb3dzO1xuICAgIGxldCB2Y29scyA9IFYuY29sdW1ucztcbiAgICBsZXQgWCA9IG5ldyBNYXRyaXgodnJvd3MsIHRoaXMucy5sZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2cm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHZjb2xzOyBqKyspIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuc1tqXSkgPiBlKSB7XG4gICAgICAgICAgWC5zZXQoaSwgaiwgVi5nZXQoaSwgaikgLyB0aGlzLnNbal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IFUgPSB0aGlzLlU7XG5cbiAgICBsZXQgdXJvd3MgPSBVLnJvd3M7XG4gICAgbGV0IHVjb2xzID0gVS5jb2x1bW5zO1xuICAgIGxldCBZID0gbmV3IE1hdHJpeCh2cm93cywgdXJvd3MpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2cm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVyb3dzOyBqKyspIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdWNvbHM7IGsrKykge1xuICAgICAgICAgIHN1bSArPSBYLmdldChpLCBrKSAqIFUuZ2V0KGosIGspO1xuICAgICAgICB9XG4gICAgICAgIFkuc2V0KGksIGosIHN1bSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFk7XG4gIH1cblxuICBnZXQgY29uZGl0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnNbMF0gLyB0aGlzLnNbTWF0aC5taW4odGhpcy5tLCB0aGlzLm4pIC0gMV07XG4gIH1cblxuICBnZXQgbm9ybTIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc1swXTtcbiAgfVxuXG4gIGdldCByYW5rKCkge1xuICAgIGxldCB0b2wgPSBNYXRoLm1heCh0aGlzLm0sIHRoaXMubikgKiB0aGlzLnNbMF0gKiBOdW1iZXIuRVBTSUxPTjtcbiAgICBsZXQgciA9IDA7XG4gICAgbGV0IHMgPSB0aGlzLnM7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICBpZiAoc1tpXSA+IHRvbCkge1xuICAgICAgICByKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG5cbiAgZ2V0IGRpYWdvbmFsKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucyk7XG4gIH1cblxuICBnZXQgdGhyZXNob2xkKCkge1xuICAgIHJldHVybiAoTnVtYmVyLkVQU0lMT04gLyAyKSAqIE1hdGgubWF4KHRoaXMubSwgdGhpcy5uKSAqIHRoaXMuc1swXTtcbiAgfVxuXG4gIGdldCBsZWZ0U2luZ3VsYXJWZWN0b3JzKCkge1xuICAgIHJldHVybiB0aGlzLlU7XG4gIH1cblxuICBnZXQgcmlnaHRTaW5ndWxhclZlY3RvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuVjtcbiAgfVxuXG4gIGdldCBkaWFnb25hbE1hdHJpeCgpIHtcbiAgICByZXR1cm4gTWF0cml4LmRpYWcodGhpcy5zKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGh5cG90ZW51c2UoYSwgYikge1xuICBsZXQgciA9IDA7XG4gIGlmIChNYXRoLmFicyhhKSA+IE1hdGguYWJzKGIpKSB7XG4gICAgciA9IGIgLyBhO1xuICAgIHJldHVybiBNYXRoLmFicyhhKSAqIE1hdGguc3FydCgxICsgciAqIHIpO1xuICB9XG4gIGlmIChiICE9PSAwKSB7XG4gICAgciA9IGEgLyBiO1xuICAgIHJldHVybiBNYXRoLmFicyhiKSAqIE1hdGguc3FydCgxICsgciAqIHIpO1xuICB9XG4gIHJldHVybiAwO1xufVxuIiwiaW1wb3J0IEx1RGVjb21wb3NpdGlvbiBmcm9tICcuL2RjL2x1JztcbmltcG9ydCBRckRlY29tcG9zaXRpb24gZnJvbSAnLi9kYy9xcic7XG5pbXBvcnQgU2luZ3VsYXJWYWx1ZURlY29tcG9zaXRpb24gZnJvbSAnLi9kYy9zdmQnO1xuaW1wb3J0IE1hdHJpeCBmcm9tICcuL21hdHJpeCc7XG5pbXBvcnQgV3JhcHBlck1hdHJpeDJEIGZyb20gJy4vd3JhcC9XcmFwcGVyTWF0cml4MkQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShtYXRyaXgsIHVzZVNWRCA9IGZhbHNlKSB7XG4gIG1hdHJpeCA9IFdyYXBwZXJNYXRyaXgyRC5jaGVja01hdHJpeChtYXRyaXgpO1xuICBpZiAodXNlU1ZEKSB7XG4gICAgcmV0dXJuIG5ldyBTaW5ndWxhclZhbHVlRGVjb21wb3NpdGlvbihtYXRyaXgpLmludmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc29sdmUobWF0cml4LCBNYXRyaXguZXllKG1hdHJpeC5yb3dzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlKGxlZnRIYW5kU2lkZSwgcmlnaHRIYW5kU2lkZSwgdXNlU1ZEID0gZmFsc2UpIHtcbiAgbGVmdEhhbmRTaWRlID0gV3JhcHBlck1hdHJpeDJELmNoZWNrTWF0cml4KGxlZnRIYW5kU2lkZSk7XG4gIHJpZ2h0SGFuZFNpZGUgPSBXcmFwcGVyTWF0cml4MkQuY2hlY2tNYXRyaXgocmlnaHRIYW5kU2lkZSk7XG4gIGlmICh1c2VTVkQpIHtcbiAgICByZXR1cm4gbmV3IFNpbmd1bGFyVmFsdWVEZWNvbXBvc2l0aW9uKGxlZnRIYW5kU2lkZSkuc29sdmUocmlnaHRIYW5kU2lkZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxlZnRIYW5kU2lkZS5pc1NxdWFyZSgpXG4gICAgICA/IG5ldyBMdURlY29tcG9zaXRpb24obGVmdEhhbmRTaWRlKS5zb2x2ZShyaWdodEhhbmRTaWRlKVxuICAgICAgOiBuZXcgUXJEZWNvbXBvc2l0aW9uKGxlZnRIYW5kU2lkZSkuc29sdmUocmlnaHRIYW5kU2lkZSk7XG4gIH1cbn1cbiIsImltcG9ydCBMdURlY29tcG9zaXRpb24gZnJvbSAnLi9kYy9sdSc7XG5pbXBvcnQgTWF0cml4IGZyb20gJy4vbWF0cml4JztcbmltcG9ydCBNYXRyaXhTZWxlY3Rpb25WaWV3IGZyb20gJy4vdmlld3Mvc2VsZWN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluYW50KG1hdHJpeCkge1xuICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgaWYgKG1hdHJpeC5pc1NxdWFyZSgpKSB7XG4gICAgaWYgKG1hdHJpeC5jb2x1bW5zID09PSAwKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBsZXQgYSwgYiwgYywgZDtcbiAgICBpZiAobWF0cml4LmNvbHVtbnMgPT09IDIpIHtcbiAgICAgIC8vIDIgeCAyIG1hdHJpeFxuICAgICAgYSA9IG1hdHJpeC5nZXQoMCwgMCk7XG4gICAgICBiID0gbWF0cml4LmdldCgwLCAxKTtcbiAgICAgIGMgPSBtYXRyaXguZ2V0KDEsIDApO1xuICAgICAgZCA9IG1hdHJpeC5nZXQoMSwgMSk7XG5cbiAgICAgIHJldHVybiBhICogZCAtIGIgKiBjO1xuICAgIH0gZWxzZSBpZiAobWF0cml4LmNvbHVtbnMgPT09IDMpIHtcbiAgICAgIC8vIDMgeCAzIG1hdHJpeFxuICAgICAgbGV0IHN1Yk1hdHJpeDAsIHN1Yk1hdHJpeDEsIHN1Yk1hdHJpeDI7XG4gICAgICBzdWJNYXRyaXgwID0gbmV3IE1hdHJpeFNlbGVjdGlvblZpZXcobWF0cml4LCBbMSwgMl0sIFsxLCAyXSk7XG4gICAgICBzdWJNYXRyaXgxID0gbmV3IE1hdHJpeFNlbGVjdGlvblZpZXcobWF0cml4LCBbMSwgMl0sIFswLCAyXSk7XG4gICAgICBzdWJNYXRyaXgyID0gbmV3IE1hdHJpeFNlbGVjdGlvblZpZXcobWF0cml4LCBbMSwgMl0sIFswLCAxXSk7XG4gICAgICBhID0gbWF0cml4LmdldCgwLCAwKTtcbiAgICAgIGIgPSBtYXRyaXguZ2V0KDAsIDEpO1xuICAgICAgYyA9IG1hdHJpeC5nZXQoMCwgMik7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIGEgKiBkZXRlcm1pbmFudChzdWJNYXRyaXgwKSAtXG4gICAgICAgIGIgKiBkZXRlcm1pbmFudChzdWJNYXRyaXgxKSArXG4gICAgICAgIGMgKiBkZXRlcm1pbmFudChzdWJNYXRyaXgyKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZ2VuZXJhbCBwdXJwb3NlIGRldGVybWluYW50IHVzaW5nIHRoZSBMVSBkZWNvbXBvc2l0aW9uXG4gICAgICByZXR1cm4gbmV3IEx1RGVjb21wb3NpdGlvbihtYXRyaXgpLmRldGVybWluYW50O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcignZGV0ZXJtaW5hbnQgY2FuIG9ubHkgYmUgY2FsY3VsYXRlZCBmb3IgYSBzcXVhcmUgbWF0cml4Jyk7XG4gIH1cbn1cbiIsImV4cG9ydCB7IEFic3RyYWN0TWF0cml4LCBkZWZhdWx0LCBkZWZhdWx0IGFzIE1hdHJpeCB9IGZyb20gJy4vbWF0cml4JztcbmV4cG9ydCAqIGZyb20gJy4vdmlld3MvaW5kZXgnO1xuXG5leHBvcnQgeyB3cmFwIH0gZnJvbSAnLi93cmFwL3dyYXAnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBXcmFwcGVyTWF0cml4MUQgfSBmcm9tICcuL3dyYXAvV3JhcHBlck1hdHJpeDFEJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgV3JhcHBlck1hdHJpeDJEIH0gZnJvbSAnLi93cmFwL1dyYXBwZXJNYXRyaXgyRCc7XG5cbmV4cG9ydCB7IHNvbHZlLCBpbnZlcnNlIH0gZnJvbSAnLi9kZWNvbXBvc2l0aW9ucyc7XG5leHBvcnQgeyBkZXRlcm1pbmFudCB9IGZyb20gJy4vZGV0ZXJtaW5hbnQnO1xuZXhwb3J0IHsgbGluZWFyRGVwZW5kZW5jaWVzIH0gZnJvbSAnLi9saW5lYXJEZXBlbmRlbmNpZXMnO1xuZXhwb3J0IHsgcHNldWRvSW52ZXJzZSB9IGZyb20gJy4vcHNldWRvSW52ZXJzZSc7XG5leHBvcnQgeyBjb3ZhcmlhbmNlIH0gZnJvbSAnLi9jb3ZhcmlhbmNlJztcbmV4cG9ydCB7IGNvcnJlbGF0aW9uIH0gZnJvbSAnLi9jb3JyZWxhdGlvbic7XG5cbmV4cG9ydCB7XG4gIGRlZmF1bHQgYXMgU2luZ3VsYXJWYWx1ZURlY29tcG9zaXRpb24sXG4gIGRlZmF1bHQgYXMgU1ZELFxufSBmcm9tICcuL2RjL3N2ZC5qcyc7XG5leHBvcnQge1xuICBkZWZhdWx0IGFzIEVpZ2VudmFsdWVEZWNvbXBvc2l0aW9uLFxuICBkZWZhdWx0IGFzIEVWRCxcbn0gZnJvbSAnLi9kYy9ldmQuanMnO1xuZXhwb3J0IHtcbiAgZGVmYXVsdCBhcyBDaG9sZXNreURlY29tcG9zaXRpb24sXG4gIGRlZmF1bHQgYXMgQ0hPLFxufSBmcm9tICcuL2RjL2Nob2xlc2t5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTHVEZWNvbXBvc2l0aW9uLCBkZWZhdWx0IGFzIExVIH0gZnJvbSAnLi9kYy9sdS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFFyRGVjb21wb3NpdGlvbiwgZGVmYXVsdCBhcyBRUiB9IGZyb20gJy4vZGMvcXIuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOaXBhbHMsIGRlZmF1bHQgYXMgTklQQUxTIH0gZnJvbSAnLi9kYy9uaXBhbHMuanMnO1xuIiwiY29uc3QgaW5kZW50ID0gJyAnLnJlcGVhdCgyKTtcbmNvbnN0IGluZGVudERhdGEgPSAnICcucmVwZWF0KDQpO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdE1hdHJpeCgpIHtcbiAgcmV0dXJuIGluc3BlY3RNYXRyaXhXaXRoT3B0aW9ucyh0aGlzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3BlY3RNYXRyaXhXaXRoT3B0aW9ucyhtYXRyaXgsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB7IG1heFJvd3MgPSAxNSwgbWF4Q29sdW1ucyA9IDEwLCBtYXhOdW1TaXplID0gOCB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIGAke21hdHJpeC5jb25zdHJ1Y3Rvci5uYW1lfSB7XG4ke2luZGVudH1bXG4ke2luZGVudERhdGF9JHtpbnNwZWN0RGF0YShtYXRyaXgsIG1heFJvd3MsIG1heENvbHVtbnMsIG1heE51bVNpemUpfVxuJHtpbmRlbnR9XVxuJHtpbmRlbnR9cm93czogJHttYXRyaXgucm93c31cbiR7aW5kZW50fWNvbHVtbnM6ICR7bWF0cml4LmNvbHVtbnN9XG59YDtcbn1cblxuZnVuY3Rpb24gaW5zcGVjdERhdGEobWF0cml4LCBtYXhSb3dzLCBtYXhDb2x1bW5zLCBtYXhOdW1TaXplKSB7XG4gIGNvbnN0IHsgcm93cywgY29sdW1ucyB9ID0gbWF0cml4O1xuICBjb25zdCBtYXhJID0gTWF0aC5taW4ocm93cywgbWF4Um93cyk7XG4gIGNvbnN0IG1heEogPSBNYXRoLm1pbihjb2x1bW5zLCBtYXhDb2x1bW5zKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4STsgaSsrKSB7XG4gICAgbGV0IGxpbmUgPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1heEo7IGorKykge1xuICAgICAgbGluZS5wdXNoKGZvcm1hdE51bWJlcihtYXRyaXguZ2V0KGksIGopLCBtYXhOdW1TaXplKSk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGAke2xpbmUuam9pbignICcpfWApO1xuICB9XG4gIGlmIChtYXhKICE9PSBjb2x1bW5zKSB7XG4gICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSArPSBgIC4uLiAke2NvbHVtbnMgLSBtYXhDb2x1bW5zfSBtb3JlIGNvbHVtbnNgO1xuICB9XG4gIGlmIChtYXhJICE9PSByb3dzKSB7XG4gICAgcmVzdWx0LnB1c2goYC4uLiAke3Jvd3MgLSBtYXhSb3dzfSBtb3JlIHJvd3NgKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oYFxcbiR7aW5kZW50RGF0YX1gKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TnVtYmVyKG51bSwgbWF4TnVtU2l6ZSkge1xuICBjb25zdCBudW1TdHIgPSBTdHJpbmcobnVtKTtcbiAgaWYgKG51bVN0ci5sZW5ndGggPD0gbWF4TnVtU2l6ZSkge1xuICAgIHJldHVybiBudW1TdHIucGFkRW5kKG1heE51bVNpemUsICcgJyk7XG4gIH1cbiAgY29uc3QgcHJlY2lzZSA9IG51bS50b1ByZWNpc2lvbihtYXhOdW1TaXplIC0gMik7XG4gIGlmIChwcmVjaXNlLmxlbmd0aCA8PSBtYXhOdW1TaXplKSB7XG4gICAgcmV0dXJuIHByZWNpc2U7XG4gIH1cbiAgY29uc3QgZXhwb25lbnRpYWwgPSBudW0udG9FeHBvbmVudGlhbChtYXhOdW1TaXplIC0gMik7XG4gIGNvbnN0IGVJbmRleCA9IGV4cG9uZW50aWFsLmluZGV4T2YoJ2UnKTtcbiAgY29uc3QgZSA9IGV4cG9uZW50aWFsLnNsaWNlKGVJbmRleCk7XG4gIHJldHVybiBleHBvbmVudGlhbC5zbGljZSgwLCBtYXhOdW1TaXplIC0gZS5sZW5ndGgpICsgZTtcbn1cbiIsImltcG9ydCBTaW5ndWxhclZhbHVlRGVjb21wb3NpdGlvbiBmcm9tICcuL2RjL3N2ZCc7XG5pbXBvcnQgTWF0cml4IGZyb20gJy4vbWF0cml4JztcblxuZnVuY3Rpb24geHJhbmdlKG4sIGV4Y2VwdGlvbikge1xuICBsZXQgcmFuZ2UgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICBpZiAoaSAhPT0gZXhjZXB0aW9uKSB7XG4gICAgICByYW5nZS5wdXNoKGkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGRlcGVuZGVuY2llc09uZVJvdyhcbiAgZXJyb3IsXG4gIG1hdHJpeCxcbiAgaW5kZXgsXG4gIHRocmVzaG9sZFZhbHVlID0gMTBlLTEwLFxuICB0aHJlc2hvbGRFcnJvciA9IDEwZS0xMCxcbikge1xuICBpZiAoZXJyb3IgPiB0aHJlc2hvbGRFcnJvcikge1xuICAgIHJldHVybiBuZXcgQXJyYXkobWF0cml4LnJvd3MgKyAxKS5maWxsKDApO1xuICB9IGVsc2Uge1xuICAgIGxldCByZXR1cm5BcnJheSA9IG1hdHJpeC5hZGRSb3coaW5kZXgsIFswXSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXR1cm5BcnJheS5yb3dzOyBpKyspIHtcbiAgICAgIGlmIChNYXRoLmFicyhyZXR1cm5BcnJheS5nZXQoaSwgMCkpIDwgdGhyZXNob2xkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuQXJyYXkuc2V0KGksIDAsIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuQXJyYXkudG8xREFycmF5KCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpbmVhckRlcGVuZGVuY2llcyhtYXRyaXgsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB7IHRocmVzaG9sZFZhbHVlID0gMTBlLTEwLCB0aHJlc2hvbGRFcnJvciA9IDEwZS0xMCB9ID0gb3B0aW9ucztcbiAgbWF0cml4ID0gTWF0cml4LmNoZWNrTWF0cml4KG1hdHJpeCk7XG5cbiAgbGV0IG4gPSBtYXRyaXgucm93cztcbiAgbGV0IHJlc3VsdHMgPSBuZXcgTWF0cml4KG4sIG4pO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgbGV0IGIgPSBNYXRyaXguY29sdW1uVmVjdG9yKG1hdHJpeC5nZXRSb3coaSkpO1xuICAgIGxldCBBYmlzID0gbWF0cml4LnN1Yk1hdHJpeFJvdyh4cmFuZ2UobiwgaSkpLnRyYW5zcG9zZSgpO1xuICAgIGxldCBzdmQgPSBuZXcgU2luZ3VsYXJWYWx1ZURlY29tcG9zaXRpb24oQWJpcyk7XG4gICAgbGV0IHggPSBzdmQuc29sdmUoYik7XG4gICAgbGV0IGVycm9yID0gTWF0cml4LnN1YihiLCBBYmlzLm1tdWwoeCkpLmFicygpLm1heCgpO1xuICAgIHJlc3VsdHMuc2V0Um93KFxuICAgICAgaSxcbiAgICAgIGRlcGVuZGVuY2llc09uZVJvdyhlcnJvciwgeCwgaSwgdGhyZXNob2xkVmFsdWUsIHRocmVzaG9sZEVycm9yKSxcbiAgICApO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxNYXRoT3BlcmF0aW9ucyhBYnN0cmFjdE1hdHJpeCwgTWF0cml4KSB7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMuYWRkUyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYWRkTSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmFkZFMgPSBmdW5jdGlvbiBhZGRTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSArIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmFkZE0gPSBmdW5jdGlvbiBhZGRNKG1hdHJpeCkge1xuICAgIG1hdHJpeCA9IE1hdHJpeC5jaGVja01hdHJpeChtYXRyaXgpO1xuICAgIGlmICh0aGlzLnJvd3MgIT09IG1hdHJpeC5yb3dzIHx8XG4gICAgICB0aGlzLmNvbHVtbnMgIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTWF0cmljZXMgZGltZW5zaW9ucyBtdXN0IGJlIGVxdWFsJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgKyBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguYWRkID0gZnVuY3Rpb24gYWRkKG1hdHJpeCwgdmFsdWUpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5hZGQodmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiBzdWIodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMuc3ViUyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuc3ViTSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnN1YlMgPSBmdW5jdGlvbiBzdWJTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAtIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnN1Yk0gPSBmdW5jdGlvbiBzdWJNKG1hdHJpeCkge1xuICAgIG1hdHJpeCA9IE1hdHJpeC5jaGVja01hdHJpeChtYXRyaXgpO1xuICAgIGlmICh0aGlzLnJvd3MgIT09IG1hdHJpeC5yb3dzIHx8XG4gICAgICB0aGlzLmNvbHVtbnMgIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTWF0cmljZXMgZGltZW5zaW9ucyBtdXN0IGJlIGVxdWFsJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgLSBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguc3ViID0gZnVuY3Rpb24gc3ViKG1hdHJpeCwgdmFsdWUpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5zdWIodmFsdWUpO1xuICB9O1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuc3VidHJhY3QgPSBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuc3ViO1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuc3VidHJhY3RTID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnN1YlM7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5zdWJ0cmFjdE0gPSBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuc3ViTTtcbiAgQWJzdHJhY3RNYXRyaXguc3VidHJhY3QgPSBBYnN0cmFjdE1hdHJpeC5zdWI7XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bCh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSByZXR1cm4gdGhpcy5tdWxTKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5tdWxNKHZhbHVlKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubXVsUyA9IGZ1bmN0aW9uIG11bFModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopICogdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubXVsTSA9IGZ1bmN0aW9uIG11bE0obWF0cml4KSB7XG4gICAgbWF0cml4ID0gTWF0cml4LmNoZWNrTWF0cml4KG1hdHJpeCk7XG4gICAgaWYgKHRoaXMucm93cyAhPT0gbWF0cml4LnJvd3MgfHxcbiAgICAgIHRoaXMuY29sdW1ucyAhPT0gbWF0cml4LmNvbHVtbnMpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdNYXRyaWNlcyBkaW1lbnNpb25zIG11c3QgYmUgZXF1YWwnKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAqIG1hdHJpeC5nZXQoaSwgaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5tdWwgPSBmdW5jdGlvbiBtdWwobWF0cml4LCB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4Lm11bCh2YWx1ZSk7XG4gIH07XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tdWx0aXBseSA9IEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tdWw7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tdWx0aXBseVMgPSBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubXVsUztcbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm11bHRpcGx5TSA9IEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tdWxNO1xuICBBYnN0cmFjdE1hdHJpeC5tdWx0aXBseSA9IEFic3RyYWN0TWF0cml4Lm11bDtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24gZGl2KHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHJldHVybiB0aGlzLmRpdlModmFsdWUpO1xuICAgIHJldHVybiB0aGlzLmRpdk0odmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaXZTID0gZnVuY3Rpb24gZGl2Uyh2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgLyB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaXZNID0gZnVuY3Rpb24gZGl2TShtYXRyaXgpIHtcbiAgICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAodGhpcy5yb3dzICE9PSBtYXRyaXgucm93cyB8fFxuICAgICAgdGhpcy5jb2x1bW5zICE9PSBtYXRyaXguY29sdW1ucykge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ01hdHJpY2VzIGRpbWVuc2lvbnMgbXVzdCBiZSBlcXVhbCcpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopIC8gbWF0cml4LmdldChpLCBqKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmRpdiA9IGZ1bmN0aW9uIGRpdihtYXRyaXgsIHZhbHVlKSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXguZGl2KHZhbHVlKTtcbiAgfTtcbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmRpdmlkZSA9IEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaXY7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaXZpZGVTID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmRpdlM7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaXZpZGVNID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmRpdk07XG4gIEFic3RyYWN0TWF0cml4LmRpdmlkZSA9IEFic3RyYWN0TWF0cml4LmRpdjtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubW9kID0gZnVuY3Rpb24gbW9kKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHJldHVybiB0aGlzLm1vZFModmFsdWUpO1xuICAgIHJldHVybiB0aGlzLm1vZE0odmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tb2RTID0gZnVuY3Rpb24gbW9kUyh2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgJSB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5tb2RNID0gZnVuY3Rpb24gbW9kTShtYXRyaXgpIHtcbiAgICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAodGhpcy5yb3dzICE9PSBtYXRyaXgucm93cyB8fFxuICAgICAgdGhpcy5jb2x1bW5zICE9PSBtYXRyaXguY29sdW1ucykge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ01hdHJpY2VzIGRpbWVuc2lvbnMgbXVzdCBiZSBlcXVhbCcpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopICUgbWF0cml4LmdldChpLCBqKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4Lm1vZCA9IGZ1bmN0aW9uIG1vZChtYXRyaXgsIHZhbHVlKSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgubW9kKHZhbHVlKTtcbiAgfTtcbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm1vZHVsdXMgPSBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubW9kO1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubW9kdWx1c1MgPSBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubW9kUztcbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm1vZHVsdXNNID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm1vZE07XG4gIEFic3RyYWN0TWF0cml4Lm1vZHVsdXMgPSBBYnN0cmFjdE1hdHJpeC5tb2Q7XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmFuZCA9IGZ1bmN0aW9uIGFuZCh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSByZXR1cm4gdGhpcy5hbmRTKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5hbmRNKHZhbHVlKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuYW5kUyA9IGZ1bmN0aW9uIGFuZFModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopICYgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuYW5kTSA9IGZ1bmN0aW9uIGFuZE0obWF0cml4KSB7XG4gICAgbWF0cml4ID0gTWF0cml4LmNoZWNrTWF0cml4KG1hdHJpeCk7XG4gICAgaWYgKHRoaXMucm93cyAhPT0gbWF0cml4LnJvd3MgfHxcbiAgICAgIHRoaXMuY29sdW1ucyAhPT0gbWF0cml4LmNvbHVtbnMpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdNYXRyaWNlcyBkaW1lbnNpb25zIG11c3QgYmUgZXF1YWwnKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAmIG1hdHJpeC5nZXQoaSwgaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5hbmQgPSBmdW5jdGlvbiBhbmQobWF0cml4LCB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmFuZCh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm9yID0gZnVuY3Rpb24gb3IodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMub3JTKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5vck0odmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5vclMgPSBmdW5jdGlvbiBvclModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopIHwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUub3JNID0gZnVuY3Rpb24gb3JNKG1hdHJpeCkge1xuICAgIG1hdHJpeCA9IE1hdHJpeC5jaGVja01hdHJpeChtYXRyaXgpO1xuICAgIGlmICh0aGlzLnJvd3MgIT09IG1hdHJpeC5yb3dzIHx8XG4gICAgICB0aGlzLmNvbHVtbnMgIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTWF0cmljZXMgZGltZW5zaW9ucyBtdXN0IGJlIGVxdWFsJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgfCBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgub3IgPSBmdW5jdGlvbiBvcihtYXRyaXgsIHZhbHVlKSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgub3IodmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS54b3IgPSBmdW5jdGlvbiB4b3IodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMueG9yUyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMueG9yTSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnhvclMgPSBmdW5jdGlvbiB4b3JTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSBeIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnhvck0gPSBmdW5jdGlvbiB4b3JNKG1hdHJpeCkge1xuICAgIG1hdHJpeCA9IE1hdHJpeC5jaGVja01hdHJpeChtYXRyaXgpO1xuICAgIGlmICh0aGlzLnJvd3MgIT09IG1hdHJpeC5yb3dzIHx8XG4gICAgICB0aGlzLmNvbHVtbnMgIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTWF0cmljZXMgZGltZW5zaW9ucyBtdXN0IGJlIGVxdWFsJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgdGhpcy5nZXQoaSwgaikgXiBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgueG9yID0gZnVuY3Rpb24geG9yKG1hdHJpeCwgdmFsdWUpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC54b3IodmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5sZWZ0U2hpZnQgPSBmdW5jdGlvbiBsZWZ0U2hpZnQodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMubGVmdFNoaWZ0Uyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMubGVmdFNoaWZ0TSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmxlZnRTaGlmdFMgPSBmdW5jdGlvbiBsZWZ0U2hpZnRTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSA8PCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5sZWZ0U2hpZnRNID0gZnVuY3Rpb24gbGVmdFNoaWZ0TShtYXRyaXgpIHtcbiAgICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAodGhpcy5yb3dzICE9PSBtYXRyaXgucm93cyB8fFxuICAgICAgdGhpcy5jb2x1bW5zICE9PSBtYXRyaXguY29sdW1ucykge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ01hdHJpY2VzIGRpbWVuc2lvbnMgbXVzdCBiZSBlcXVhbCcpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopIDw8IG1hdHJpeC5nZXQoaSwgaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5sZWZ0U2hpZnQgPSBmdW5jdGlvbiBsZWZ0U2hpZnQobWF0cml4LCB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmxlZnRTaGlmdCh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnQgPSBmdW5jdGlvbiBzaWduUHJvcGFnYXRpbmdSaWdodFNoaWZ0KHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHJldHVybiB0aGlzLnNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnRTKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5zaWduUHJvcGFnYXRpbmdSaWdodFNoaWZ0TSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnRTID0gZnVuY3Rpb24gc2lnblByb3BhZ2F0aW5nUmlnaHRTaGlmdFModmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopID4+IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnRNID0gZnVuY3Rpb24gc2lnblByb3BhZ2F0aW5nUmlnaHRTaGlmdE0obWF0cml4KSB7XG4gICAgbWF0cml4ID0gTWF0cml4LmNoZWNrTWF0cml4KG1hdHJpeCk7XG4gICAgaWYgKHRoaXMucm93cyAhPT0gbWF0cml4LnJvd3MgfHxcbiAgICAgIHRoaXMuY29sdW1ucyAhPT0gbWF0cml4LmNvbHVtbnMpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdNYXRyaWNlcyBkaW1lbnNpb25zIG11c3QgYmUgZXF1YWwnKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSA+PiBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguc2lnblByb3BhZ2F0aW5nUmlnaHRTaGlmdCA9IGZ1bmN0aW9uIHNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnQobWF0cml4LCB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnNpZ25Qcm9wYWdhdGluZ1JpZ2h0U2hpZnQodmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5yaWdodFNoaWZ0ID0gZnVuY3Rpb24gcmlnaHRTaGlmdCh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSByZXR1cm4gdGhpcy5yaWdodFNoaWZ0Uyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMucmlnaHRTaGlmdE0odmFsdWUpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5yaWdodFNoaWZ0UyA9IGZ1bmN0aW9uIHJpZ2h0U2hpZnRTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSA+Pj4gdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUucmlnaHRTaGlmdE0gPSBmdW5jdGlvbiByaWdodFNoaWZ0TShtYXRyaXgpIHtcbiAgICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAodGhpcy5yb3dzICE9PSBtYXRyaXgucm93cyB8fFxuICAgICAgdGhpcy5jb2x1bW5zICE9PSBtYXRyaXguY29sdW1ucykge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ01hdHJpY2VzIGRpbWVuc2lvbnMgbXVzdCBiZSBlcXVhbCcpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIHRoaXMuZ2V0KGksIGopID4+PiBtYXRyaXguZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucmlnaHRTaGlmdCA9IGZ1bmN0aW9uIHJpZ2h0U2hpZnQobWF0cml4LCB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnJpZ2h0U2hpZnQodmFsdWUpO1xuICB9O1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuemVyb0ZpbGxSaWdodFNoaWZ0ID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnJpZ2h0U2hpZnQ7XG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS56ZXJvRmlsbFJpZ2h0U2hpZnRTID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnJpZ2h0U2hpZnRTO1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuemVyb0ZpbGxSaWdodFNoaWZ0TSA9IEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5yaWdodFNoaWZ0TTtcbiAgQWJzdHJhY3RNYXRyaXguemVyb0ZpbGxSaWdodFNoaWZ0ID0gQWJzdHJhY3RNYXRyaXgucmlnaHRTaGlmdDtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubm90ID0gZnVuY3Rpb24gbm90KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgfih0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5ub3QgPSBmdW5jdGlvbiBub3QobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgubm90KCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmFicyA9IGZ1bmN0aW9uIGFicygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguYWJzKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmFicyA9IGZ1bmN0aW9uIGFicyhtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5hYnMoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuYWNvcyA9IGZ1bmN0aW9uIGFjb3MoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmFjb3ModGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguYWNvcyA9IGZ1bmN0aW9uIGFjb3MobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXguYWNvcygpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5hY29zaCA9IGZ1bmN0aW9uIGFjb3NoKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5hY29zaCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5hY29zaCA9IGZ1bmN0aW9uIGFjb3NoKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmFjb3NoKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmFzaW4gPSBmdW5jdGlvbiBhc2luKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5hc2luKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmFzaW4gPSBmdW5jdGlvbiBhc2luKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmFzaW4oKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuYXNpbmggPSBmdW5jdGlvbiBhc2luaCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguYXNpbmgodGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguYXNpbmggPSBmdW5jdGlvbiBhc2luaChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5hc2luaCgpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5hdGFuID0gZnVuY3Rpb24gYXRhbigpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguYXRhbih0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5hdGFuID0gZnVuY3Rpb24gYXRhbihtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5hdGFuKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmF0YW5oID0gZnVuY3Rpb24gYXRhbmgoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmF0YW5oKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmF0YW5oID0gZnVuY3Rpb24gYXRhbmgobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXguYXRhbmgoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuY2JydCA9IGZ1bmN0aW9uIGNicnQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmNicnQodGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguY2JydCA9IGZ1bmN0aW9uIGNicnQobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXguY2JydCgpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5jZWlsID0gZnVuY3Rpb24gY2VpbCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguY2VpbCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5jZWlsID0gZnVuY3Rpb24gY2VpbChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5jZWlsKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmNsejMyID0gZnVuY3Rpb24gY2x6MzIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmNsejMyKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmNsejMyID0gZnVuY3Rpb24gY2x6MzIobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXguY2x6MzIoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuY29zID0gZnVuY3Rpb24gY29zKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5jb3ModGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguY29zID0gZnVuY3Rpb24gY29zKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmNvcygpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5jb3NoID0gZnVuY3Rpb24gY29zaCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguY29zaCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5jb3NoID0gZnVuY3Rpb24gY29zaChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5jb3NoKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmV4cCA9IGZ1bmN0aW9uIGV4cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguZXhwKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmV4cCA9IGZ1bmN0aW9uIGV4cChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5leHAoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuZXhwbTEgPSBmdW5jdGlvbiBleHBtMSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguZXhwbTEodGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguZXhwbTEgPSBmdW5jdGlvbiBleHBtMShtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5leHBtMSgpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5mbG9vciA9IGZ1bmN0aW9uIGZsb29yKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5mbG9vcih0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5mbG9vciA9IGZ1bmN0aW9uIGZsb29yKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmZsb29yKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmZyb3VuZCA9IGZ1bmN0aW9uIGZyb3VuZCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguZnJvdW5kKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmZyb3VuZCA9IGZ1bmN0aW9uIGZyb3VuZChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5mcm91bmQoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gbG9nKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5sb2codGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgubG9nID0gZnVuY3Rpb24gbG9nKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmxvZygpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5sb2cxcCA9IGZ1bmN0aW9uIGxvZzFwKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5sb2cxcCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5sb2cxcCA9IGZ1bmN0aW9uIGxvZzFwKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LmxvZzFwKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmxvZzEwID0gZnVuY3Rpb24gbG9nMTAoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmxvZzEwKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LmxvZzEwID0gZnVuY3Rpb24gbG9nMTAobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgubG9nMTAoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubG9nMiA9IGZ1bmN0aW9uIGxvZzIoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLmxvZzIodGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgubG9nMiA9IGZ1bmN0aW9uIGxvZzIobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgubG9nMigpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5yb3VuZCA9IGZ1bmN0aW9uIHJvdW5kKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5yb3VuZCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5yb3VuZCA9IGZ1bmN0aW9uIHJvdW5kKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnJvdW5kKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiBzaWduKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5zaWduKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnNpZ24gPSBmdW5jdGlvbiBzaWduKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnNpZ24oKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUuc2luID0gZnVuY3Rpb24gc2luKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5zaW4odGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXguc2luID0gZnVuY3Rpb24gc2luKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnNpbigpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5zaW5oID0gZnVuY3Rpb24gc2luaCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGguc2luaCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5zaW5oID0gZnVuY3Rpb24gc2luaChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC5zaW5oKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnNxcnQgPSBmdW5jdGlvbiBzcXJ0KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5zcXJ0KHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnNxcnQgPSBmdW5jdGlvbiBzcXJ0KG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnNxcnQoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUudGFuID0gZnVuY3Rpb24gdGFuKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC50YW4odGhpcy5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgudGFuID0gZnVuY3Rpb24gdGFuKG1hdHJpeCkge1xuICAgIGNvbnN0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICByZXR1cm4gbmV3TWF0cml4LnRhbigpO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS50YW5oID0gZnVuY3Rpb24gdGFuaCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIE1hdGgudGFuaCh0aGlzLmdldChpLCBqKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC50YW5oID0gZnVuY3Rpb24gdGFuaChtYXRyaXgpIHtcbiAgICBjb25zdCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgcmV0dXJuIG5ld01hdHJpeC50YW5oKCk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnRydW5jID0gZnVuY3Rpb24gdHJ1bmMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLnRydW5jKHRoaXMuZ2V0KGksIGopKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnRydW5jID0gZnVuY3Rpb24gdHJ1bmMobWF0cml4KSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgudHJ1bmMoKTtcbiAgfTtcblxuICBBYnN0cmFjdE1hdHJpeC5wb3cgPSBmdW5jdGlvbiBwb3cobWF0cml4LCBhcmcwKSB7XG4gICAgY29uc3QgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgIHJldHVybiBuZXdNYXRyaXgucG93KGFyZzApO1xuICB9O1xuXG4gIEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5wb3cgPSBmdW5jdGlvbiBwb3codmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgcmV0dXJuIHRoaXMucG93Uyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMucG93TSh2YWx1ZSk7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnBvd1MgPSBmdW5jdGlvbiBwb3dTKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCBNYXRoLnBvdyh0aGlzLmdldChpLCBqKSwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLnBvd00gPSBmdW5jdGlvbiBwb3dNKG1hdHJpeCkge1xuICAgIG1hdHJpeCA9IE1hdHJpeC5jaGVja01hdHJpeChtYXRyaXgpO1xuICAgIGlmICh0aGlzLnJvd3MgIT09IG1hdHJpeC5yb3dzIHx8XG4gICAgICB0aGlzLmNvbHVtbnMgIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTWF0cmljZXMgZGltZW5zaW9ucyBtdXN0IGJlIGVxdWFsJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgTWF0aC5wb3codGhpcy5nZXQoaSwgaiksIG1hdHJpeC5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG4iLCJpbXBvcnQgcmVzY2FsZSBmcm9tICdtbC1hcnJheS1yZXNjYWxlJztcblxuaW1wb3J0IHsgaW5zcGVjdE1hdHJpeCwgaW5zcGVjdE1hdHJpeFdpdGhPcHRpb25zIH0gZnJvbSAnLi9pbnNwZWN0JztcbmltcG9ydCB7IGluc3RhbGxNYXRoT3BlcmF0aW9ucyB9IGZyb20gJy4vbWF0aE9wZXJhdGlvbnMnO1xuaW1wb3J0IHtcbiAgc3VtQnlSb3csXG4gIHN1bUJ5Q29sdW1uLFxuICBzdW1BbGwsXG4gIHByb2R1Y3RCeVJvdyxcbiAgcHJvZHVjdEJ5Q29sdW1uLFxuICBwcm9kdWN0QWxsLFxuICB2YXJpYW5jZUJ5Um93LFxuICB2YXJpYW5jZUJ5Q29sdW1uLFxuICB2YXJpYW5jZUFsbCxcbiAgY2VudGVyQnlSb3csXG4gIGNlbnRlckJ5Q29sdW1uLFxuICBjZW50ZXJBbGwsXG4gIHNjYWxlQnlSb3csXG4gIHNjYWxlQnlDb2x1bW4sXG4gIHNjYWxlQWxsLFxuICBnZXRTY2FsZUJ5Um93LFxuICBnZXRTY2FsZUJ5Q29sdW1uLFxuICBnZXRTY2FsZUFsbCxcbn0gZnJvbSAnLi9zdGF0JztcbmltcG9ydCB7XG4gIGNoZWNrUm93VmVjdG9yLFxuICBjaGVja1Jvd0luZGV4LFxuICBjaGVja0NvbHVtbkluZGV4LFxuICBjaGVja0NvbHVtblZlY3RvcixcbiAgY2hlY2tSYW5nZSxcbiAgY2hlY2tJbmRpY2VzLFxuICBjaGVja05vbkVtcHR5LFxufSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RNYXRyaXgge1xuICBzdGF0aWMgZnJvbTFEQXJyYXkobmV3Um93cywgbmV3Q29sdW1ucywgbmV3RGF0YSkge1xuICAgIGxldCBsZW5ndGggPSBuZXdSb3dzICogbmV3Q29sdW1ucztcbiAgICBpZiAobGVuZ3RoICE9PSBuZXdEYXRhLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2RhdGEgbGVuZ3RoIGRvZXMgbm90IG1hdGNoIGdpdmVuIGRpbWVuc2lvbnMnKTtcbiAgICB9XG4gICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgobmV3Um93cywgbmV3Q29sdW1ucyk7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbmV3Um93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IG5ld0NvbHVtbnM7IGNvbHVtbisrKSB7XG4gICAgICAgIG5ld01hdHJpeC5zZXQocm93LCBjb2x1bW4sIG5ld0RhdGFbcm93ICogbmV3Q29sdW1ucyArIGNvbHVtbl0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3TWF0cml4O1xuICB9XG5cbiAgc3RhdGljIHJvd1ZlY3RvcihuZXdEYXRhKSB7XG4gICAgbGV0IHZlY3RvciA9IG5ldyBNYXRyaXgoMSwgbmV3RGF0YS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmVjdG9yLnNldCgwLCBpLCBuZXdEYXRhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHZlY3RvcjtcbiAgfVxuXG4gIHN0YXRpYyBjb2x1bW5WZWN0b3IobmV3RGF0YSkge1xuICAgIGxldCB2ZWN0b3IgPSBuZXcgTWF0cml4KG5ld0RhdGEubGVuZ3RoLCAxKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZlY3Rvci5zZXQoaSwgMCwgbmV3RGF0YVtpXSk7XG4gICAgfVxuICAgIHJldHVybiB2ZWN0b3I7XG4gIH1cblxuICBzdGF0aWMgemVyb3Mocm93cywgY29sdW1ucykge1xuICAgIHJldHVybiBuZXcgTWF0cml4KHJvd3MsIGNvbHVtbnMpO1xuICB9XG5cbiAgc3RhdGljIG9uZXMocm93cywgY29sdW1ucykge1xuICAgIHJldHVybiBuZXcgTWF0cml4KHJvd3MsIGNvbHVtbnMpLmZpbGwoMSk7XG4gIH1cblxuICBzdGF0aWMgcmFuZChyb3dzLCBjb2x1bW5zLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgfVxuICAgIGNvbnN0IHsgcmFuZG9tID0gTWF0aC5yYW5kb20gfSA9IG9wdGlvbnM7XG4gICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXgocm93cywgY29sdW1ucyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgIG1hdHJpeC5zZXQoaSwgaiwgcmFuZG9tKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWF0cml4O1xuICB9XG5cbiAgc3RhdGljIHJhbmRJbnQocm93cywgY29sdW1ucywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICBjb25zdCB7IG1pbiA9IDAsIG1heCA9IDEwMDAsIHJhbmRvbSA9IE1hdGgucmFuZG9tIH0gPSBvcHRpb25zO1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihtaW4pKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtaW4gbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG1heCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBpZiAobWluID49IG1heCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ21pbiBtdXN0IGJlIHNtYWxsZXIgdGhhbiBtYXgnKTtcbiAgICBsZXQgaW50ZXJ2YWwgPSBtYXggLSBtaW47XG4gICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXgocm93cywgY29sdW1ucyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG1pbiArIE1hdGgucm91bmQocmFuZG9tKCkgKiBpbnRlcnZhbCk7XG4gICAgICAgIG1hdHJpeC5zZXQoaSwgaiwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWF0cml4O1xuICB9XG5cbiAgc3RhdGljIGV5ZShyb3dzLCBjb2x1bW5zLCB2YWx1ZSkge1xuICAgIGlmIChjb2x1bW5zID09PSB1bmRlZmluZWQpIGNvbHVtbnMgPSByb3dzO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB2YWx1ZSA9IDE7XG4gICAgbGV0IG1pbiA9IE1hdGgubWluKHJvd3MsIGNvbHVtbnMpO1xuICAgIGxldCBtYXRyaXggPSB0aGlzLnplcm9zKHJvd3MsIGNvbHVtbnMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWluOyBpKyspIHtcbiAgICAgIG1hdHJpeC5zZXQoaSwgaSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbWF0cml4O1xuICB9XG5cbiAgc3RhdGljIGRpYWcoZGF0YSwgcm93cywgY29sdW1ucykge1xuICAgIGxldCBsID0gZGF0YS5sZW5ndGg7XG4gICAgaWYgKHJvd3MgPT09IHVuZGVmaW5lZCkgcm93cyA9IGw7XG4gICAgaWYgKGNvbHVtbnMgPT09IHVuZGVmaW5lZCkgY29sdW1ucyA9IHJvd3M7XG4gICAgbGV0IG1pbiA9IE1hdGgubWluKGwsIHJvd3MsIGNvbHVtbnMpO1xuICAgIGxldCBtYXRyaXggPSB0aGlzLnplcm9zKHJvd3MsIGNvbHVtbnMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWluOyBpKyspIHtcbiAgICAgIG1hdHJpeC5zZXQoaSwgaSwgZGF0YVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXRyaXg7XG4gIH1cblxuICBzdGF0aWMgbWluKG1hdHJpeDEsIG1hdHJpeDIpIHtcbiAgICBtYXRyaXgxID0gdGhpcy5jaGVja01hdHJpeChtYXRyaXgxKTtcbiAgICBtYXRyaXgyID0gdGhpcy5jaGVja01hdHJpeChtYXRyaXgyKTtcbiAgICBsZXQgcm93cyA9IG1hdHJpeDEucm93cztcbiAgICBsZXQgY29sdW1ucyA9IG1hdHJpeDEuY29sdW1ucztcbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeChyb3dzLCBjb2x1bW5zKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgcmVzdWx0LnNldChpLCBqLCBNYXRoLm1pbihtYXRyaXgxLmdldChpLCBqKSwgbWF0cml4Mi5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHN0YXRpYyBtYXgobWF0cml4MSwgbWF0cml4Mikge1xuICAgIG1hdHJpeDEgPSB0aGlzLmNoZWNrTWF0cml4KG1hdHJpeDEpO1xuICAgIG1hdHJpeDIgPSB0aGlzLmNoZWNrTWF0cml4KG1hdHJpeDIpO1xuICAgIGxldCByb3dzID0gbWF0cml4MS5yb3dzO1xuICAgIGxldCBjb2x1bW5zID0gbWF0cml4MS5jb2x1bW5zO1xuICAgIGxldCByZXN1bHQgPSBuZXcgdGhpcyhyb3dzLCBjb2x1bW5zKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgcmVzdWx0LnNldChpLCBqLCBNYXRoLm1heChtYXRyaXgxLmdldChpLCBqKSwgbWF0cml4Mi5nZXQoaSwgaikpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHN0YXRpYyBjaGVja01hdHJpeCh2YWx1ZSkge1xuICAgIHJldHVybiBBYnN0cmFjdE1hdHJpeC5pc01hdHJpeCh2YWx1ZSkgPyB2YWx1ZSA6IG5ldyBNYXRyaXgodmFsdWUpO1xuICB9XG5cbiAgc3RhdGljIGlzTWF0cml4KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdmFsdWUua2xhc3MgPT09ICdNYXRyaXgnO1xuICB9XG5cbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cyAqIHRoaXMuY29sdW1ucztcbiAgfVxuXG4gIGFwcGx5KGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBpLCBqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0bzFEQXJyYXkoKSB7XG4gICAgbGV0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICBhcnJheS5wdXNoKHRoaXMuZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgdG8yREFycmF5KCkge1xuICAgIGxldCBjb3B5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgY29weS5wdXNoKFtdKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgY29weVtpXS5wdXNoKHRoaXMuZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG8yREFycmF5KCk7XG4gIH1cblxuICBpc1Jvd1ZlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzID09PSAxO1xuICB9XG5cbiAgaXNDb2x1bW5WZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1ucyA9PT0gMTtcbiAgfVxuXG4gIGlzVmVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnJvd3MgPT09IDEgfHwgdGhpcy5jb2x1bW5zID09PSAxO1xuICB9XG5cbiAgaXNTcXVhcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cyA9PT0gdGhpcy5jb2x1bW5zO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzID09PSAwIHx8IHRoaXMuY29sdW1ucyA9PT0gMDtcbiAgfVxuXG4gIGlzU3ltbWV0cmljKCkge1xuICAgIGlmICh0aGlzLmlzU3F1YXJlKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZ2V0KGksIGopICE9PSB0aGlzLmdldChqLCBpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRWNoZWxvbkZvcm0oKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBqID0gMDtcbiAgICBsZXQgcHJldmlvdXNDb2x1bW4gPSAtMTtcbiAgICBsZXQgaXNFY2hlbG9uRm9ybSA9IHRydWU7XG4gICAgbGV0IGNoZWNrZWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoaSA8IHRoaXMucm93cyAmJiBpc0VjaGVsb25Gb3JtKSB7XG4gICAgICBqID0gMDtcbiAgICAgIGNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIHdoaWxlIChqIDwgdGhpcy5jb2x1bW5zICYmIGNoZWNrZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmdldChpLCBqKSA9PT0gMCkge1xuICAgICAgICAgIGorKztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdldChpLCBqKSA9PT0gMSAmJiBqID4gcHJldmlvdXNDb2x1bW4pIHtcbiAgICAgICAgICBjaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICBwcmV2aW91c0NvbHVtbiA9IGo7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNFY2hlbG9uRm9ybSA9IGZhbHNlO1xuICAgICAgICAgIGNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc0VjaGVsb25Gb3JtO1xuICB9XG5cbiAgaXNSZWR1Y2VkRWNoZWxvbkZvcm0oKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBqID0gMDtcbiAgICBsZXQgcHJldmlvdXNDb2x1bW4gPSAtMTtcbiAgICBsZXQgaXNSZWR1Y2VkRWNoZWxvbkZvcm0gPSB0cnVlO1xuICAgIGxldCBjaGVja2VkID0gZmFsc2U7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnJvd3MgJiYgaXNSZWR1Y2VkRWNoZWxvbkZvcm0pIHtcbiAgICAgIGogPSAwO1xuICAgICAgY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgd2hpbGUgKGogPCB0aGlzLmNvbHVtbnMgJiYgY2hlY2tlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KGksIGopID09PSAwKSB7XG4gICAgICAgICAgaisrO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0KGksIGopID09PSAxICYmIGogPiBwcmV2aW91c0NvbHVtbikge1xuICAgICAgICAgIGNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgIHByZXZpb3VzQ29sdW1uID0gajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc1JlZHVjZWRFY2hlbG9uRm9ybSA9IGZhbHNlO1xuICAgICAgICAgIGNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrID0gaiArIDE7IGsgPCB0aGlzLnJvd3M7IGsrKykge1xuICAgICAgICBpZiAodGhpcy5nZXQoaSwgaykgIT09IDApIHtcbiAgICAgICAgICBpc1JlZHVjZWRFY2hlbG9uRm9ybSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc1JlZHVjZWRFY2hlbG9uRm9ybTtcbiAgfVxuXG4gIGVjaGVsb25Gb3JtKCkge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLmNsb25lKCk7XG4gICAgbGV0IGggPSAwO1xuICAgIGxldCBrID0gMDtcbiAgICB3aGlsZSAoaCA8IHJlc3VsdC5yb3dzICYmIGsgPCByZXN1bHQuY29sdW1ucykge1xuICAgICAgbGV0IGlNYXggPSBoO1xuICAgICAgZm9yIChsZXQgaSA9IGg7IGkgPCByZXN1bHQucm93czsgaSsrKSB7XG4gICAgICAgIGlmIChyZXN1bHQuZ2V0KGksIGspID4gcmVzdWx0LmdldChpTWF4LCBrKSkge1xuICAgICAgICAgIGlNYXggPSBpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0LmdldChpTWF4LCBrKSA9PT0gMCkge1xuICAgICAgICBrKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQuc3dhcFJvd3MoaCwgaU1heCk7XG4gICAgICAgIGxldCB0bXAgPSByZXN1bHQuZ2V0KGgsIGspO1xuICAgICAgICBmb3IgKGxldCBqID0gazsgaiA8IHJlc3VsdC5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgICByZXN1bHQuc2V0KGgsIGosIHJlc3VsdC5nZXQoaCwgaikgLyB0bXApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBoICsgMTsgaSA8IHJlc3VsdC5yb3dzOyBpKyspIHtcbiAgICAgICAgICBsZXQgZmFjdG9yID0gcmVzdWx0LmdldChpLCBrKSAvIHJlc3VsdC5nZXQoaCwgayk7XG4gICAgICAgICAgcmVzdWx0LnNldChpLCBrLCAwKTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gayArIDE7IGogPCByZXN1bHQuY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgICByZXN1bHQuc2V0KGksIGosIHJlc3VsdC5nZXQoaSwgaikgLSByZXN1bHQuZ2V0KGgsIGopICogZmFjdG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaCsrO1xuICAgICAgICBrKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZWR1Y2VkRWNoZWxvbkZvcm0oKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuZWNoZWxvbkZvcm0oKTtcbiAgICBsZXQgbSA9IHJlc3VsdC5jb2x1bW5zO1xuICAgIGxldCBuID0gcmVzdWx0LnJvd3M7XG4gICAgbGV0IGggPSBuIC0gMTtcbiAgICB3aGlsZSAoaCA+PSAwKSB7XG4gICAgICBpZiAocmVzdWx0Lm1heFJvdyhoKSA9PT0gMCkge1xuICAgICAgICBoLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcCA9IDA7XG4gICAgICAgIGxldCBwaXZvdCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAocCA8IG4gJiYgcGl2b3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5nZXQoaCwgcCkgPT09IDEpIHtcbiAgICAgICAgICAgIHBpdm90ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGg7IGkrKykge1xuICAgICAgICAgIGxldCBmYWN0b3IgPSByZXN1bHQuZ2V0KGksIHApO1xuICAgICAgICAgIGZvciAobGV0IGogPSBwOyBqIDwgbTsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdG1wID0gcmVzdWx0LmdldChpLCBqKSAtIGZhY3RvciAqIHJlc3VsdC5nZXQoaCwgaik7XG4gICAgICAgICAgICByZXN1bHQuc2V0KGksIGosIHRtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGgtLTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNldCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldCBtZXRob2QgaXMgdW5pbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0IG1ldGhvZCBpcyB1bmltcGxlbWVudGVkJyk7XG4gIH1cblxuICByZXBlYXQob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICBjb25zdCB7IHJvd3MgPSAxLCBjb2x1bW5zID0gMSB9ID0gb3B0aW9ucztcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocm93cykgfHwgcm93cyA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyb3dzIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyk7XG4gICAgfVxuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihjb2x1bW5zKSB8fCBjb2x1bW5zIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbHVtbnMgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInKTtcbiAgICB9XG4gICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXgodGhpcy5yb3dzICogcm93cywgdGhpcy5jb2x1bW5zICogY29sdW1ucyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgIG1hdHJpeC5zZXRTdWJNYXRyaXgodGhpcywgdGhpcy5yb3dzICogaSwgdGhpcy5jb2x1bW5zICogaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXRyaXg7XG4gIH1cblxuICBmaWxsKHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbmVnKCkge1xuICAgIHJldHVybiB0aGlzLm11bFMoLTEpO1xuICB9XG5cbiAgZ2V0Um93KGluZGV4KSB7XG4gICAgY2hlY2tSb3dJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgbGV0IHJvdyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zOyBpKyspIHtcbiAgICAgIHJvdy5wdXNoKHRoaXMuZ2V0KGluZGV4LCBpKSk7XG4gICAgfVxuICAgIHJldHVybiByb3c7XG4gIH1cblxuICBnZXRSb3dWZWN0b3IoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0cml4LnJvd1ZlY3Rvcih0aGlzLmdldFJvdyhpbmRleCkpO1xuICB9XG5cbiAgc2V0Um93KGluZGV4LCBhcnJheSkge1xuICAgIGNoZWNrUm93SW5kZXgodGhpcywgaW5kZXgpO1xuICAgIGFycmF5ID0gY2hlY2tSb3dWZWN0b3IodGhpcywgYXJyYXkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0KGluZGV4LCBpLCBhcnJheVtpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3dhcFJvd3Mocm93MSwgcm93Mikge1xuICAgIGNoZWNrUm93SW5kZXgodGhpcywgcm93MSk7XG4gICAgY2hlY2tSb3dJbmRleCh0aGlzLCByb3cyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sdW1uczsgaSsrKSB7XG4gICAgICBsZXQgdGVtcCA9IHRoaXMuZ2V0KHJvdzEsIGkpO1xuICAgICAgdGhpcy5zZXQocm93MSwgaSwgdGhpcy5nZXQocm93MiwgaSkpO1xuICAgICAgdGhpcy5zZXQocm93MiwgaSwgdGVtcCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0Q29sdW1uKGluZGV4KSB7XG4gICAgY2hlY2tDb2x1bW5JbmRleCh0aGlzLCBpbmRleCk7XG4gICAgbGV0IGNvbHVtbiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGNvbHVtbi5wdXNoKHRoaXMuZ2V0KGksIGluZGV4KSk7XG4gICAgfVxuICAgIHJldHVybiBjb2x1bW47XG4gIH1cblxuICBnZXRDb2x1bW5WZWN0b3IoaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0cml4LmNvbHVtblZlY3Rvcih0aGlzLmdldENvbHVtbihpbmRleCkpO1xuICB9XG5cbiAgc2V0Q29sdW1uKGluZGV4LCBhcnJheSkge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgaW5kZXgpO1xuICAgIGFycmF5ID0gY2hlY2tDb2x1bW5WZWN0b3IodGhpcywgYXJyYXkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0KGksIGluZGV4LCBhcnJheVtpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3dhcENvbHVtbnMoY29sdW1uMSwgY29sdW1uMikge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgY29sdW1uMSk7XG4gICAgY2hlY2tDb2x1bW5JbmRleCh0aGlzLCBjb2x1bW4yKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBsZXQgdGVtcCA9IHRoaXMuZ2V0KGksIGNvbHVtbjEpO1xuICAgICAgdGhpcy5zZXQoaSwgY29sdW1uMSwgdGhpcy5nZXQoaSwgY29sdW1uMikpO1xuICAgICAgdGhpcy5zZXQoaSwgY29sdW1uMiwgdGVtcCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkUm93VmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrUm93VmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSArIHZlY3RvcltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3ViUm93VmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrUm93VmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAtIHZlY3RvcltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXVsUm93VmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrUm93VmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAqIHZlY3RvcltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGl2Um93VmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrUm93VmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAvIHZlY3RvcltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ29sdW1uVmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrQ29sdW1uVmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSArIHZlY3RvcltpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3ViQ29sdW1uVmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrQ29sdW1uVmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAtIHZlY3RvcltpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXVsQ29sdW1uVmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrQ29sdW1uVmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAqIHZlY3RvcltpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGl2Q29sdW1uVmVjdG9yKHZlY3Rvcikge1xuICAgIHZlY3RvciA9IGNoZWNrQ29sdW1uVmVjdG9yKHRoaXMsIHZlY3Rvcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChpLCBqLCB0aGlzLmdldChpLCBqKSAvIHZlY3RvcltpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXVsUm93KGluZGV4LCB2YWx1ZSkge1xuICAgIGNoZWNrUm93SW5kZXgodGhpcywgaW5kZXgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0KGluZGV4LCBpLCB0aGlzLmdldChpbmRleCwgaSkgKiB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXVsQ29sdW1uKGluZGV4LCB2YWx1ZSkge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgaW5kZXgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0KGksIGluZGV4LCB0aGlzLmdldChpLCBpbmRleCkgKiB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbWF4KCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgbGV0IHYgPSB0aGlzLmdldCgwLCAwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmdldChpLCBqKSA+IHYpIHtcbiAgICAgICAgICB2ID0gdGhpcy5nZXQoaSwgaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBtYXhJbmRleCgpIHtcbiAgICBjaGVja05vbkVtcHR5KHRoaXMpO1xuICAgIGxldCB2ID0gdGhpcy5nZXQoMCwgMCk7XG4gICAgbGV0IGlkeCA9IFswLCAwXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmdldChpLCBqKSA+IHYpIHtcbiAgICAgICAgICB2ID0gdGhpcy5nZXQoaSwgaik7XG4gICAgICAgICAgaWR4WzBdID0gaTtcbiAgICAgICAgICBpZHhbMV0gPSBqO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpZHg7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICBsZXQgdiA9IHRoaXMuZ2V0KDAsIDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KGksIGopIDwgdikge1xuICAgICAgICAgIHYgPSB0aGlzLmdldChpLCBqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIG1pbkluZGV4KCkge1xuICAgIGNoZWNrTm9uRW1wdHkodGhpcyk7XG4gICAgbGV0IHYgPSB0aGlzLmdldCgwLCAwKTtcbiAgICBsZXQgaWR4ID0gWzAsIDBdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KGksIGopIDwgdikge1xuICAgICAgICAgIHYgPSB0aGlzLmdldChpLCBqKTtcbiAgICAgICAgICBpZHhbMF0gPSBpO1xuICAgICAgICAgIGlkeFsxXSA9IGo7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIG1heFJvdyhyb3cpIHtcbiAgICBjaGVja1Jvd0luZGV4KHRoaXMsIHJvdyk7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICBsZXQgdiA9IHRoaXMuZ2V0KHJvdywgMCk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbHVtbnM7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZ2V0KHJvdywgaSkgPiB2KSB7XG4gICAgICAgIHYgPSB0aGlzLmdldChyb3csIGkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIG1heFJvd0luZGV4KHJvdykge1xuICAgIGNoZWNrUm93SW5kZXgodGhpcywgcm93KTtcbiAgICBjaGVja05vbkVtcHR5KHRoaXMpO1xuICAgIGxldCB2ID0gdGhpcy5nZXQocm93LCAwKTtcbiAgICBsZXQgaWR4ID0gW3JvdywgMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbHVtbnM7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZ2V0KHJvdywgaSkgPiB2KSB7XG4gICAgICAgIHYgPSB0aGlzLmdldChyb3csIGkpO1xuICAgICAgICBpZHhbMV0gPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgbWluUm93KHJvdykge1xuICAgIGNoZWNrUm93SW5kZXgodGhpcywgcm93KTtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIGxldCB2ID0gdGhpcy5nZXQocm93LCAwKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuY29sdW1uczsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5nZXQocm93LCBpKSA8IHYpIHtcbiAgICAgICAgdiA9IHRoaXMuZ2V0KHJvdywgaSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2O1xuICB9XG5cbiAgbWluUm93SW5kZXgocm93KSB7XG4gICAgY2hlY2tSb3dJbmRleCh0aGlzLCByb3cpO1xuICAgIGNoZWNrTm9uRW1wdHkodGhpcyk7XG4gICAgbGV0IHYgPSB0aGlzLmdldChyb3csIDApO1xuICAgIGxldCBpZHggPSBbcm93LCAwXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuY29sdW1uczsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5nZXQocm93LCBpKSA8IHYpIHtcbiAgICAgICAgdiA9IHRoaXMuZ2V0KHJvdywgaSk7XG4gICAgICAgIGlkeFsxXSA9IGk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpZHg7XG4gIH1cblxuICBtYXhDb2x1bW4oY29sdW1uKSB7XG4gICAgY2hlY2tDb2x1bW5JbmRleCh0aGlzLCBjb2x1bW4pO1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgbGV0IHYgPSB0aGlzLmdldCgwLCBjb2x1bW4pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmdldChpLCBjb2x1bW4pID4gdikge1xuICAgICAgICB2ID0gdGhpcy5nZXQoaSwgY29sdW1uKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBtYXhDb2x1bW5JbmRleChjb2x1bW4pIHtcbiAgICBjaGVja0NvbHVtbkluZGV4KHRoaXMsIGNvbHVtbik7XG4gICAgY2hlY2tOb25FbXB0eSh0aGlzKTtcbiAgICBsZXQgdiA9IHRoaXMuZ2V0KDAsIGNvbHVtbik7XG4gICAgbGV0IGlkeCA9IFswLCBjb2x1bW5dO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmdldChpLCBjb2x1bW4pID4gdikge1xuICAgICAgICB2ID0gdGhpcy5nZXQoaSwgY29sdW1uKTtcbiAgICAgICAgaWR4WzBdID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlkeDtcbiAgfVxuXG4gIG1pbkNvbHVtbihjb2x1bW4pIHtcbiAgICBjaGVja0NvbHVtbkluZGV4KHRoaXMsIGNvbHVtbik7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICBsZXQgdiA9IHRoaXMuZ2V0KDAsIGNvbHVtbik7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZ2V0KGksIGNvbHVtbikgPCB2KSB7XG4gICAgICAgIHYgPSB0aGlzLmdldChpLCBjb2x1bW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIG1pbkNvbHVtbkluZGV4KGNvbHVtbikge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgY29sdW1uKTtcbiAgICBjaGVja05vbkVtcHR5KHRoaXMpO1xuICAgIGxldCB2ID0gdGhpcy5nZXQoMCwgY29sdW1uKTtcbiAgICBsZXQgaWR4ID0gWzAsIGNvbHVtbl07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgaWYgKHRoaXMuZ2V0KGksIGNvbHVtbikgPCB2KSB7XG4gICAgICAgIHYgPSB0aGlzLmdldChpLCBjb2x1bW4pO1xuICAgICAgICBpZHhbMF0gPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgZGlhZygpIHtcbiAgICBsZXQgbWluID0gTWF0aC5taW4odGhpcy5yb3dzLCB0aGlzLmNvbHVtbnMpO1xuICAgIGxldCBkaWFnID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaW47IGkrKykge1xuICAgICAgZGlhZy5wdXNoKHRoaXMuZ2V0KGksIGkpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpYWc7XG4gIH1cblxuICBub3JtKHR5cGUgPSAnZnJvYmVuaXVzJykge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGlmICh0eXBlID09PSAnbWF4Jykge1xuICAgICAgcmV0dXJuIHRoaXMubWF4KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZnJvYmVuaXVzJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5nZXQoaSwgaikgKiB0aGlzLmdldChpLCBqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguc3FydChyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgdW5rbm93biBub3JtIHR5cGU6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICBjdW11bGF0aXZlU3VtKCkge1xuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgc3VtICs9IHRoaXMuZ2V0KGksIGopO1xuICAgICAgICB0aGlzLnNldChpLCBqLCBzdW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRvdCh2ZWN0b3IyKSB7XG4gICAgaWYgKEFic3RyYWN0TWF0cml4LmlzTWF0cml4KHZlY3RvcjIpKSB2ZWN0b3IyID0gdmVjdG9yMi50bzFEQXJyYXkoKTtcbiAgICBsZXQgdmVjdG9yMSA9IHRoaXMudG8xREFycmF5KCk7XG4gICAgaWYgKHZlY3RvcjEubGVuZ3RoICE9PSB2ZWN0b3IyLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ZlY3RvcnMgZG8gbm90IGhhdmUgdGhlIHNhbWUgc2l6ZScpO1xuICAgIH1cbiAgICBsZXQgZG90ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlY3RvcjEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRvdCArPSB2ZWN0b3IxW2ldICogdmVjdG9yMltpXTtcbiAgICB9XG4gICAgcmV0dXJuIGRvdDtcbiAgfVxuXG4gIG1tdWwob3RoZXIpIHtcbiAgICBvdGhlciA9IE1hdHJpeC5jaGVja01hdHJpeChvdGhlcik7XG5cbiAgICBsZXQgbSA9IHRoaXMucm93cztcbiAgICBsZXQgbiA9IHRoaXMuY29sdW1ucztcbiAgICBsZXQgcCA9IG90aGVyLmNvbHVtbnM7XG5cbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeChtLCBwKTtcblxuICAgIGxldCBCY29saiA9IG5ldyBGbG9hdDY0QXJyYXkobik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwOyBqKyspIHtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbjsgaysrKSB7XG4gICAgICAgIEJjb2xqW2tdID0gb3RoZXIuZ2V0KGssIGopO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG07IGkrKykge1xuICAgICAgICBsZXQgcyA9IDA7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbjsgaysrKSB7XG4gICAgICAgICAgcyArPSB0aGlzLmdldChpLCBrKSAqIEJjb2xqW2tdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnNldChpLCBqLCBzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHN0cmFzc2VuMngyKG90aGVyKSB7XG4gICAgb3RoZXIgPSBNYXRyaXguY2hlY2tNYXRyaXgob3RoZXIpO1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4KDIsIDIpO1xuICAgIGNvbnN0IGExMSA9IHRoaXMuZ2V0KDAsIDApO1xuICAgIGNvbnN0IGIxMSA9IG90aGVyLmdldCgwLCAwKTtcbiAgICBjb25zdCBhMTIgPSB0aGlzLmdldCgwLCAxKTtcbiAgICBjb25zdCBiMTIgPSBvdGhlci5nZXQoMCwgMSk7XG4gICAgY29uc3QgYTIxID0gdGhpcy5nZXQoMSwgMCk7XG4gICAgY29uc3QgYjIxID0gb3RoZXIuZ2V0KDEsIDApO1xuICAgIGNvbnN0IGEyMiA9IHRoaXMuZ2V0KDEsIDEpO1xuICAgIGNvbnN0IGIyMiA9IG90aGVyLmdldCgxLCAxKTtcblxuICAgIC8vIENvbXB1dGUgaW50ZXJtZWRpYXRlIHZhbHVlcy5cbiAgICBjb25zdCBtMSA9IChhMTEgKyBhMjIpICogKGIxMSArIGIyMik7XG4gICAgY29uc3QgbTIgPSAoYTIxICsgYTIyKSAqIGIxMTtcbiAgICBjb25zdCBtMyA9IGExMSAqIChiMTIgLSBiMjIpO1xuICAgIGNvbnN0IG00ID0gYTIyICogKGIyMSAtIGIxMSk7XG4gICAgY29uc3QgbTUgPSAoYTExICsgYTEyKSAqIGIyMjtcbiAgICBjb25zdCBtNiA9IChhMjEgLSBhMTEpICogKGIxMSArIGIxMik7XG4gICAgY29uc3QgbTcgPSAoYTEyIC0gYTIyKSAqIChiMjEgKyBiMjIpO1xuXG4gICAgLy8gQ29tYmluZSBpbnRlcm1lZGlhdGUgdmFsdWVzIGludG8gdGhlIG91dHB1dC5cbiAgICBjb25zdCBjMDAgPSBtMSArIG00IC0gbTUgKyBtNztcbiAgICBjb25zdCBjMDEgPSBtMyArIG01O1xuICAgIGNvbnN0IGMxMCA9IG0yICsgbTQ7XG4gICAgY29uc3QgYzExID0gbTEgLSBtMiArIG0zICsgbTY7XG5cbiAgICByZXN1bHQuc2V0KDAsIDAsIGMwMCk7XG4gICAgcmVzdWx0LnNldCgwLCAxLCBjMDEpO1xuICAgIHJlc3VsdC5zZXQoMSwgMCwgYzEwKTtcbiAgICByZXN1bHQuc2V0KDEsIDEsIGMxMSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHN0cmFzc2VuM3gzKG90aGVyKSB7XG4gICAgb3RoZXIgPSBNYXRyaXguY2hlY2tNYXRyaXgob3RoZXIpO1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWF0cml4KDMsIDMpO1xuXG4gICAgY29uc3QgYTAwID0gdGhpcy5nZXQoMCwgMCk7XG4gICAgY29uc3QgYTAxID0gdGhpcy5nZXQoMCwgMSk7XG4gICAgY29uc3QgYTAyID0gdGhpcy5nZXQoMCwgMik7XG4gICAgY29uc3QgYTEwID0gdGhpcy5nZXQoMSwgMCk7XG4gICAgY29uc3QgYTExID0gdGhpcy5nZXQoMSwgMSk7XG4gICAgY29uc3QgYTEyID0gdGhpcy5nZXQoMSwgMik7XG4gICAgY29uc3QgYTIwID0gdGhpcy5nZXQoMiwgMCk7XG4gICAgY29uc3QgYTIxID0gdGhpcy5nZXQoMiwgMSk7XG4gICAgY29uc3QgYTIyID0gdGhpcy5nZXQoMiwgMik7XG5cbiAgICBjb25zdCBiMDAgPSBvdGhlci5nZXQoMCwgMCk7XG4gICAgY29uc3QgYjAxID0gb3RoZXIuZ2V0KDAsIDEpO1xuICAgIGNvbnN0IGIwMiA9IG90aGVyLmdldCgwLCAyKTtcbiAgICBjb25zdCBiMTAgPSBvdGhlci5nZXQoMSwgMCk7XG4gICAgY29uc3QgYjExID0gb3RoZXIuZ2V0KDEsIDEpO1xuICAgIGNvbnN0IGIxMiA9IG90aGVyLmdldCgxLCAyKTtcbiAgICBjb25zdCBiMjAgPSBvdGhlci5nZXQoMiwgMCk7XG4gICAgY29uc3QgYjIxID0gb3RoZXIuZ2V0KDIsIDEpO1xuICAgIGNvbnN0IGIyMiA9IG90aGVyLmdldCgyLCAyKTtcblxuICAgIGNvbnN0IG0xID0gKGEwMCArIGEwMSArIGEwMiAtIGExMCAtIGExMSAtIGEyMSAtIGEyMikgKiBiMTE7XG4gICAgY29uc3QgbTIgPSAoYTAwIC0gYTEwKSAqICgtYjAxICsgYjExKTtcbiAgICBjb25zdCBtMyA9IGExMSAqICgtYjAwICsgYjAxICsgYjEwIC0gYjExIC0gYjEyIC0gYjIwICsgYjIyKTtcbiAgICBjb25zdCBtNCA9ICgtYTAwICsgYTEwICsgYTExKSAqIChiMDAgLSBiMDEgKyBiMTEpO1xuICAgIGNvbnN0IG01ID0gKGExMCArIGExMSkgKiAoLWIwMCArIGIwMSk7XG4gICAgY29uc3QgbTYgPSBhMDAgKiBiMDA7XG4gICAgY29uc3QgbTcgPSAoLWEwMCArIGEyMCArIGEyMSkgKiAoYjAwIC0gYjAyICsgYjEyKTtcbiAgICBjb25zdCBtOCA9ICgtYTAwICsgYTIwKSAqIChiMDIgLSBiMTIpO1xuICAgIGNvbnN0IG05ID0gKGEyMCArIGEyMSkgKiAoLWIwMCArIGIwMik7XG4gICAgY29uc3QgbTEwID0gKGEwMCArIGEwMSArIGEwMiAtIGExMSAtIGExMiAtIGEyMCAtIGEyMSkgKiBiMTI7XG4gICAgY29uc3QgbTExID0gYTIxICogKC1iMDAgKyBiMDIgKyBiMTAgLSBiMTEgLSBiMTIgLSBiMjAgKyBiMjEpO1xuICAgIGNvbnN0IG0xMiA9ICgtYTAyICsgYTIxICsgYTIyKSAqIChiMTEgKyBiMjAgLSBiMjEpO1xuICAgIGNvbnN0IG0xMyA9IChhMDIgLSBhMjIpICogKGIxMSAtIGIyMSk7XG4gICAgY29uc3QgbTE0ID0gYTAyICogYjIwO1xuICAgIGNvbnN0IG0xNSA9IChhMjEgKyBhMjIpICogKC1iMjAgKyBiMjEpO1xuICAgIGNvbnN0IG0xNiA9ICgtYTAyICsgYTExICsgYTEyKSAqIChiMTIgKyBiMjAgLSBiMjIpO1xuICAgIGNvbnN0IG0xNyA9IChhMDIgLSBhMTIpICogKGIxMiAtIGIyMik7XG4gICAgY29uc3QgbTE4ID0gKGExMSArIGExMikgKiAoLWIyMCArIGIyMik7XG4gICAgY29uc3QgbTE5ID0gYTAxICogYjEwO1xuICAgIGNvbnN0IG0yMCA9IGExMiAqIGIyMTtcbiAgICBjb25zdCBtMjEgPSBhMTAgKiBiMDI7XG4gICAgY29uc3QgbTIyID0gYTIwICogYjAxO1xuICAgIGNvbnN0IG0yMyA9IGEyMiAqIGIyMjtcblxuICAgIGNvbnN0IGMwMCA9IG02ICsgbTE0ICsgbTE5O1xuICAgIGNvbnN0IGMwMSA9IG0xICsgbTQgKyBtNSArIG02ICsgbTEyICsgbTE0ICsgbTE1O1xuICAgIGNvbnN0IGMwMiA9IG02ICsgbTcgKyBtOSArIG0xMCArIG0xNCArIG0xNiArIG0xODtcbiAgICBjb25zdCBjMTAgPSBtMiArIG0zICsgbTQgKyBtNiArIG0xNCArIG0xNiArIG0xNztcbiAgICBjb25zdCBjMTEgPSBtMiArIG00ICsgbTUgKyBtNiArIG0yMDtcbiAgICBjb25zdCBjMTIgPSBtMTQgKyBtMTYgKyBtMTcgKyBtMTggKyBtMjE7XG4gICAgY29uc3QgYzIwID0gbTYgKyBtNyArIG04ICsgbTExICsgbTEyICsgbTEzICsgbTE0O1xuICAgIGNvbnN0IGMyMSA9IG0xMiArIG0xMyArIG0xNCArIG0xNSArIG0yMjtcbiAgICBjb25zdCBjMjIgPSBtNiArIG03ICsgbTggKyBtOSArIG0yMztcblxuICAgIHJlc3VsdC5zZXQoMCwgMCwgYzAwKTtcbiAgICByZXN1bHQuc2V0KDAsIDEsIGMwMSk7XG4gICAgcmVzdWx0LnNldCgwLCAyLCBjMDIpO1xuICAgIHJlc3VsdC5zZXQoMSwgMCwgYzEwKTtcbiAgICByZXN1bHQuc2V0KDEsIDEsIGMxMSk7XG4gICAgcmVzdWx0LnNldCgxLCAyLCBjMTIpO1xuICAgIHJlc3VsdC5zZXQoMiwgMCwgYzIwKTtcbiAgICByZXN1bHQuc2V0KDIsIDEsIGMyMSk7XG4gICAgcmVzdWx0LnNldCgyLCAyLCBjMjIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBtbXVsU3RyYXNzZW4oeSkge1xuICAgIHkgPSBNYXRyaXguY2hlY2tNYXRyaXgoeSk7XG4gICAgbGV0IHggPSB0aGlzLmNsb25lKCk7XG4gICAgbGV0IHIxID0geC5yb3dzO1xuICAgIGxldCBjMSA9IHguY29sdW1ucztcbiAgICBsZXQgcjIgPSB5LnJvd3M7XG4gICAgbGV0IGMyID0geS5jb2x1bW5zO1xuICAgIGlmIChjMSAhPT0gcjIpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBNdWx0aXBseWluZyAke3IxfSB4ICR7YzF9IGFuZCAke3IyfSB4ICR7YzJ9IG1hdHJpeDogZGltZW5zaW9ucyBkbyBub3QgbWF0Y2guYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUHV0IGEgbWF0cml4IGludG8gdGhlIHRvcCBsZWZ0IG9mIGEgbWF0cml4IG9mIHplcm9zLlxuICAgIC8vIGByb3dzYCBhbmQgYGNvbHNgIGFyZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgb3V0cHV0IG1hdHJpeC5cbiAgICBmdW5jdGlvbiBlbWJlZChtYXQsIHJvd3MsIGNvbHMpIHtcbiAgICAgIGxldCByID0gbWF0LnJvd3M7XG4gICAgICBsZXQgYyA9IG1hdC5jb2x1bW5zO1xuICAgICAgaWYgKHIgPT09IHJvd3MgJiYgYyA9PT0gY29scykge1xuICAgICAgICByZXR1cm4gbWF0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHJlc3VsdGF0ID0gQWJzdHJhY3RNYXRyaXguemVyb3Mocm93cywgY29scyk7XG4gICAgICAgIHJlc3VsdGF0ID0gcmVzdWx0YXQuc2V0U3ViTWF0cml4KG1hdCwgMCwgMCk7XG4gICAgICAgIHJldHVybiByZXN1bHRhdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYWtlIHN1cmUgYm90aCBtYXRyaWNlcyBhcmUgdGhlIHNhbWUgc2l6ZS5cbiAgICAvLyBUaGlzIGlzIGV4Y2x1c2l2ZWx5IGZvciBzaW1wbGljaXR5OlxuICAgIC8vIHRoaXMgYWxnb3JpdGhtIGNhbiBiZSBpbXBsZW1lbnRlZCB3aXRoIG1hdHJpY2VzIG9mIGRpZmZlcmVudCBzaXplcy5cblxuICAgIGxldCByID0gTWF0aC5tYXgocjEsIHIyKTtcbiAgICBsZXQgYyA9IE1hdGgubWF4KGMxLCBjMik7XG4gICAgeCA9IGVtYmVkKHgsIHIsIGMpO1xuICAgIHkgPSBlbWJlZCh5LCByLCBjKTtcblxuICAgIC8vIE91ciByZWN1cnNpdmUgbXVsdGlwbGljYXRpb24gZnVuY3Rpb24uXG4gICAgZnVuY3Rpb24gYmxvY2tNdWx0KGEsIGIsIHJvd3MsIGNvbHMpIHtcbiAgICAgIC8vIEZvciBzbWFsbCBtYXRyaWNlcywgcmVzb3J0IHRvIG5haXZlIG11bHRpcGxpY2F0aW9uLlxuICAgICAgaWYgKHJvd3MgPD0gNTEyIHx8IGNvbHMgPD0gNTEyKSB7XG4gICAgICAgIHJldHVybiBhLm1tdWwoYik7IC8vIGEgaXMgZXF1aXZhbGVudCB0byB0aGlzXG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGR5bmFtaWMgcGFkZGluZy5cbiAgICAgIGlmIChyb3dzICUgMiA9PT0gMSAmJiBjb2xzICUgMiA9PT0gMSkge1xuICAgICAgICBhID0gZW1iZWQoYSwgcm93cyArIDEsIGNvbHMgKyAxKTtcbiAgICAgICAgYiA9IGVtYmVkKGIsIHJvd3MgKyAxLCBjb2xzICsgMSk7XG4gICAgICB9IGVsc2UgaWYgKHJvd3MgJSAyID09PSAxKSB7XG4gICAgICAgIGEgPSBlbWJlZChhLCByb3dzICsgMSwgY29scyk7XG4gICAgICAgIGIgPSBlbWJlZChiLCByb3dzICsgMSwgY29scyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbHMgJSAyID09PSAxKSB7XG4gICAgICAgIGEgPSBlbWJlZChhLCByb3dzLCBjb2xzICsgMSk7XG4gICAgICAgIGIgPSBlbWJlZChiLCByb3dzLCBjb2xzICsgMSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBoYWxmUm93cyA9IHBhcnNlSW50KGEucm93cyAvIDIsIDEwKTtcbiAgICAgIGxldCBoYWxmQ29scyA9IHBhcnNlSW50KGEuY29sdW1ucyAvIDIsIDEwKTtcbiAgICAgIC8vIFN1YmRpdmlkZSBpbnB1dCBtYXRyaWNlcy5cbiAgICAgIGxldCBhMTEgPSBhLnN1Yk1hdHJpeCgwLCBoYWxmUm93cyAtIDEsIDAsIGhhbGZDb2xzIC0gMSk7XG4gICAgICBsZXQgYjExID0gYi5zdWJNYXRyaXgoMCwgaGFsZlJvd3MgLSAxLCAwLCBoYWxmQ29scyAtIDEpO1xuXG4gICAgICBsZXQgYTEyID0gYS5zdWJNYXRyaXgoMCwgaGFsZlJvd3MgLSAxLCBoYWxmQ29scywgYS5jb2x1bW5zIC0gMSk7XG4gICAgICBsZXQgYjEyID0gYi5zdWJNYXRyaXgoMCwgaGFsZlJvd3MgLSAxLCBoYWxmQ29scywgYi5jb2x1bW5zIC0gMSk7XG5cbiAgICAgIGxldCBhMjEgPSBhLnN1Yk1hdHJpeChoYWxmUm93cywgYS5yb3dzIC0gMSwgMCwgaGFsZkNvbHMgLSAxKTtcbiAgICAgIGxldCBiMjEgPSBiLnN1Yk1hdHJpeChoYWxmUm93cywgYi5yb3dzIC0gMSwgMCwgaGFsZkNvbHMgLSAxKTtcblxuICAgICAgbGV0IGEyMiA9IGEuc3ViTWF0cml4KGhhbGZSb3dzLCBhLnJvd3MgLSAxLCBoYWxmQ29scywgYS5jb2x1bW5zIC0gMSk7XG4gICAgICBsZXQgYjIyID0gYi5zdWJNYXRyaXgoaGFsZlJvd3MsIGIucm93cyAtIDEsIGhhbGZDb2xzLCBiLmNvbHVtbnMgLSAxKTtcblxuICAgICAgLy8gQ29tcHV0ZSBpbnRlcm1lZGlhdGUgdmFsdWVzLlxuICAgICAgbGV0IG0xID0gYmxvY2tNdWx0KFxuICAgICAgICBBYnN0cmFjdE1hdHJpeC5hZGQoYTExLCBhMjIpLFxuICAgICAgICBBYnN0cmFjdE1hdHJpeC5hZGQoYjExLCBiMjIpLFxuICAgICAgICBoYWxmUm93cyxcbiAgICAgICAgaGFsZkNvbHMsXG4gICAgICApO1xuICAgICAgbGV0IG0yID0gYmxvY2tNdWx0KEFic3RyYWN0TWF0cml4LmFkZChhMjEsIGEyMiksIGIxMSwgaGFsZlJvd3MsIGhhbGZDb2xzKTtcbiAgICAgIGxldCBtMyA9IGJsb2NrTXVsdChhMTEsIEFic3RyYWN0TWF0cml4LnN1YihiMTIsIGIyMiksIGhhbGZSb3dzLCBoYWxmQ29scyk7XG4gICAgICBsZXQgbTQgPSBibG9ja011bHQoYTIyLCBBYnN0cmFjdE1hdHJpeC5zdWIoYjIxLCBiMTEpLCBoYWxmUm93cywgaGFsZkNvbHMpO1xuICAgICAgbGV0IG01ID0gYmxvY2tNdWx0KEFic3RyYWN0TWF0cml4LmFkZChhMTEsIGExMiksIGIyMiwgaGFsZlJvd3MsIGhhbGZDb2xzKTtcbiAgICAgIGxldCBtNiA9IGJsb2NrTXVsdChcbiAgICAgICAgQWJzdHJhY3RNYXRyaXguc3ViKGEyMSwgYTExKSxcbiAgICAgICAgQWJzdHJhY3RNYXRyaXguYWRkKGIxMSwgYjEyKSxcbiAgICAgICAgaGFsZlJvd3MsXG4gICAgICAgIGhhbGZDb2xzLFxuICAgICAgKTtcbiAgICAgIGxldCBtNyA9IGJsb2NrTXVsdChcbiAgICAgICAgQWJzdHJhY3RNYXRyaXguc3ViKGExMiwgYTIyKSxcbiAgICAgICAgQWJzdHJhY3RNYXRyaXguYWRkKGIyMSwgYjIyKSxcbiAgICAgICAgaGFsZlJvd3MsXG4gICAgICAgIGhhbGZDb2xzLFxuICAgICAgKTtcblxuICAgICAgLy8gQ29tYmluZSBpbnRlcm1lZGlhdGUgdmFsdWVzIGludG8gdGhlIG91dHB1dC5cbiAgICAgIGxldCBjMTEgPSBBYnN0cmFjdE1hdHJpeC5hZGQobTEsIG00KTtcbiAgICAgIGMxMS5zdWIobTUpO1xuICAgICAgYzExLmFkZChtNyk7XG4gICAgICBsZXQgYzEyID0gQWJzdHJhY3RNYXRyaXguYWRkKG0zLCBtNSk7XG4gICAgICBsZXQgYzIxID0gQWJzdHJhY3RNYXRyaXguYWRkKG0yLCBtNCk7XG4gICAgICBsZXQgYzIyID0gQWJzdHJhY3RNYXRyaXguc3ViKG0xLCBtMik7XG4gICAgICBjMjIuYWRkKG0zKTtcbiAgICAgIGMyMi5hZGQobTYpO1xuXG4gICAgICAvLyBDcm9wIG91dHB1dCB0byB0aGUgZGVzaXJlZCBzaXplICh1bmRvIGR5bmFtaWMgcGFkZGluZykuXG4gICAgICBsZXQgcmVzdWx0YXQgPSBBYnN0cmFjdE1hdHJpeC56ZXJvcygyICogYzExLnJvd3MsIDIgKiBjMTEuY29sdW1ucyk7XG4gICAgICByZXN1bHRhdCA9IHJlc3VsdGF0LnNldFN1Yk1hdHJpeChjMTEsIDAsIDApO1xuICAgICAgcmVzdWx0YXQgPSByZXN1bHRhdC5zZXRTdWJNYXRyaXgoYzEyLCBjMTEucm93cywgMCk7XG4gICAgICByZXN1bHRhdCA9IHJlc3VsdGF0LnNldFN1Yk1hdHJpeChjMjEsIDAsIGMxMS5jb2x1bW5zKTtcbiAgICAgIHJlc3VsdGF0ID0gcmVzdWx0YXQuc2V0U3ViTWF0cml4KGMyMiwgYzExLnJvd3MsIGMxMS5jb2x1bW5zKTtcbiAgICAgIHJldHVybiByZXN1bHRhdC5zdWJNYXRyaXgoMCwgcm93cyAtIDEsIDAsIGNvbHMgLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGJsb2NrTXVsdCh4LCB5LCByLCBjKTtcbiAgfVxuXG4gIHNjYWxlUm93cyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgfVxuICAgIGNvbnN0IHsgbWluID0gMCwgbWF4ID0gMSB9ID0gb3B0aW9ucztcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShtaW4pKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtaW4gbXVzdCBiZSBhIG51bWJlcicpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG1heCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heCBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gICAgaWYgKG1pbiA+PSBtYXgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdtaW4gbXVzdCBiZSBzbWFsbGVyIHRoYW4gbWF4Jyk7XG4gICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgodGhpcy5yb3dzLCB0aGlzLmNvbHVtbnMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93KGkpO1xuICAgICAgaWYgKHJvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc2NhbGUocm93LCB7IG1pbiwgbWF4LCBvdXRwdXQ6IHJvdyB9KTtcbiAgICAgIH1cbiAgICAgIG5ld01hdHJpeC5zZXRSb3coaSwgcm93KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld01hdHJpeDtcbiAgfVxuXG4gIHNjYWxlQ29sdW1ucyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgfVxuICAgIGNvbnN0IHsgbWluID0gMCwgbWF4ID0gMSB9ID0gb3B0aW9ucztcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShtaW4pKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtaW4gbXVzdCBiZSBhIG51bWJlcicpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG1heCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ21heCBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gICAgaWYgKG1pbiA+PSBtYXgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdtaW4gbXVzdCBiZSBzbWFsbGVyIHRoYW4gbWF4Jyk7XG4gICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgodGhpcy5yb3dzLCB0aGlzLmNvbHVtbnMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2x1bW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuZ2V0Q29sdW1uKGkpO1xuICAgICAgaWYgKGNvbHVtbi5sZW5ndGgpIHtcbiAgICAgICAgcmVzY2FsZShjb2x1bW4sIHtcbiAgICAgICAgICBtaW46IG1pbixcbiAgICAgICAgICBtYXg6IG1heCxcbiAgICAgICAgICBvdXRwdXQ6IGNvbHVtbixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBuZXdNYXRyaXguc2V0Q29sdW1uKGksIGNvbHVtbik7XG4gICAgfVxuICAgIHJldHVybiBuZXdNYXRyaXg7XG4gIH1cblxuICBmbGlwUm93cygpIHtcbiAgICBjb25zdCBtaWRkbGUgPSBNYXRoLmNlaWwodGhpcy5jb2x1bW5zIC8gMik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtaWRkbGU7IGorKykge1xuICAgICAgICBsZXQgZmlyc3QgPSB0aGlzLmdldChpLCBqKTtcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLmdldChpLCB0aGlzLmNvbHVtbnMgLSAxIC0gaik7XG4gICAgICAgIHRoaXMuc2V0KGksIGosIGxhc3QpO1xuICAgICAgICB0aGlzLnNldChpLCB0aGlzLmNvbHVtbnMgLSAxIC0gaiwgZmlyc3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZsaXBDb2x1bW5zKCkge1xuICAgIGNvbnN0IG1pZGRsZSA9IE1hdGguY2VpbCh0aGlzLnJvd3MgLyAyKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pZGRsZTsgaSsrKSB7XG4gICAgICAgIGxldCBmaXJzdCA9IHRoaXMuZ2V0KGksIGopO1xuICAgICAgICBsZXQgbGFzdCA9IHRoaXMuZ2V0KHRoaXMucm93cyAtIDEgLSBpLCBqKTtcbiAgICAgICAgdGhpcy5zZXQoaSwgaiwgbGFzdCk7XG4gICAgICAgIHRoaXMuc2V0KHRoaXMucm93cyAtIDEgLSBpLCBqLCBmaXJzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAga3JvbmVja2VyUHJvZHVjdChvdGhlcikge1xuICAgIG90aGVyID0gTWF0cml4LmNoZWNrTWF0cml4KG90aGVyKTtcblxuICAgIGxldCBtID0gdGhpcy5yb3dzO1xuICAgIGxldCBuID0gdGhpcy5jb2x1bW5zO1xuICAgIGxldCBwID0gb3RoZXIucm93cztcbiAgICBsZXQgcSA9IG90aGVyLmNvbHVtbnM7XG5cbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hdHJpeChtICogcCwgbiAqIHEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGorKykge1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHA7IGsrKykge1xuICAgICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwgcTsgbCsrKSB7XG4gICAgICAgICAgICByZXN1bHQuc2V0KHAgKiBpICsgaywgcSAqIGogKyBsLCB0aGlzLmdldChpLCBqKSAqIG90aGVyLmdldChrLCBsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB0cmFuc3Bvc2UoKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBNYXRyaXgodGhpcy5jb2x1bW5zLCB0aGlzLnJvd3MpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2x1bW5zOyBqKyspIHtcbiAgICAgICAgcmVzdWx0LnNldChqLCBpLCB0aGlzLmdldChpLCBqKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzb3J0Um93cyhjb21wYXJlRnVuY3Rpb24gPSBjb21wYXJlTnVtYmVycykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0Um93KGksIHRoaXMuZ2V0Um93KGkpLnNvcnQoY29tcGFyZUZ1bmN0aW9uKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc29ydENvbHVtbnMoY29tcGFyZUZ1bmN0aW9uID0gY29tcGFyZU51bWJlcnMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sdW1uczsgaSsrKSB7XG4gICAgICB0aGlzLnNldENvbHVtbihpLCB0aGlzLmdldENvbHVtbihpKS5zb3J0KGNvbXBhcmVGdW5jdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1Yk1hdHJpeChzdGFydFJvdywgZW5kUm93LCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKSB7XG4gICAgY2hlY2tSYW5nZSh0aGlzLCBzdGFydFJvdywgZW5kUm93LCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKTtcbiAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChcbiAgICAgIGVuZFJvdyAtIHN0YXJ0Um93ICsgMSxcbiAgICAgIGVuZENvbHVtbiAtIHN0YXJ0Q29sdW1uICsgMSxcbiAgICApO1xuICAgIGZvciAobGV0IGkgPSBzdGFydFJvdzsgaSA8PSBlbmRSb3c7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29sdW1uOyBqIDw9IGVuZENvbHVtbjsgaisrKSB7XG4gICAgICAgIG5ld01hdHJpeC5zZXQoaSAtIHN0YXJ0Um93LCBqIC0gc3RhcnRDb2x1bW4sIHRoaXMuZ2V0KGksIGopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld01hdHJpeDtcbiAgfVxuXG4gIHN1Yk1hdHJpeFJvdyhpbmRpY2VzLCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKSB7XG4gICAgaWYgKHN0YXJ0Q29sdW1uID09PSB1bmRlZmluZWQpIHN0YXJ0Q29sdW1uID0gMDtcbiAgICBpZiAoZW5kQ29sdW1uID09PSB1bmRlZmluZWQpIGVuZENvbHVtbiA9IHRoaXMuY29sdW1ucyAtIDE7XG4gICAgaWYgKFxuICAgICAgc3RhcnRDb2x1bW4gPiBlbmRDb2x1bW4gfHxcbiAgICAgIHN0YXJ0Q29sdW1uIDwgMCB8fFxuICAgICAgc3RhcnRDb2x1bW4gPj0gdGhpcy5jb2x1bW5zIHx8XG4gICAgICBlbmRDb2x1bW4gPCAwIHx8XG4gICAgICBlbmRDb2x1bW4gPj0gdGhpcy5jb2x1bW5zXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXJndW1lbnQgb3V0IG9mIHJhbmdlJyk7XG4gICAgfVxuXG4gICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgoaW5kaWNlcy5sZW5ndGgsIGVuZENvbHVtbiAtIHN0YXJ0Q29sdW1uICsgMSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gc3RhcnRDb2x1bW47IGogPD0gZW5kQ29sdW1uOyBqKyspIHtcbiAgICAgICAgaWYgKGluZGljZXNbaV0gPCAwIHx8IGluZGljZXNbaV0gPj0gdGhpcy5yb3dzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFJvdyBpbmRleCBvdXQgb2YgcmFuZ2U6ICR7aW5kaWNlc1tpXX1gKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdNYXRyaXguc2V0KGksIGogLSBzdGFydENvbHVtbiwgdGhpcy5nZXQoaW5kaWNlc1tpXSwgaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3TWF0cml4O1xuICB9XG5cbiAgc3ViTWF0cml4Q29sdW1uKGluZGljZXMsIHN0YXJ0Um93LCBlbmRSb3cpIHtcbiAgICBpZiAoc3RhcnRSb3cgPT09IHVuZGVmaW5lZCkgc3RhcnRSb3cgPSAwO1xuICAgIGlmIChlbmRSb3cgPT09IHVuZGVmaW5lZCkgZW5kUm93ID0gdGhpcy5yb3dzIC0gMTtcbiAgICBpZiAoXG4gICAgICBzdGFydFJvdyA+IGVuZFJvdyB8fFxuICAgICAgc3RhcnRSb3cgPCAwIHx8XG4gICAgICBzdGFydFJvdyA+PSB0aGlzLnJvd3MgfHxcbiAgICAgIGVuZFJvdyA8IDAgfHxcbiAgICAgIGVuZFJvdyA+PSB0aGlzLnJvd3NcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBcmd1bWVudCBvdXQgb2YgcmFuZ2UnKTtcbiAgICB9XG5cbiAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChlbmRSb3cgLSBzdGFydFJvdyArIDEsIGluZGljZXMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSBzdGFydFJvdzsgaiA8PSBlbmRSb3c7IGorKykge1xuICAgICAgICBpZiAoaW5kaWNlc1tpXSA8IDAgfHwgaW5kaWNlc1tpXSA+PSB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgQ29sdW1uIGluZGV4IG91dCBvZiByYW5nZTogJHtpbmRpY2VzW2ldfWApO1xuICAgICAgICB9XG4gICAgICAgIG5ld01hdHJpeC5zZXQoaiAtIHN0YXJ0Um93LCBpLCB0aGlzLmdldChqLCBpbmRpY2VzW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdNYXRyaXg7XG4gIH1cblxuICBzZXRTdWJNYXRyaXgobWF0cml4LCBzdGFydFJvdywgc3RhcnRDb2x1bW4pIHtcbiAgICBtYXRyaXggPSBNYXRyaXguY2hlY2tNYXRyaXgobWF0cml4KTtcbiAgICBpZiAobWF0cml4LmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGxldCBlbmRSb3cgPSBzdGFydFJvdyArIG1hdHJpeC5yb3dzIC0gMTtcbiAgICBsZXQgZW5kQ29sdW1uID0gc3RhcnRDb2x1bW4gKyBtYXRyaXguY29sdW1ucyAtIDE7XG4gICAgY2hlY2tSYW5nZSh0aGlzLCBzdGFydFJvdywgZW5kUm93LCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHVtbnM7IGorKykge1xuICAgICAgICB0aGlzLnNldChzdGFydFJvdyArIGksIHN0YXJ0Q29sdW1uICsgaiwgbWF0cml4LmdldChpLCBqKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2VsZWN0aW9uKHJvd0luZGljZXMsIGNvbHVtbkluZGljZXMpIHtcbiAgICBsZXQgaW5kaWNlcyA9IGNoZWNrSW5kaWNlcyh0aGlzLCByb3dJbmRpY2VzLCBjb2x1bW5JbmRpY2VzKTtcbiAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeChyb3dJbmRpY2VzLmxlbmd0aCwgY29sdW1uSW5kaWNlcy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5yb3cubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCByb3dJbmRleCA9IGluZGljZXMucm93W2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpbmRpY2VzLmNvbHVtbi5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgY29sdW1uSW5kZXggPSBpbmRpY2VzLmNvbHVtbltqXTtcbiAgICAgICAgbmV3TWF0cml4LnNldChpLCBqLCB0aGlzLmdldChyb3dJbmRleCwgY29sdW1uSW5kZXgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld01hdHJpeDtcbiAgfVxuXG4gIHRyYWNlKCkge1xuICAgIGxldCBtaW4gPSBNYXRoLm1pbih0aGlzLnJvd3MsIHRoaXMuY29sdW1ucyk7XG4gICAgbGV0IHRyYWNlID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbjsgaSsrKSB7XG4gICAgICB0cmFjZSArPSB0aGlzLmdldChpLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWNlO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgodGhpcy5yb3dzLCB0aGlzLmNvbHVtbnMpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbHVtbiA9IDA7IGNvbHVtbiA8IHRoaXMuY29sdW1uczsgY29sdW1uKyspIHtcbiAgICAgICAgbmV3TWF0cml4LnNldChyb3csIGNvbHVtbiwgdGhpcy5nZXQocm93LCBjb2x1bW4pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld01hdHJpeDtcbiAgfVxuXG4gIHN1bShieSkge1xuICAgIHN3aXRjaCAoYnkpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6XG4gICAgICAgIHJldHVybiBzdW1CeVJvdyh0aGlzKTtcbiAgICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICAgIHJldHVybiBzdW1CeUNvbHVtbih0aGlzKTtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gc3VtQWxsKHRoaXMpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG9wdGlvbjogJHtieX1gKTtcbiAgICB9XG4gIH1cblxuICBwcm9kdWN0KGJ5KSB7XG4gICAgc3dpdGNoIChieSkge1xuICAgICAgY2FzZSAncm93JzpcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RCeVJvdyh0aGlzKTtcbiAgICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICAgIHJldHVybiBwcm9kdWN0QnlDb2x1bW4odGhpcyk7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RBbGwodGhpcyk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgb3B0aW9uOiAke2J5fWApO1xuICAgIH1cbiAgfVxuXG4gIG1lYW4oYnkpIHtcbiAgICBjb25zdCBzdW0gPSB0aGlzLnN1bShieSk7XG4gICAgc3dpdGNoIChieSkge1xuICAgICAgY2FzZSAncm93Jzoge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICAgICAgc3VtW2ldIC89IHRoaXMuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgICAgY2FzZSAnY29sdW1uJzoge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sdW1uczsgaSsrKSB7XG4gICAgICAgICAgc3VtW2ldIC89IHRoaXMucm93cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiBzdW0gLyB0aGlzLnNpemU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgb3B0aW9uOiAke2J5fWApO1xuICAgIH1cbiAgfVxuXG4gIHZhcmlhbmNlKGJ5LCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGJ5ID09PSAnb2JqZWN0Jykge1xuICAgICAgb3B0aW9ucyA9IGJ5O1xuICAgICAgYnkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICB9XG4gICAgY29uc3QgeyB1bmJpYXNlZCA9IHRydWUsIG1lYW4gPSB0aGlzLm1lYW4oYnkpIH0gPSBvcHRpb25zO1xuICAgIGlmICh0eXBlb2YgdW5iaWFzZWQgIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndW5iaWFzZWQgbXVzdCBiZSBhIGJvb2xlYW4nKTtcbiAgICB9XG4gICAgc3dpdGNoIChieSkge1xuICAgICAgY2FzZSAncm93Jzoge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVhbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtZWFuIG11c3QgYmUgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFyaWFuY2VCeVJvdyh0aGlzLCB1bmJpYXNlZCwgbWVhbik7XG4gICAgICB9XG4gICAgICBjYXNlICdjb2x1bW4nOiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZWFuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ21lYW4gbXVzdCBiZSBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YXJpYW5jZUJ5Q29sdW1uKHRoaXMsIHVuYmlhc2VkLCBtZWFuKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgdW5kZWZpbmVkOiB7XG4gICAgICAgIGlmICh0eXBlb2YgbWVhbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtZWFuIG11c3QgYmUgYSBudW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFyaWFuY2VBbGwodGhpcywgdW5iaWFzZWQsIG1lYW4pO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG9wdGlvbjogJHtieX1gKTtcbiAgICB9XG4gIH1cblxuICBzdGFuZGFyZERldmlhdGlvbihieSwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgYnkgPT09ICdvYmplY3QnKSB7XG4gICAgICBvcHRpb25zID0gYnk7XG4gICAgICBieSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgdmFyaWFuY2UgPSB0aGlzLnZhcmlhbmNlKGJ5LCBvcHRpb25zKTtcbiAgICBpZiAoYnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIE1hdGguc3FydCh2YXJpYW5jZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFyaWFuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyaWFuY2VbaV0gPSBNYXRoLnNxcnQodmFyaWFuY2VbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhcmlhbmNlO1xuICAgIH1cbiAgfVxuXG4gIGNlbnRlcihieSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBieSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG9wdGlvbnMgPSBieTtcbiAgICAgIGJ5ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgfVxuICAgIGNvbnN0IHsgY2VudGVyID0gdGhpcy5tZWFuKGJ5KSB9ID0gb3B0aW9ucztcbiAgICBzd2l0Y2ggKGJ5KSB7XG4gICAgICBjYXNlICdyb3cnOiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjZW50ZXIpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2VudGVyIG11c3QgYmUgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICBjZW50ZXJCeVJvdyh0aGlzLCBjZW50ZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2NvbHVtbic6IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNlbnRlcikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjZW50ZXIgbXVzdCBiZSBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICAgIGNlbnRlckJ5Q29sdW1uKHRoaXMsIGNlbnRlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgY2FzZSB1bmRlZmluZWQ6IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjZW50ZXIgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2VudGVyIG11c3QgYmUgYSBudW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICBjZW50ZXJBbGwodGhpcywgY2VudGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgb3B0aW9uOiAke2J5fWApO1xuICAgIH1cbiAgfVxuXG4gIHNjYWxlKGJ5LCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGJ5ID09PSAnb2JqZWN0Jykge1xuICAgICAgb3B0aW9ucyA9IGJ5O1xuICAgICAgYnkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICB9XG4gICAgbGV0IHNjYWxlID0gb3B0aW9ucy5zY2FsZTtcbiAgICBzd2l0Y2ggKGJ5KSB7XG4gICAgICBjYXNlICdyb3cnOiB7XG4gICAgICAgIGlmIChzY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2NhbGUgPSBnZXRTY2FsZUJ5Um93KHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KHNjYWxlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NjYWxlIG11c3QgYmUgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZUJ5Um93KHRoaXMsIHNjYWxlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBjYXNlICdjb2x1bW4nOiB7XG4gICAgICAgIGlmIChzY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2NhbGUgPSBnZXRTY2FsZUJ5Q29sdW1uKHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KHNjYWxlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NjYWxlIG11c3QgYmUgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZUJ5Q29sdW1uKHRoaXMsIHNjYWxlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBjYXNlIHVuZGVmaW5lZDoge1xuICAgICAgICBpZiAoc2NhbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNjYWxlID0gZ2V0U2NhbGVBbGwodGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNjYWxlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NjYWxlIG11c3QgYmUgYSBudW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZUFsbCh0aGlzLCBzY2FsZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG9wdGlvbjogJHtieX1gKTtcbiAgICB9XG4gIH1cblxuICB0b1N0cmluZyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3BlY3RNYXRyaXhXaXRoT3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgfVxufVxuXG5BYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUua2xhc3MgPSAnTWF0cml4JztcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykge1xuICBBYnN0cmFjdE1hdHJpeC5wcm90b3R5cGVbXG4gICAgU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKVxuICBdID0gaW5zcGVjdE1hdHJpeDtcbn1cblxuZnVuY3Rpb24gY29tcGFyZU51bWJlcnMoYSwgYikge1xuICByZXR1cm4gYSAtIGI7XG59XG5cbi8vIFN5bm9ueW1zXG5BYnN0cmFjdE1hdHJpeC5yYW5kb20gPSBBYnN0cmFjdE1hdHJpeC5yYW5kO1xuQWJzdHJhY3RNYXRyaXgucmFuZG9tSW50ID0gQWJzdHJhY3RNYXRyaXgucmFuZEludDtcbkFic3RyYWN0TWF0cml4LmRpYWdvbmFsID0gQWJzdHJhY3RNYXRyaXguZGlhZztcbkFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaWFnb25hbCA9IEFic3RyYWN0TWF0cml4LnByb3RvdHlwZS5kaWFnO1xuQWJzdHJhY3RNYXRyaXguaWRlbnRpdHkgPSBBYnN0cmFjdE1hdHJpeC5leWU7XG5BYnN0cmFjdE1hdHJpeC5wcm90b3R5cGUubmVnYXRlID0gQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLm5lZztcbkFic3RyYWN0TWF0cml4LnByb3RvdHlwZS50ZW5zb3JQcm9kdWN0ID1cbiAgQWJzdHJhY3RNYXRyaXgucHJvdG90eXBlLmtyb25lY2tlclByb2R1Y3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeCBleHRlbmRzIEFic3RyYWN0TWF0cml4IHtcbiAgY29uc3RydWN0b3IoblJvd3MsIG5Db2x1bW5zKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoTWF0cml4LmlzTWF0cml4KG5Sb3dzKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuICAgICAgcmV0dXJuIG5Sb3dzLmNsb25lKCk7XG4gICAgfSBlbHNlIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG5Sb3dzKSAmJiBuUm93cyA+PSAwKSB7XG4gICAgICAvLyBDcmVhdGUgYW4gZW1wdHkgbWF0cml4XG4gICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG5Db2x1bW5zKSAmJiBuQ29sdW1ucyA+PSAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgblJvd3M7IGkrKykge1xuICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKG5ldyBGbG9hdDY0QXJyYXkobkNvbHVtbnMpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbkNvbHVtbnMgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoblJvd3MpKSB7XG4gICAgICAvLyBDb3B5IHRoZSB2YWx1ZXMgZnJvbSB0aGUgMkQgYXJyYXlcbiAgICAgIGNvbnN0IGFycmF5RGF0YSA9IG5Sb3dzO1xuICAgICAgblJvd3MgPSBhcnJheURhdGEubGVuZ3RoO1xuICAgICAgbkNvbHVtbnMgPSBuUm93cyA/IGFycmF5RGF0YVswXS5sZW5ndGggOiAwO1xuICAgICAgaWYgKHR5cGVvZiBuQ29sdW1ucyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRGF0YSBtdXN0IGJlIGEgMkQgYXJyYXkgd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudCcsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgblJvd3M7IGkrKykge1xuICAgICAgICBpZiAoYXJyYXlEYXRhW2ldLmxlbmd0aCAhPT0gbkNvbHVtbnMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5jb25zaXN0ZW50IGFycmF5IGRpbWVuc2lvbnMnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEucHVzaChGbG9hdDY0QXJyYXkuZnJvbShhcnJheURhdGFbaV0pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIgb3IgYW4gYXJyYXknLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5yb3dzID0gblJvd3M7XG4gICAgdGhpcy5jb2x1bW5zID0gbkNvbHVtbnM7XG4gIH1cblxuICBzZXQocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSkge1xuICAgIHRoaXMuZGF0YVtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocm93SW5kZXgsIGNvbHVtbkluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtyb3dJbmRleF1bY29sdW1uSW5kZXhdO1xuICB9XG5cbiAgcmVtb3ZlUm93KGluZGV4KSB7XG4gICAgY2hlY2tSb3dJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgdGhpcy5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yb3dzIC09IDE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRSb3coaW5kZXgsIGFycmF5KSB7XG4gICAgaWYgKGFycmF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFycmF5ID0gaW5kZXg7XG4gICAgICBpbmRleCA9IHRoaXMucm93cztcbiAgICB9XG4gICAgY2hlY2tSb3dJbmRleCh0aGlzLCBpbmRleCwgdHJ1ZSk7XG4gICAgYXJyYXkgPSBGbG9hdDY0QXJyYXkuZnJvbShjaGVja1Jvd1ZlY3Rvcih0aGlzLCBhcnJheSkpO1xuICAgIHRoaXMuZGF0YS5zcGxpY2UoaW5kZXgsIDAsIGFycmF5KTtcbiAgICB0aGlzLnJvd3MgKz0gMTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZUNvbHVtbihpbmRleCkge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgaW5kZXgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGNvbnN0IG5ld1JvdyA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5jb2x1bW5zIC0gMSk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGluZGV4OyBqKyspIHtcbiAgICAgICAgbmV3Um93W2pdID0gdGhpcy5kYXRhW2ldW2pdO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaiA9IGluZGV4ICsgMTsgaiA8IHRoaXMuY29sdW1uczsgaisrKSB7XG4gICAgICAgIG5ld1Jvd1tqIC0gMV0gPSB0aGlzLmRhdGFbaV1bal07XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGFbaV0gPSBuZXdSb3c7XG4gICAgfVxuICAgIHRoaXMuY29sdW1ucyAtPSAxO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ29sdW1uKGluZGV4LCBhcnJheSkge1xuICAgIGlmICh0eXBlb2YgYXJyYXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBhcnJheSA9IGluZGV4O1xuICAgICAgaW5kZXggPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuICAgIGNoZWNrQ29sdW1uSW5kZXgodGhpcywgaW5kZXgsIHRydWUpO1xuICAgIGFycmF5ID0gY2hlY2tDb2x1bW5WZWN0b3IodGhpcywgYXJyYXkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgIGNvbnN0IG5ld1JvdyA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5jb2x1bW5zICsgMSk7XG4gICAgICBsZXQgaiA9IDA7XG4gICAgICBmb3IgKDsgaiA8IGluZGV4OyBqKyspIHtcbiAgICAgICAgbmV3Um93W2pdID0gdGhpcy5kYXRhW2ldW2pdO1xuICAgICAgfVxuICAgICAgbmV3Um93W2orK10gPSBhcnJheVtpXTtcbiAgICAgIGZvciAoOyBqIDwgdGhpcy5jb2x1bW5zICsgMTsgaisrKSB7XG4gICAgICAgIG5ld1Jvd1tqXSA9IHRoaXMuZGF0YVtpXVtqIC0gMV07XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGFbaV0gPSBuZXdSb3c7XG4gICAgfVxuICAgIHRoaXMuY29sdW1ucyArPSAxO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmluc3RhbGxNYXRoT3BlcmF0aW9ucyhBYnN0cmFjdE1hdHJpeCwgTWF0cml4KTtcbiIsImltcG9ydCBTVkQgZnJvbSAnLi9kYy9zdmQnO1xuaW1wb3J0IE1hdHJpeCBmcm9tICcuL21hdHJpeCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwc2V1ZG9JbnZlcnNlKG1hdHJpeCwgdGhyZXNob2xkID0gTnVtYmVyLkVQU0lMT04pIHtcbiAgbWF0cml4ID0gTWF0cml4LmNoZWNrTWF0cml4KG1hdHJpeCk7XG4gIGlmIChtYXRyaXguaXNFbXB0eSgpKSB7XG4gICAgLy8gd2l0aCBhIHplcm8gZGltZW5zaW9uLCB0aGUgcHNldWRvLWludmVyc2UgaXMgdGhlIHRyYW5zcG9zZSwgc2luY2UgYWxsIDB4biBhbmQgbngwIG1hdHJpY2VzIGFyZSBzaW5ndWxhclxuICAgIC8vICgweG4pKihueDApKigweG4pID0gMHhuXG4gICAgLy8gKG54MCkqKDB4bikqKG54MCkgPSBueDBcbiAgICByZXR1cm4gbWF0cml4LnRyYW5zcG9zZSgpO1xuICB9XG4gIGxldCBzdmRTb2x1dGlvbiA9IG5ldyBTVkQobWF0cml4LCB7IGF1dG9UcmFuc3Bvc2U6IHRydWUgfSk7XG5cbiAgbGV0IFUgPSBzdmRTb2x1dGlvbi5sZWZ0U2luZ3VsYXJWZWN0b3JzO1xuICBsZXQgViA9IHN2ZFNvbHV0aW9uLnJpZ2h0U2luZ3VsYXJWZWN0b3JzO1xuICBsZXQgcyA9IHN2ZFNvbHV0aW9uLmRpYWdvbmFsO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChNYXRoLmFicyhzW2ldKSA+IHRocmVzaG9sZCkge1xuICAgICAgc1tpXSA9IDEuMCAvIHNbaV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHNbaV0gPSAwLjA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFYubW11bChNYXRyaXguZGlhZyhzKS5tbXVsKFUudHJhbnNwb3NlKCkpKTtcbn1cbiIsImltcG9ydCB7IG5ld0FycmF5IH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN1bUJ5Um93KG1hdHJpeCkge1xuICBsZXQgc3VtID0gbmV3QXJyYXkobWF0cml4LnJvd3MpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyArK2kpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyArK2opIHtcbiAgICAgIHN1bVtpXSArPSBtYXRyaXguZ2V0KGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3VtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VtQnlDb2x1bW4obWF0cml4KSB7XG4gIGxldCBzdW0gPSBuZXdBcnJheShtYXRyaXguY29sdW1ucyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LnJvd3M7ICsraSkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHVtbnM7ICsraikge1xuICAgICAgc3VtW2pdICs9IG1hdHJpeC5nZXQoaSwgaik7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdW1BbGwobWF0cml4KSB7XG4gIGxldCB2ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgucm93czsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXguY29sdW1uczsgaisrKSB7XG4gICAgICB2ICs9IG1hdHJpeC5nZXQoaSwgaik7XG4gICAgfVxuICB9XG4gIHJldHVybiB2O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZHVjdEJ5Um93KG1hdHJpeCkge1xuICBsZXQgc3VtID0gbmV3QXJyYXkobWF0cml4LnJvd3MsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyArK2kpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyArK2opIHtcbiAgICAgIHN1bVtpXSAqPSBtYXRyaXguZ2V0KGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3VtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZHVjdEJ5Q29sdW1uKG1hdHJpeCkge1xuICBsZXQgc3VtID0gbmV3QXJyYXkobWF0cml4LmNvbHVtbnMsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyArK2kpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyArK2opIHtcbiAgICAgIHN1bVtqXSAqPSBtYXRyaXguZ2V0KGksIGopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3VtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZHVjdEFsbChtYXRyaXgpIHtcbiAgbGV0IHYgPSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyBqKyspIHtcbiAgICAgIHYgKj0gbWF0cml4LmdldChpLCBqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YXJpYW5jZUJ5Um93KG1hdHJpeCwgdW5iaWFzZWQsIG1lYW4pIHtcbiAgY29uc3Qgcm93cyA9IG1hdHJpeC5yb3dzO1xuICBjb25zdCBjb2xzID0gbWF0cml4LmNvbHVtbnM7XG4gIGNvbnN0IHZhcmlhbmNlID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICBsZXQgc3VtMSA9IDA7XG4gICAgbGV0IHN1bTIgPSAwO1xuICAgIGxldCB4ID0gMDtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xuICAgICAgeCA9IG1hdHJpeC5nZXQoaSwgaikgLSBtZWFuW2ldO1xuICAgICAgc3VtMSArPSB4O1xuICAgICAgc3VtMiArPSB4ICogeDtcbiAgICB9XG4gICAgaWYgKHVuYmlhc2VkKSB7XG4gICAgICB2YXJpYW5jZS5wdXNoKChzdW0yIC0gKHN1bTEgKiBzdW0xKSAvIGNvbHMpIC8gKGNvbHMgLSAxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhcmlhbmNlLnB1c2goKHN1bTIgLSAoc3VtMSAqIHN1bTEpIC8gY29scykgLyBjb2xzKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhcmlhbmNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFyaWFuY2VCeUNvbHVtbihtYXRyaXgsIHVuYmlhc2VkLCBtZWFuKSB7XG4gIGNvbnN0IHJvd3MgPSBtYXRyaXgucm93cztcbiAgY29uc3QgY29scyA9IG1hdHJpeC5jb2x1bW5zO1xuICBjb25zdCB2YXJpYW5jZSA9IFtdO1xuXG4gIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XG4gICAgbGV0IHN1bTEgPSAwO1xuICAgIGxldCBzdW0yID0gMDtcbiAgICBsZXQgeCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIHggPSBtYXRyaXguZ2V0KGksIGopIC0gbWVhbltqXTtcbiAgICAgIHN1bTEgKz0geDtcbiAgICAgIHN1bTIgKz0geCAqIHg7XG4gICAgfVxuICAgIGlmICh1bmJpYXNlZCkge1xuICAgICAgdmFyaWFuY2UucHVzaCgoc3VtMiAtIChzdW0xICogc3VtMSkgLyByb3dzKSAvIChyb3dzIC0gMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXJpYW5jZS5wdXNoKChzdW0yIC0gKHN1bTEgKiBzdW0xKSAvIHJvd3MpIC8gcm93cyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YXJpYW5jZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhbmNlQWxsKG1hdHJpeCwgdW5iaWFzZWQsIG1lYW4pIHtcbiAgY29uc3Qgcm93cyA9IG1hdHJpeC5yb3dzO1xuICBjb25zdCBjb2xzID0gbWF0cml4LmNvbHVtbnM7XG4gIGNvbnN0IHNpemUgPSByb3dzICogY29scztcblxuICBsZXQgc3VtMSA9IDA7XG4gIGxldCBzdW0yID0gMDtcbiAgbGV0IHggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XG4gICAgICB4ID0gbWF0cml4LmdldChpLCBqKSAtIG1lYW47XG4gICAgICBzdW0xICs9IHg7XG4gICAgICBzdW0yICs9IHggKiB4O1xuICAgIH1cbiAgfVxuICBpZiAodW5iaWFzZWQpIHtcbiAgICByZXR1cm4gKHN1bTIgLSAoc3VtMSAqIHN1bTEpIC8gc2l6ZSkgLyAoc2l6ZSAtIDEpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAoc3VtMiAtIChzdW0xICogc3VtMSkgLyBzaXplKSAvIHNpemU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNlbnRlckJ5Um93KG1hdHJpeCwgbWVhbikge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyBqKyspIHtcbiAgICAgIG1hdHJpeC5zZXQoaSwgaiwgbWF0cml4LmdldChpLCBqKSAtIG1lYW5baV0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2VudGVyQnlDb2x1bW4obWF0cml4LCBtZWFuKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LnJvd3M7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHVtbnM7IGorKykge1xuICAgICAgbWF0cml4LnNldChpLCBqLCBtYXRyaXguZ2V0KGksIGopIC0gbWVhbltqXSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJBbGwobWF0cml4LCBtZWFuKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LnJvd3M7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHVtbnM7IGorKykge1xuICAgICAgbWF0cml4LnNldChpLCBqLCBtYXRyaXguZ2V0KGksIGopIC0gbWVhbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY2FsZUJ5Um93KG1hdHJpeCkge1xuICBjb25zdCBzY2FsZSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICBsZXQgc3VtID0gMDtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyBqKyspIHtcbiAgICAgIHN1bSArPSBNYXRoLnBvdyhtYXRyaXguZ2V0KGksIGopLCAyKSAvIChtYXRyaXguY29sdW1ucyAtIDEpO1xuICAgIH1cbiAgICBzY2FsZS5wdXNoKE1hdGguc3FydChzdW0pKTtcbiAgfVxuICByZXR1cm4gc2NhbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUJ5Um93KG1hdHJpeCwgc2NhbGUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgucm93czsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXguY29sdW1uczsgaisrKSB7XG4gICAgICBtYXRyaXguc2V0KGksIGosIG1hdHJpeC5nZXQoaSwgaikgLyBzY2FsZVtpXSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY2FsZUJ5Q29sdW1uKG1hdHJpeCkge1xuICBjb25zdCBzY2FsZSA9IFtdO1xuICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyBqKyspIHtcbiAgICBsZXQgc3VtID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICAgIHN1bSArPSBNYXRoLnBvdyhtYXRyaXguZ2V0KGksIGopLCAyKSAvIChtYXRyaXgucm93cyAtIDEpO1xuICAgIH1cbiAgICBzY2FsZS5wdXNoKE1hdGguc3FydChzdW0pKTtcbiAgfVxuICByZXR1cm4gc2NhbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUJ5Q29sdW1uKG1hdHJpeCwgc2NhbGUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgucm93czsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXguY29sdW1uczsgaisrKSB7XG4gICAgICBtYXRyaXguc2V0KGksIGosIG1hdHJpeC5nZXQoaSwgaikgLyBzY2FsZVtqXSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY2FsZUFsbChtYXRyaXgpIHtcbiAgY29uc3QgZGl2aWRlciA9IG1hdHJpeC5zaXplIC0gMTtcbiAgbGV0IHN1bSA9IDA7XG4gIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHVtbnM7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LnJvd3M7IGkrKykge1xuICAgICAgc3VtICs9IE1hdGgucG93KG1hdHJpeC5nZXQoaSwgaiksIDIpIC8gZGl2aWRlcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIE1hdGguc3FydChzdW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVBbGwobWF0cml4LCBzY2FsZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2x1bW5zOyBqKyspIHtcbiAgICAgIG1hdHJpeC5zZXQoaSwgaiwgbWF0cml4LmdldChpLCBqKSAvIHNjYWxlKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQHByaXZhdGVcbiAqIENoZWNrIHRoYXQgYSByb3cgaW5kZXggaXMgbm90IG91dCBvZiBib3VuZHNcbiAqIEBwYXJhbSB7TWF0cml4fSBtYXRyaXhcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHtib29sZWFufSBbb3V0ZXJdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1Jvd0luZGV4KG1hdHJpeCwgaW5kZXgsIG91dGVyKSB7XG4gIGxldCBtYXggPSBvdXRlciA/IG1hdHJpeC5yb3dzIDogbWF0cml4LnJvd3MgLSAxO1xuICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gbWF4KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1JvdyBpbmRleCBvdXQgb2YgcmFuZ2UnKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBDaGVjayB0aGF0IGEgY29sdW1uIGluZGV4IGlzIG5vdCBvdXQgb2YgYm91bmRzXG4gKiBAcGFyYW0ge01hdHJpeH0gbWF0cml4XG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW291dGVyXVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tDb2x1bW5JbmRleChtYXRyaXgsIGluZGV4LCBvdXRlcikge1xuICBsZXQgbWF4ID0gb3V0ZXIgPyBtYXRyaXguY29sdW1ucyA6IG1hdHJpeC5jb2x1bW5zIC0gMTtcbiAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IG1heCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDb2x1bW4gaW5kZXggb3V0IG9mIHJhbmdlJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQ2hlY2sgdGhhdCB0aGUgcHJvdmlkZWQgdmVjdG9yIGlzIGFuIGFycmF5IHdpdGggdGhlIHJpZ2h0IGxlbmd0aFxuICogQHBhcmFtIHtNYXRyaXh9IG1hdHJpeFxuICogQHBhcmFtIHtBcnJheXxNYXRyaXh9IHZlY3RvclxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tSb3dWZWN0b3IobWF0cml4LCB2ZWN0b3IpIHtcbiAgaWYgKHZlY3Rvci50bzFEQXJyYXkpIHtcbiAgICB2ZWN0b3IgPSB2ZWN0b3IudG8xREFycmF5KCk7XG4gIH1cbiAgaWYgKHZlY3Rvci5sZW5ndGggIT09IG1hdHJpeC5jb2x1bW5zKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAndmVjdG9yIHNpemUgbXVzdCBiZSB0aGUgc2FtZSBhcyB0aGUgbnVtYmVyIG9mIGNvbHVtbnMnLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHZlY3Rvcjtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQ2hlY2sgdGhhdCB0aGUgcHJvdmlkZWQgdmVjdG9yIGlzIGFuIGFycmF5IHdpdGggdGhlIHJpZ2h0IGxlbmd0aFxuICogQHBhcmFtIHtNYXRyaXh9IG1hdHJpeFxuICogQHBhcmFtIHtBcnJheXxNYXRyaXh9IHZlY3RvclxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tDb2x1bW5WZWN0b3IobWF0cml4LCB2ZWN0b3IpIHtcbiAgaWYgKHZlY3Rvci50bzFEQXJyYXkpIHtcbiAgICB2ZWN0b3IgPSB2ZWN0b3IudG8xREFycmF5KCk7XG4gIH1cbiAgaWYgKHZlY3Rvci5sZW5ndGggIT09IG1hdHJpeC5yb3dzKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ZlY3RvciBzaXplIG11c3QgYmUgdGhlIHNhbWUgYXMgdGhlIG51bWJlciBvZiByb3dzJyk7XG4gIH1cbiAgcmV0dXJuIHZlY3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSW5kaWNlcyhtYXRyaXgsIHJvd0luZGljZXMsIGNvbHVtbkluZGljZXMpIHtcbiAgcmV0dXJuIHtcbiAgICByb3c6IGNoZWNrUm93SW5kaWNlcyhtYXRyaXgsIHJvd0luZGljZXMpLFxuICAgIGNvbHVtbjogY2hlY2tDb2x1bW5JbmRpY2VzKG1hdHJpeCwgY29sdW1uSW5kaWNlcyksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1Jvd0luZGljZXMobWF0cml4LCByb3dJbmRpY2VzKSB7XG4gIGlmICh0eXBlb2Ygcm93SW5kaWNlcyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmV4cGVjdGVkIHR5cGUgZm9yIHJvdyBpbmRpY2VzJyk7XG4gIH1cblxuICBsZXQgcm93T3V0ID0gcm93SW5kaWNlcy5zb21lKChyKSA9PiB7XG4gICAgcmV0dXJuIHIgPCAwIHx8IHIgPj0gbWF0cml4LnJvd3M7XG4gIH0pO1xuXG4gIGlmIChyb3dPdXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigncm93IGluZGljZXMgYXJlIG91dCBvZiByYW5nZScpO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHJvd0luZGljZXMpKSByb3dJbmRpY2VzID0gQXJyYXkuZnJvbShyb3dJbmRpY2VzKTtcblxuICByZXR1cm4gcm93SW5kaWNlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQ29sdW1uSW5kaWNlcyhtYXRyaXgsIGNvbHVtbkluZGljZXMpIHtcbiAgaWYgKHR5cGVvZiBjb2x1bW5JbmRpY2VzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZXhwZWN0ZWQgdHlwZSBmb3IgY29sdW1uIGluZGljZXMnKTtcbiAgfVxuXG4gIGxldCBjb2x1bW5PdXQgPSBjb2x1bW5JbmRpY2VzLnNvbWUoKGMpID0+IHtcbiAgICByZXR1cm4gYyA8IDAgfHwgYyA+PSBtYXRyaXguY29sdW1ucztcbiAgfSk7XG5cbiAgaWYgKGNvbHVtbk91dCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdjb2x1bW4gaW5kaWNlcyBhcmUgb3V0IG9mIHJhbmdlJyk7XG4gIH1cbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbHVtbkluZGljZXMpKSBjb2x1bW5JbmRpY2VzID0gQXJyYXkuZnJvbShjb2x1bW5JbmRpY2VzKTtcblxuICByZXR1cm4gY29sdW1uSW5kaWNlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmFuZ2UobWF0cml4LCBzdGFydFJvdywgZW5kUm93LCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA1KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2V4cGVjdGVkIDQgYXJndW1lbnRzJyk7XG4gIH1cbiAgY2hlY2tOdW1iZXIoJ3N0YXJ0Um93Jywgc3RhcnRSb3cpO1xuICBjaGVja051bWJlcignZW5kUm93JywgZW5kUm93KTtcbiAgY2hlY2tOdW1iZXIoJ3N0YXJ0Q29sdW1uJywgc3RhcnRDb2x1bW4pO1xuICBjaGVja051bWJlcignZW5kQ29sdW1uJywgZW5kQ29sdW1uKTtcbiAgaWYgKFxuICAgIHN0YXJ0Um93ID4gZW5kUm93IHx8XG4gICAgc3RhcnRDb2x1bW4gPiBlbmRDb2x1bW4gfHxcbiAgICBzdGFydFJvdyA8IDAgfHxcbiAgICBzdGFydFJvdyA+PSBtYXRyaXgucm93cyB8fFxuICAgIGVuZFJvdyA8IDAgfHxcbiAgICBlbmRSb3cgPj0gbWF0cml4LnJvd3MgfHxcbiAgICBzdGFydENvbHVtbiA8IDAgfHxcbiAgICBzdGFydENvbHVtbiA+PSBtYXRyaXguY29sdW1ucyB8fFxuICAgIGVuZENvbHVtbiA8IDAgfHxcbiAgICBlbmRDb2x1bW4gPj0gbWF0cml4LmNvbHVtbnNcbiAgKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1N1Ym1hdHJpeCBpbmRpY2VzIGFyZSBvdXQgb2YgcmFuZ2UnKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3QXJyYXkobGVuZ3RoLCB2YWx1ZSA9IDApIHtcbiAgbGV0IGFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJheS5wdXNoKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTnVtYmVyKG5hbWUsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtuYW1lfSBtdXN0IGJlIGEgbnVtYmVyYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTm9uRW1wdHkobWF0cml4KSB7XG4gIGlmIChtYXRyaXguaXNFbXB0eSgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbXB0eSBtYXRyaXggaGFzIG5vIGVsZW1lbnRzIHRvIGluZGV4Jyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFic3RyYWN0TWF0cml4IH0gZnJvbSAnLi4vbWF0cml4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdE1hdHJpeCB7XG4gIGNvbnN0cnVjdG9yKG1hdHJpeCwgcm93cywgY29sdW1ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjaGVja0NvbHVtbkluZGV4IH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCBCYXNlVmlldyBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhDb2x1bW5WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICBjb25zdHJ1Y3RvcihtYXRyaXgsIGNvbHVtbikge1xuICAgIGNoZWNrQ29sdW1uSW5kZXgobWF0cml4LCBjb2x1bW4pO1xuICAgIHN1cGVyKG1hdHJpeCwgbWF0cml4LnJvd3MsIDEpO1xuICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICB9XG5cbiAgc2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIHtcbiAgICB0aGlzLm1hdHJpeC5zZXQocm93SW5kZXgsIHRoaXMuY29sdW1uLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocm93SW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRyaXguZ2V0KHJvd0luZGV4LCB0aGlzLmNvbHVtbik7XG4gIH1cbn1cbiIsImltcG9ydCB7IGNoZWNrQ29sdW1uSW5kaWNlcyB9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQgQmFzZVZpZXcgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4Q29sdW1uU2VsZWN0aW9uVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgY29uc3RydWN0b3IobWF0cml4LCBjb2x1bW5JbmRpY2VzKSB7XG4gICAgY29sdW1uSW5kaWNlcyA9IGNoZWNrQ29sdW1uSW5kaWNlcyhtYXRyaXgsIGNvbHVtbkluZGljZXMpO1xuICAgIHN1cGVyKG1hdHJpeCwgbWF0cml4LnJvd3MsIGNvbHVtbkluZGljZXMubGVuZ3RoKTtcbiAgICB0aGlzLmNvbHVtbkluZGljZXMgPSBjb2x1bW5JbmRpY2VzO1xuICB9XG5cbiAgc2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIHtcbiAgICB0aGlzLm1hdHJpeC5zZXQocm93SW5kZXgsIHRoaXMuY29sdW1uSW5kaWNlc1tjb2x1bW5JbmRleF0sIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChyb3dJbmRleCwgY29sdW1uSW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRyaXguZ2V0KHJvd0luZGV4LCB0aGlzLmNvbHVtbkluZGljZXNbY29sdW1uSW5kZXhdKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeEZsaXBDb2x1bW5WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICBjb25zdHJ1Y3RvcihtYXRyaXgpIHtcbiAgICBzdXBlcihtYXRyaXgsIG1hdHJpeC5yb3dzLCBtYXRyaXguY29sdW1ucyk7XG4gIH1cblxuICBzZXQocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSkge1xuICAgIHRoaXMubWF0cml4LnNldChyb3dJbmRleCwgdGhpcy5jb2x1bW5zIC0gY29sdW1uSW5kZXggLSAxLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocm93SW5kZXgsIGNvbHVtbkluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0cml4LmdldChyb3dJbmRleCwgdGhpcy5jb2x1bW5zIC0gY29sdW1uSW5kZXggLSAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeEZsaXBSb3dWaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICBjb25zdHJ1Y3RvcihtYXRyaXgpIHtcbiAgICBzdXBlcihtYXRyaXgsIG1hdHJpeC5yb3dzLCBtYXRyaXguY29sdW1ucyk7XG4gIH1cblxuICBzZXQocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSkge1xuICAgIHRoaXMubWF0cml4LnNldCh0aGlzLnJvd3MgLSByb3dJbmRleCAtIDEsIGNvbHVtbkluZGV4LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocm93SW5kZXgsIGNvbHVtbkluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0cml4LmdldCh0aGlzLnJvd3MgLSByb3dJbmRleCAtIDEsIGNvbHVtbkluZGV4KTtcbiAgfVxufVxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXRyaXhDb2x1bW5WaWV3IH0gZnJvbSAnLi9jb2x1bW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXRyaXhDb2x1bW5TZWxlY3Rpb25WaWV3IH0gZnJvbSAnLi9jb2x1bW5TZWxlY3Rpb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXRyaXhGbGlwQ29sdW1uVmlldyB9IGZyb20gJy4vZmxpcENvbHVtbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE1hdHJpeEZsaXBSb3dWaWV3IH0gZnJvbSAnLi9mbGlwUm93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4Um93VmlldyB9IGZyb20gJy4vcm93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4Um93U2VsZWN0aW9uVmlldyB9IGZyb20gJy4vcm93U2VsZWN0aW9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4U2VsZWN0aW9uVmlldyB9IGZyb20gJy4vc2VsZWN0aW9uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4U3ViVmlldyB9IGZyb20gJy4vc3ViJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4VHJhbnNwb3NlVmlldyB9IGZyb20gJy4vdHJhbnNwb3NlJztcbiIsImltcG9ydCB7IGNoZWNrUm93SW5kZXggfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeFJvd1ZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gIGNvbnN0cnVjdG9yKG1hdHJpeCwgcm93KSB7XG4gICAgY2hlY2tSb3dJbmRleChtYXRyaXgsIHJvdyk7XG4gICAgc3VwZXIobWF0cml4LCAxLCBtYXRyaXguY29sdW1ucyk7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gIH1cblxuICBzZXQocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSkge1xuICAgIHRoaXMubWF0cml4LnNldCh0aGlzLnJvdywgY29sdW1uSW5kZXgsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChyb3dJbmRleCwgY29sdW1uSW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRyaXguZ2V0KHRoaXMucm93LCBjb2x1bW5JbmRleCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGNoZWNrUm93SW5kaWNlcyB9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQgQmFzZVZpZXcgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4Um93U2VsZWN0aW9uVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgY29uc3RydWN0b3IobWF0cml4LCByb3dJbmRpY2VzKSB7XG4gICAgcm93SW5kaWNlcyA9IGNoZWNrUm93SW5kaWNlcyhtYXRyaXgsIHJvd0luZGljZXMpO1xuICAgIHN1cGVyKG1hdHJpeCwgcm93SW5kaWNlcy5sZW5ndGgsIG1hdHJpeC5jb2x1bW5zKTtcbiAgICB0aGlzLnJvd0luZGljZXMgPSByb3dJbmRpY2VzO1xuICB9XG5cbiAgc2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIHtcbiAgICB0aGlzLm1hdHJpeC5zZXQodGhpcy5yb3dJbmRpY2VzW3Jvd0luZGV4XSwgY29sdW1uSW5kZXgsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChyb3dJbmRleCwgY29sdW1uSW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRyaXguZ2V0KHRoaXMucm93SW5kaWNlc1tyb3dJbmRleF0sIGNvbHVtbkluZGV4KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgY2hlY2tJbmRpY2VzIH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCBCYXNlVmlldyBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhTZWxlY3Rpb25WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICBjb25zdHJ1Y3RvcihtYXRyaXgsIHJvd0luZGljZXMsIGNvbHVtbkluZGljZXMpIHtcbiAgICBsZXQgaW5kaWNlcyA9IGNoZWNrSW5kaWNlcyhtYXRyaXgsIHJvd0luZGljZXMsIGNvbHVtbkluZGljZXMpO1xuICAgIHN1cGVyKG1hdHJpeCwgaW5kaWNlcy5yb3cubGVuZ3RoLCBpbmRpY2VzLmNvbHVtbi5sZW5ndGgpO1xuICAgIHRoaXMucm93SW5kaWNlcyA9IGluZGljZXMucm93O1xuICAgIHRoaXMuY29sdW1uSW5kaWNlcyA9IGluZGljZXMuY29sdW1uO1xuICB9XG5cbiAgc2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIHtcbiAgICB0aGlzLm1hdHJpeC5zZXQoXG4gICAgICB0aGlzLnJvd0luZGljZXNbcm93SW5kZXhdLFxuICAgICAgdGhpcy5jb2x1bW5JbmRpY2VzW2NvbHVtbkluZGV4XSxcbiAgICAgIHZhbHVlLFxuICAgICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocm93SW5kZXgsIGNvbHVtbkluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0cml4LmdldChcbiAgICAgIHRoaXMucm93SW5kaWNlc1tyb3dJbmRleF0sXG4gICAgICB0aGlzLmNvbHVtbkluZGljZXNbY29sdW1uSW5kZXhdLFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGNoZWNrUmFuZ2UgfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeFN1YlZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gIGNvbnN0cnVjdG9yKG1hdHJpeCwgc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2x1bW4sIGVuZENvbHVtbikge1xuICAgIGNoZWNrUmFuZ2UobWF0cml4LCBzdGFydFJvdywgZW5kUm93LCBzdGFydENvbHVtbiwgZW5kQ29sdW1uKTtcbiAgICBzdXBlcihtYXRyaXgsIGVuZFJvdyAtIHN0YXJ0Um93ICsgMSwgZW5kQ29sdW1uIC0gc3RhcnRDb2x1bW4gKyAxKTtcbiAgICB0aGlzLnN0YXJ0Um93ID0gc3RhcnRSb3c7XG4gICAgdGhpcy5zdGFydENvbHVtbiA9IHN0YXJ0Q29sdW1uO1xuICB9XG5cbiAgc2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIHtcbiAgICB0aGlzLm1hdHJpeC5zZXQoXG4gICAgICB0aGlzLnN0YXJ0Um93ICsgcm93SW5kZXgsXG4gICAgICB0aGlzLnN0YXJ0Q29sdW1uICsgY29sdW1uSW5kZXgsXG4gICAgICB2YWx1ZSxcbiAgICApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCkge1xuICAgIHJldHVybiB0aGlzLm1hdHJpeC5nZXQoXG4gICAgICB0aGlzLnN0YXJ0Um93ICsgcm93SW5kZXgsXG4gICAgICB0aGlzLnN0YXJ0Q29sdW1uICsgY29sdW1uSW5kZXgsXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeFRyYW5zcG9zZVZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gIGNvbnN0cnVjdG9yKG1hdHJpeCkge1xuICAgIHN1cGVyKG1hdHJpeCwgbWF0cml4LmNvbHVtbnMsIG1hdHJpeC5yb3dzKTtcbiAgfVxuXG4gIHNldChyb3dJbmRleCwgY29sdW1uSW5kZXgsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXRyaXguc2V0KGNvbHVtbkluZGV4LCByb3dJbmRleCwgdmFsdWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCkge1xuICAgIHJldHVybiB0aGlzLm1hdHJpeC5nZXQoY29sdW1uSW5kZXgsIHJvd0luZGV4KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQWJzdHJhY3RNYXRyaXggfSBmcm9tICcuLi9tYXRyaXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcmFwcGVyTWF0cml4MUQgZXh0ZW5kcyBBYnN0cmFjdE1hdHJpeCB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgcm93cyA9IDEgfSA9IG9wdGlvbnM7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggJSByb3dzICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBkYXRhIGxlbmd0aCBpcyBub3QgZGl2aXNpYmxlIGJ5IHRoZSBudW1iZXIgb2Ygcm93cycpO1xuICAgIH1cbiAgICBzdXBlcigpO1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2x1bW5zID0gZGF0YS5sZW5ndGggLyByb3dzO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBzZXQocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuX2NhbGN1bGF0ZUluZGV4KHJvd0luZGV4LCBjb2x1bW5JbmRleCk7XG4gICAgdGhpcy5kYXRhW2luZGV4XSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KHJvd0luZGV4LCBjb2x1bW5JbmRleCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuX2NhbGN1bGF0ZUluZGV4KHJvd0luZGV4LCBjb2x1bW5JbmRleCk7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtpbmRleF07XG4gIH1cblxuICBfY2FsY3VsYXRlSW5kZXgocm93LCBjb2x1bW4pIHtcbiAgICByZXR1cm4gcm93ICogdGhpcy5jb2x1bW5zICsgY29sdW1uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBYnN0cmFjdE1hdHJpeCB9IGZyb20gJy4uL21hdHJpeCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyYXBwZXJNYXRyaXgyRCBleHRlbmRzIEFic3RyYWN0TWF0cml4IHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJvd3MgPSBkYXRhLmxlbmd0aDtcbiAgICB0aGlzLmNvbHVtbnMgPSBkYXRhWzBdLmxlbmd0aDtcbiAgfVxuXG4gIHNldChyb3dJbmRleCwgY29sdW1uSW5kZXgsIHZhbHVlKSB7XG4gICAgdGhpcy5kYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldChyb3dJbmRleCwgY29sdW1uSW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF07XG4gIH1cbn1cbiIsImltcG9ydCBXcmFwcGVyTWF0cml4MUQgZnJvbSAnLi9XcmFwcGVyTWF0cml4MUQnO1xuaW1wb3J0IFdyYXBwZXJNYXRyaXgyRCBmcm9tICcuL1dyYXBwZXJNYXRyaXgyRCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGFycmF5LCBvcHRpb25zKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgIGlmIChhcnJheVswXSAmJiBBcnJheS5pc0FycmF5KGFycmF5WzBdKSkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGVyTWF0cml4MkQoYXJyYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwZXJNYXRyaXgxRChhcnJheSwgb3B0aW9ucyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhlIGFyZ3VtZW50IGlzIG5vdCBhbiBhcnJheScpO1xuICB9XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbnlRdWV1ZSB7XG4gICAgY29uc3RydWN0b3IoZGF0YSA9IFtdLCBjb21wYXJlID0gZGVmYXVsdENvbXBhcmUpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlO1xuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAodGhpcy5sZW5ndGggPj4gMSkgLSAxOyBpID49IDA7IGktLSkgdGhpcy5fZG93bihpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1c2goaXRlbSkge1xuICAgICAgICB0aGlzLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgdGhpcy5fdXAodGhpcy5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICBwb3AoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmRhdGFbMF07XG4gICAgICAgIGNvbnN0IGJvdHRvbSA9IHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgdGhpcy5sZW5ndGgtLTtcblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0gPSBib3R0b207XG4gICAgICAgICAgICB0aGlzLl9kb3duKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvcDtcbiAgICB9XG5cbiAgICBwZWVrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICAgIH1cblxuICAgIF91cChwb3MpIHtcbiAgICAgICAgY29uc3Qge2RhdGEsIGNvbXBhcmV9ID0gdGhpcztcbiAgICAgICAgY29uc3QgaXRlbSA9IGRhdGFbcG9zXTtcblxuICAgICAgICB3aGlsZSAocG9zID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gKHBvcyAtIDEpID4+IDE7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gZGF0YVtwYXJlbnRdO1xuICAgICAgICAgICAgaWYgKGNvbXBhcmUoaXRlbSwgY3VycmVudCkgPj0gMCkgYnJlYWs7XG4gICAgICAgICAgICBkYXRhW3Bvc10gPSBjdXJyZW50O1xuICAgICAgICAgICAgcG9zID0gcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YVtwb3NdID0gaXRlbTtcbiAgICB9XG5cbiAgICBfZG93bihwb3MpIHtcbiAgICAgICAgY29uc3Qge2RhdGEsIGNvbXBhcmV9ID0gdGhpcztcbiAgICAgICAgY29uc3QgaGFsZkxlbmd0aCA9IHRoaXMubGVuZ3RoID4+IDE7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW3Bvc107XG5cbiAgICAgICAgd2hpbGUgKHBvcyA8IGhhbGZMZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBsZWZ0ID0gKHBvcyA8PCAxKSArIDE7XG4gICAgICAgICAgICBsZXQgYmVzdCA9IGRhdGFbbGVmdF07XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGxlZnQgKyAxO1xuXG4gICAgICAgICAgICBpZiAocmlnaHQgPCB0aGlzLmxlbmd0aCAmJiBjb21wYXJlKGRhdGFbcmlnaHRdLCBiZXN0KSA8IDApIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgYmVzdCA9IGRhdGFbcmlnaHRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbXBhcmUoYmVzdCwgaXRlbSkgPj0gMCkgYnJlYWs7XG5cbiAgICAgICAgICAgIGRhdGFbcG9zXSA9IGJlc3Q7XG4gICAgICAgICAgICBwb3MgPSBsZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YVtwb3NdID0gaXRlbTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDA7XG59XG4iLCJjb25zdCB7TWF0cml4LCBpbnZlcnNlfSA9IHJlcXVpcmUoJ21sLW1hdHJpeCcpO1xuY29uc3Qge3NvbHZlSG9tb2dyYXBoeX0gPSByZXF1aXJlKCcuLi91dGlscy9ob21vZ3JhcGh5Jyk7XG5cbi8vIGJ1aWxkIHdvcmxkIG1hdHJpeCB3aXRoIGxpc3Qgb2YgbWF0Y2hpbmcgd29ybGRDb29yZHN8c2NyZWVuQ29vcmRzXG4vL1xuLy8gU3RlcCAxLiBlc3RpbWF0ZSBob21vZ3JhcGh5IHdpdGggbGlzdCBvZiBwYWlyc1xuLy8gUmVmOiBodHRwczovL3d3dy51aW8ubm8vc3R1ZGllci9lbW5lci9tYXRuYXQvaXRzL1RFSzUwMzAvdjE5L2xlY3QvbGVjdHVyZV80XzMtZXN0aW1hdGluZy1ob21vZ3JhcGhpZXMtZnJvbS1mZWF0dXJlLWNvcnJlc3BvbmRlbmNlcy5wZGYgIChCYXNpYyBob21vZ3JhcGh5IGVzdGltYXRpb24gZnJvbSBwb2ludHMpXG4vL1xuLy8gU3RlcCAyLiBkZWNvbXBvc2UgaG9tb2dyYXBoeSBpbnRvIHJvdGF0aW9uIGFuZCB0cmFuc2xhdGlvbiBtYXRyaXhlcyAoaS5lLiB3b3JsZCBtYXRyaXgpXG4vLyBSZWY6IGNhbiBhbnlvbmUgcHJvdmlkZSByZWZlcmVuY2U/XG5jb25zdCBlc3RpbWF0ZSA9ICh7c2NyZWVuQ29vcmRzLCB3b3JsZENvb3JkcywgcHJvamVjdGlvblRyYW5zZm9ybX0pID0+IHtcbiAgY29uc3QgSGFycmF5ID0gc29sdmVIb21vZ3JhcGh5KHdvcmxkQ29vcmRzLm1hcCgocCkgPT4gW3AueCwgcC55XSksIHNjcmVlbkNvb3Jkcy5tYXAoKHApID0+IFtwLngsIHAueV0pKTtcbiAgY29uc3QgSCA9IG5ldyBNYXRyaXgoW1xuICAgIFtIYXJyYXlbMF0sIEhhcnJheVsxXSwgSGFycmF5WzJdXSxcbiAgICBbSGFycmF5WzNdLCBIYXJyYXlbNF0sIEhhcnJheVs1XV0sXG4gICAgW0hhcnJheVs2XSwgSGFycmF5WzddLCBIYXJyYXlbOF1dLFxuICBdKTtcblxuICBjb25zdCBLID0gbmV3IE1hdHJpeChwcm9qZWN0aW9uVHJhbnNmb3JtKTtcbiAgY29uc3QgS0ludiA9IGludmVyc2UoSyk7XG5cbiAgY29uc3QgX0tJbnZIID0gS0ludi5tbXVsKEgpO1xuICBjb25zdCBLSW52SCA9IF9LSW52SC50bzFEQXJyYXkoKTtcblxuICBjb25zdCBub3JtMSA9IE1hdGguc3FydCggS0ludkhbMF0gKiBLSW52SFswXSArIEtJbnZIWzNdICogS0ludkhbM10gKyBLSW52SFs2XSAqIEtJbnZIWzZdKTtcbiAgY29uc3Qgbm9ybTIgPSBNYXRoLnNxcnQoIEtJbnZIWzFdICogS0ludkhbMV0gKyBLSW52SFs0XSAqIEtJbnZIWzRdICsgS0ludkhbN10gKiBLSW52SFs3XSk7XG4gIGNvbnN0IHRub3JtID0gKG5vcm0xICsgbm9ybTIpIC8gMjtcblxuICBjb25zdCByb3RhdGUgPSBbXTtcbiAgcm90YXRlWzBdID0gS0ludkhbMF0gLyBub3JtMTtcbiAgcm90YXRlWzNdID0gS0ludkhbM10gLyBub3JtMTtcbiAgcm90YXRlWzZdID0gS0ludkhbNl0gLyBub3JtMTtcblxuICByb3RhdGVbMV0gPSBLSW52SFsxXSAvIG5vcm0yO1xuICByb3RhdGVbNF0gPSBLSW52SFs0XSAvIG5vcm0yO1xuICByb3RhdGVbN10gPSBLSW52SFs3XSAvIG5vcm0yO1xuXG4gIHJvdGF0ZVsyXSA9IHJvdGF0ZVszXSAqIHJvdGF0ZVs3XSAtIHJvdGF0ZVs2XSAqIHJvdGF0ZVs0XTtcbiAgcm90YXRlWzVdID0gcm90YXRlWzZdICogcm90YXRlWzFdIC0gcm90YXRlWzBdICogcm90YXRlWzddO1xuICByb3RhdGVbOF0gPSByb3RhdGVbMF0gKiByb3RhdGVbNF0gLSByb3RhdGVbMV0gKiByb3RhdGVbM107XG5cbiAgY29uc3Qgbm9ybTMgPSBNYXRoLnNxcnQocm90YXRlWzJdICogcm90YXRlWzJdICsgcm90YXRlWzVdICogcm90YXRlWzVdICsgcm90YXRlWzhdICogcm90YXRlWzhdKTtcbiAgcm90YXRlWzJdIC89IG5vcm0zO1xuICByb3RhdGVbNV0gLz0gbm9ybTM7XG4gIHJvdGF0ZVs4XSAvPSBub3JtMztcblxuICAvLyBUT0RPOiBhcnRvb2xraXQgaGFzIGNoZWNrX3JvdGF0aW9uKCkgdGhhdCBzb21laG93IHN3aXRjaCB0aGUgcm90YXRlIHZlY3Rvci4gbm90IHN1cmUgd2hhdCB0aGF0IGRvZXMuIENhbiBhbnlvbmUgYWR2aWNlP1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXJ0b29sa2l0eC9hcnRvb2xraXQ1L2Jsb2IvNWJmMGI2NzFmZjE2ZWFkNTI3YjliODkyZTZhZWIxYTI3NzFmOTdiZS9saWIvU1JDL0FSSUNQL2ljcFV0aWwuYyNMMjE1XG5cbiAgY29uc3QgdHJhbiA9IFtdXG4gIHRyYW5bMF0gPSBLSW52SFsyXSAvIHRub3JtO1xuICB0cmFuWzFdID0gS0ludkhbNV0gLyB0bm9ybTtcbiAgdHJhblsyXSA9IEtJbnZIWzhdIC8gdG5vcm07XG5cbiAgbGV0IGluaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm0gPSBbXG4gICAgW3JvdGF0ZVswXSwgcm90YXRlWzFdLCByb3RhdGVbMl0sIHRyYW5bMF1dLFxuICAgIFtyb3RhdGVbM10sIHJvdGF0ZVs0XSwgcm90YXRlWzVdLCB0cmFuWzFdXSxcbiAgICBbcm90YXRlWzZdLCByb3RhdGVbN10sIHJvdGF0ZVs4XSwgdHJhblsyXV1cbiAgXTtcblxuICByZXR1cm4gaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlc3RpbWF0ZVxufVxuIiwiY29uc3Qge2VzdGltYXRlfSA9IHJlcXVpcmUoJy4vZXN0aW1hdGUuanMnKTtcbmNvbnN0IHtyZWZpbmVFc3RpbWF0ZX0gPSByZXF1aXJlKCcuL3JlZmluZS1lc3RpbWF0ZS5qcycpO1xuXG5jbGFzcyBFc3RpbWF0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcm9qZWN0aW9uVHJhbnNmb3JtKSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uVHJhbnNmb3JtID0gcHJvamVjdGlvblRyYW5zZm9ybTtcbiAgfVxuXG4gIC8vIFNvbHZlIGhvbW9ncmFwaHkgYmV0d2VlbiBzY3JlZW4gcG9pbnRzIGFuZCB3b3JsZCBwb2ludHMgdXNpbmcgRGlyZWN0IExpbmVhciBUcmFuc2Zvcm1hdGlvblxuICAvLyB0aGVuIGRlY29tcG9zZSBob21vZ3JhcGh5IGludG8gcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uIG1hdHJpeCAoaS5lLiBtb2RlbFZpZXdUcmFuc2Zvcm0pXG4gIGVzdGltYXRlKHtzY3JlZW5Db29yZHMsIHdvcmxkQ29vcmRzfSkge1xuICAgIGNvbnN0IG1vZGVsVmlld1RyYW5zZm9ybSA9IGVzdGltYXRlKHtzY3JlZW5Db29yZHMsIHdvcmxkQ29vcmRzLCBwcm9qZWN0aW9uVHJhbnNmb3JtOiB0aGlzLnByb2plY3Rpb25UcmFuc2Zvcm19KTtcbiAgICByZXR1cm4gbW9kZWxWaWV3VHJhbnNmb3JtO1xuICB9XG5cbiAgLy8gR2l2ZW4gYW4gaW5pdGlhbCBndWVzcyBvZiB0aGUgbW9kZWxWaWV3VHJhbnNmb3JtIGFuZCBuZXcgcGFpcnMgb2Ygc2NyZWVuLXdvcmxkIGNvb3JkaW5hdGVzLCBcbiAgLy8gdXNlIEl0ZXJhdGl2ZSBDbG9zZXN0IFBvaW50IHRvIHJlZmluZSB0aGUgdHJhbnNmb3JtYXRpb25cbiAgLy9yZWZpbmVFc3RpbWF0ZSh7aW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybSwgc2NyZWVuQ29vcmRzLCB3b3JsZENvb3Jkc30pIHtcbiAgcmVmaW5lRXN0aW1hdGUoe2luaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm0sIHdvcmxkQ29vcmRzLCBzY3JlZW5Db29yZHN9KSB7XG4gICAgY29uc3QgdXBkYXRlZE1vZGVsVmlld1RyYW5zZm9ybSA9IHJlZmluZUVzdGltYXRlKHtpbml0aWFsTW9kZWxWaWV3VHJhbnNmb3JtLCB3b3JsZENvb3Jkcywgc2NyZWVuQ29vcmRzLCBwcm9qZWN0aW9uVHJhbnNmb3JtOiB0aGlzLnByb2plY3Rpb25UcmFuc2Zvcm19KTtcbiAgICByZXR1cm4gdXBkYXRlZE1vZGVsVmlld1RyYW5zZm9ybTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRXN0aW1hdG9yLFxufVxuIiwiY29uc3Qge01hdHJpeCwgaW52ZXJzZX0gPSByZXF1aXJlKCdtbC1tYXRyaXgnKTtcbmNvbnN0IHtub3JtYWxpemVQb2ludHMsIGFwcGx5TW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSwgYnVpbGRNb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtLCBjb21wdXRlU2NyZWVuQ29vcmRpYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcblxuY29uc3QgVFJBQ0tJTkdfVEhSRVNIID0gNS4wOyAvLyBkZWZhdWx0XG5jb25zdCBLMl9GQUNUT1IgPSA0LjA7IC8vIFF1ZXN0aW9uOiBzaG91bGQgaXQgYmUgcmVsYXRpdmUgdG8gdGhlIHNpemUgb2YgdGhlIHNjcmVlbiBpbnN0ZWFkIG9mIGhhcmRjb2RlZD9cbmNvbnN0IElDUF9NQVhfTE9PUCA9IDEwO1xuY29uc3QgSUNQX0JSRUFLX0xPT1BfRVJST1JfVEhSRVNIID0gMC4xO1xuY29uc3QgSUNQX0JSRUFLX0xPT1BfRVJST1JfUkFUSU9fVEhSRVNIID0gMC45OTtcbmNvbnN0IElDUF9CUkVBS19MT09QX0VSUk9SX1RIUkVTSDIgPSA0LjA7XG5cbi8vIHNvbWUgdGVtcG9yYXJ5L2ludGVybWVkaWF0ZSB2YXJpYWJsZXMgdXNlZCBsYXRlci4gRGVjbGFyZSB0aGVtIGJlZm9yZWhhbmQgdG8gcmVkdWNlIG5ldyBvYmplY3QgYWxsb2NhdGlvbnNcbmxldCBtYXQgPSBbW10sW10sW11dOyBcbmxldCBKX1VfWGMgPSBbW10sW11dOyAvLyAyeDNcbmxldCBKX1hjX1MgPSBbW10sW10sW11dOyAvLyAzeDZcblxuY29uc3QgcmVmaW5lRXN0aW1hdGUgPSAoe2luaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm0sIHByb2plY3Rpb25UcmFuc2Zvcm0sIHdvcmxkQ29vcmRzLCBzY3JlZW5Db29yZHN9KSA9PiB7XG4gIC8vIFF1ZXN0aW9uOiBzaGFsbCB3ZSBub3JtbGl6ZSB0aGUgc2NyZWVuIGNvb3JkcyBhcyB3ZWxsP1xuICAvLyBRdWVzdGlvbjogZG8gd2UgbmVlZCB0byBub3JtbGl6ZSB0aGUgc2NhbGUgYXMgd2VsbCwgaS5lLiBtYWtlIGNvb3JkcyBmcm9tIC0xIHRvIDFcbiAgLy9cbiAgLy8gbm9ybWFsaXplIHdvcmxkIGNvb3JkcyAtIHJlcG9zaXRpb24gdGhlbSB0byBjZW50ZXIgb2YgbWFzc1xuICAvLyAgIGFzc3VtZSB6IGNvb3JkaW5hdGUgaXMgYWx3YXlzIHplcm8gKGluIG91ciBjYXNlLCB0aGUgaW1hZ2UgdGFyZ2V0IGlzIHBsYW5hciB3aXRoIHogPSAwXG4gIGxldCBkeCA9IDA7XG4gIGxldCBkeSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd29ybGRDb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBkeCArPSB3b3JsZENvb3Jkc1tpXS54O1xuICAgIGR5ICs9IHdvcmxkQ29vcmRzW2ldLnk7XG4gIH1cbiAgZHggLz0gd29ybGRDb29yZHMubGVuZ3RoO1xuICBkeSAvPSB3b3JsZENvb3Jkcy5sZW5ndGg7XG5cbiAgY29uc3Qgbm9ybWFsaXplZFdvcmxkQ29vcmRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd29ybGRDb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBub3JtYWxpemVkV29ybGRDb29yZHMucHVzaCh7eDogd29ybGRDb29yZHNbaV0ueCAtIGR4LCB5OiB3b3JsZENvb3Jkc1tpXS55IC0gZHksIHo6IHdvcmxkQ29vcmRzW2ldLnp9KTtcbiAgfVxuXG4gIGNvbnN0IGRpZmZNb2RlbFZpZXdUcmFuc2Zvcm0gPSBbW10sW10sW11dO1xuICBmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBkaWZmTW9kZWxWaWV3VHJhbnNmb3JtW2pdW2ldID0gaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybVtqXVtpXTtcbiAgICB9XG4gIH1cbiAgZGlmZk1vZGVsVmlld1RyYW5zZm9ybVswXVszXSA9IGluaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMF1bMF0gKiBkeCArIGluaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMF1bMV0gKiBkeSArIGluaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMF1bM107XG4gIGRpZmZNb2RlbFZpZXdUcmFuc2Zvcm1bMV1bM10gPSBpbml0aWFsTW9kZWxWaWV3VHJhbnNmb3JtWzFdWzBdICogZHggKyBpbml0aWFsTW9kZWxWaWV3VHJhbnNmb3JtWzFdWzFdICogZHkgKyBpbml0aWFsTW9kZWxWaWV3VHJhbnNmb3JtWzFdWzNdO1xuICBkaWZmTW9kZWxWaWV3VHJhbnNmb3JtWzJdWzNdID0gaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybVsyXVswXSAqIGR4ICsgaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybVsyXVsxXSAqIGR5ICsgaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybVsyXVszXTtcblxuICAvLyB1c2UgaXRlcmF0aXZlIGNsb3Nlc3QgcG9pbnQgYWxnb3JpdGhtIHRvIHJlZmluZSB0aGUgbW9kZWxWaWV3VHJhbnNmb3JtXG4gIGNvbnN0IGlubGllclByb2JzID0gWzEuMCwgMC44LCAwLjYsIDAuNCwgMC4wXTtcbiAgbGV0IHVwZGF0ZWRNb2RlbFZpZXdUcmFuc2Zvcm0gPSBkaWZmTW9kZWxWaWV3VHJhbnNmb3JtOyAvLyBpdGVyYXRpdmVseSB1cGRhdGUgdGhpcyB0cmFuc2Zvcm1cbiAgbGV0IGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmxpZXJQcm9icy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJldCA9IF9kb0lDUCh7aW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybTogdXBkYXRlZE1vZGVsVmlld1RyYW5zZm9ybSwgcHJvamVjdGlvblRyYW5zZm9ybSwgd29ybGRDb29yZHM6IG5vcm1hbGl6ZWRXb3JsZENvb3Jkcywgc2NyZWVuQ29vcmRzLCBpbmxpZXJQcm9iOiBpbmxpZXJQcm9ic1tpXX0pO1xuXG4gICAgdXBkYXRlZE1vZGVsVmlld1RyYW5zZm9ybSA9IHJldC5tb2RlbFZpZXdUcmFuc2Zvcm07XG5cbiAgICAvL2NvbnNvbGUubG9nKFwiZXJyXCIsIHJldC5lcnIpO1xuXG4gICAgaWYgKHJldC5lcnIgPCBUUkFDS0lOR19USFJFU0gpIHtcbiAgICAgIGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtID0gdXBkYXRlZE1vZGVsVmlld1RyYW5zZm9ybTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmaW5hbE1vZGVsVmlld1RyYW5zZm9ybSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gZGUtbm9ybWFsaXplXG4gIGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtWzBdWzNdID0gZmluYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMF1bM10gLSBmaW5hbE1vZGVsVmlld1RyYW5zZm9ybVswXVswXSAqIGR4IC0gZmluYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMF1bMV0gKiBkeTtcbiAgZmluYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMV1bM10gPSBmaW5hbE1vZGVsVmlld1RyYW5zZm9ybVsxXVszXSAtIGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtWzFdWzBdICogZHggLSBmaW5hbE1vZGVsVmlld1RyYW5zZm9ybVsxXVsxXSAqIGR5O1xuICBmaW5hbE1vZGVsVmlld1RyYW5zZm9ybVsyXVszXSA9IGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtWzJdWzNdIC0gZmluYWxNb2RlbFZpZXdUcmFuc2Zvcm1bMl1bMF0gKiBkeCAtIGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtWzJdWzFdICogZHk7XG5cbiAgcmV0dXJuIGZpbmFsTW9kZWxWaWV3VHJhbnNmb3JtO1xufVxuXG4vLyBJQ1AgaXRlcmF0aW9uXG4vLyBRdWVzdGlvbjogY2FuIHNvbWVvbmUgcHJvdmlkZSB0aGVvcmV0aWNhbCByZWZlcmVuY2UgLyBtYXRoZW1hdGljYWwgcHJvb2YgZm9yIHRoZSBmb2xsb3dpbmcgY29tcHV0YXRpb25zP1xuY29uc3QgX2RvSUNQID0gKHtpbml0aWFsTW9kZWxWaWV3VHJhbnNmb3JtLCBwcm9qZWN0aW9uVHJhbnNmb3JtLCB3b3JsZENvb3Jkcywgc2NyZWVuQ29vcmRzLCBpbmxpZXJQcm9ifSkgPT4ge1xuICBjb25zdCBpc1JvYnVzdE1vZGUgPSBpbmxpZXJQcm9iIDwgMTtcblxuICBsZXQgbW9kZWxWaWV3VHJhbnNmb3JtID0gaW5pdGlhbE1vZGVsVmlld1RyYW5zZm9ybTtcblxuICBsZXQgZXJyMCA9IDAuMDtcbiAgbGV0IGVycjEgPSAwLjA7XG5cbiAgbGV0IEUgPSBuZXcgQXJyYXkod29ybGRDb29yZHMubGVuZ3RoKTtcbiAgbGV0IEUyID0gbmV3IEFycmF5KHdvcmxkQ29vcmRzLmxlbmd0aCk7XG4gIGxldCBkeHMgPSBuZXcgQXJyYXkod29ybGRDb29yZHMubGVuZ3RoKTtcbiAgbGV0IGR5cyA9IG5ldyBBcnJheSh3b3JsZENvb3Jkcy5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGwgPSAwOyBsIDw9IElDUF9NQVhfTE9PUDsgbCsrKSB7XG4gICAgY29uc3QgbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSA9IGJ1aWxkTW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybShwcm9qZWN0aW9uVHJhbnNmb3JtLCBtb2RlbFZpZXdUcmFuc2Zvcm0pO1xuXG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCB3b3JsZENvb3Jkcy5sZW5ndGg7IG4rKykge1xuICAgICAgY29uc3QgdSA9IGNvbXB1dGVTY3JlZW5Db29yZGlhdGUobW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSwgd29ybGRDb29yZHNbbl0ueCwgd29ybGRDb29yZHNbbl0ueSwgd29ybGRDb29yZHNbbl0ueik7XG4gICAgICBjb25zdCBkeCA9IHNjcmVlbkNvb3Jkc1tuXS54IC0gdS54O1xuICAgICAgY29uc3QgZHkgPSBzY3JlZW5Db29yZHNbbl0ueSAtIHUueTtcblxuICAgICAgZHhzW25dID0gZHg7XG4gICAgICBkeXNbbl0gPSBkeTtcbiAgICAgIEVbbl0gPSAoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH1cblxuICAgIGxldCBLMjsgLy8gcm9idXN0IG1vZGUgb25seVxuICAgIGVycjEgPSAwLjA7XG4gICAgaWYgKGlzUm9idXN0TW9kZSkge1xuICAgICAgY29uc3QgaW5saWVyTnVtID0gTWF0aC5tYXgoMywgTWF0aC5mbG9vcih3b3JsZENvb3Jkcy5sZW5ndGggKiBpbmxpZXJQcm9iKSAtIDEpO1xuICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCB3b3JsZENvb3Jkcy5sZW5ndGg7IG4rKykge1xuICAgICAgICBFMltuXSA9IEVbbl07XG4gICAgICB9XG4gICAgICBFMi5zb3J0KChhLCBiKSA9PiB7cmV0dXJuIGEtYjt9KTtcblxuICAgICAgSzIgPSBNYXRoLm1heChFMltpbmxpZXJOdW1dICogSzJfRkFDVE9SLCAxNi4wKTtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgd29ybGRDb29yZHMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgaWYgKEUyW25dID4gSzIpIGVycjEgKz0gSzIvIDY7XG4gICAgICAgIGVsc2UgZXJyMSArPSAgSzIvNi4wICogKDEuMCAtICgxLjAtRTJbbl0vSzIpKigxLjAtRTJbbl0vSzIpKigxLjAtRTJbbl0vSzIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCB3b3JsZENvb3Jkcy5sZW5ndGg7IG4rKykge1xuICAgICAgICBlcnIxICs9IEVbbl07XG4gICAgICB9XG4gICAgfVxuICAgIGVycjEgLz0gd29ybGRDb29yZHMubGVuZ3RoO1xuXG4gICAgLy9jb25zb2xlLmxvZyhcImljcCBsb29wXCIsIGlubGllclByb2IsIGwsIGVycjEpO1xuXG4gICAgaWYgKGVycjEgPCBJQ1BfQlJFQUtfTE9PUF9FUlJPUl9USFJFU0gpIGJyZWFrO1xuICAgIC8vaWYgKGwgPiAwICYmIGVycjEgPCBJQ1BfQlJFQUtfTE9PUF9FUlJPUl9USFJFU0gyICYmIGVycjEvZXJyMCA+IElDUF9CUkVBS19MT09QX0VSUk9SX1JBVElPX1RIUkVTSCkgYnJlYWs7XG4gICAgaWYgKGwgPiAwICYmIGVycjEvZXJyMCA+IElDUF9CUkVBS19MT09QX0VSUk9SX1JBVElPX1RIUkVTSCkgYnJlYWs7XG4gICAgaWYgKGwgPT09IElDUF9NQVhfTE9PUCkgYnJlYWs7XG5cbiAgICBlcnIwID0gZXJyMTtcblxuICAgIGNvbnN0IGRVID0gW107XG4gICAgY29uc3QgYWxsSl9VX1MgPSBbXTtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IHdvcmxkQ29vcmRzLmxlbmd0aDsgbisrKSB7XG4gICAgICBpZiAoaXNSb2J1c3RNb2RlICYmIEVbbl0gPiBLMikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgSl9VX1MgPSBfZ2V0Sl9VX1Moe21vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0sIG1vZGVsVmlld1RyYW5zZm9ybSwgcHJvamVjdGlvblRyYW5zZm9ybSwgd29ybGRDb29yZDogd29ybGRDb29yZHNbbl19KTtcblxuICAgICAgaWYgKGlzUm9idXN0TW9kZSkge1xuICAgICAgICBjb25zdCBXID0gKDEuMCAtIEVbbl0vSzIpKigxLjAgLSBFW25dL0syKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDI7IGorKykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBKX1VfU1tqXVtpXSAqPSBXO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkVS5wdXNoKFtkeHNbbl0gKiBXXSk7XG4gICAgICAgIGRVLnB1c2goW2R5c1tuXSAqIFddKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRVLnB1c2goW2R4c1tuXV0pO1xuICAgICAgICBkVS5wdXNoKFtkeXNbbl1dKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBKX1VfUy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhbGxKX1VfUy5wdXNoKEpfVV9TW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkUyA9IF9nZXREZWx0YVMoe2RVLCBKX1VfUzogYWxsSl9VX1N9KTtcbiAgICBpZiAoZFMgPT09IG51bGwpIGJyZWFrO1xuXG4gICAgbW9kZWxWaWV3VHJhbnNmb3JtID0gX3VwZGF0ZU1vZGVsVmlld1RyYW5zZm9ybSh7bW9kZWxWaWV3VHJhbnNmb3JtLCBkU30pO1xuICB9XG4gIHJldHVybiB7bW9kZWxWaWV3VHJhbnNmb3JtLCBlcnI6IGVycjF9O1xufVxuXG5jb25zdCBfdXBkYXRlTW9kZWxWaWV3VHJhbnNmb3JtID0gKHttb2RlbFZpZXdUcmFuc2Zvcm0sIGRTfSkgPT4ge1xuICAvKipcbiAgICogZFMgaGFzIDYgcGFyYWdyYW1zLCBmaXJzdCBoYWxmIGlzIHJvdGF0aW9uLCBzZWNvbmQgaGFsZiBpcyB0cmFuc2xhdGlvblxuICAgKiByb3RhdGlvbiBpcyBleHByZXNzZWQgaW4gYW5nbGUtYXhpcywgXG4gICAqICAgW1NbMF0sIFNbMV0gLFNbMl1dIGlzIHRoZSBheGlzIG9mIHJvdGF0aW9uLCBhbmQgdGhlIG1hZ25pdHVkZSBpcyB0aGUgYW5nbGVcbiAgICovXG4gIGxldCByYSA9IGRTWzBdICogZFNbMF0gKyBkU1sxXSAqIGRTWzFdICsgZFNbMl0gKiBkU1syXTtcbiAgbGV0IHEwLCBxMSwgcTI7XG4gIGlmKCByYSA8IDAuMDAwMDAxICkge1xuICAgIHEwID0gMS4wO1xuICAgIHExID0gMC4wO1xuICAgIHEyID0gMC4wO1xuICAgIHJhID0gMC4wO1xuICB9IGVsc2Uge1xuICAgIHJhID0gTWF0aC5zcXJ0KHJhKTtcbiAgICBxMCA9IGRTWzBdIC8gcmE7XG4gICAgcTEgPSBkU1sxXSAvIHJhO1xuICAgIHEyID0gZFNbMl0gLyByYTtcbiAgfVxuXG4gIGNvbnN0IGNyYSA9IE1hdGguY29zKHJhKTtcbiAgY29uc3Qgc3JhID0gTWF0aC5zaW4ocmEpO1xuICBjb25zdCBvbmVfY3JhID0gMS4wIC0gY3JhO1xuXG4gIC8vIG1hdCBpcyBbUnx0XSwgM0Qgcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXG4gIG1hdFswXVswXSA9IHEwKnEwKm9uZV9jcmEgKyBjcmE7XG4gIG1hdFswXVsxXSA9IHEwKnExKm9uZV9jcmEgLSBxMipzcmE7XG4gIG1hdFswXVsyXSA9IHEwKnEyKm9uZV9jcmEgKyBxMSpzcmE7XG4gIG1hdFswXVszXSA9IGRTWzNdO1xuICBtYXRbMV1bMF0gPSBxMSpxMCpvbmVfY3JhICsgcTIqc3JhO1xuICBtYXRbMV1bMV0gPSBxMSpxMSpvbmVfY3JhICsgY3JhO1xuICBtYXRbMV1bMl0gPSBxMSpxMipvbmVfY3JhIC0gcTAqc3JhO1xuICBtYXRbMV1bM10gPSBkU1s0XVxuICBtYXRbMl1bMF0gPSBxMipxMCpvbmVfY3JhIC0gcTEqc3JhO1xuICBtYXRbMl1bMV0gPSBxMipxMSpvbmVfY3JhICsgcTAqc3JhO1xuICBtYXRbMl1bMl0gPSBxMipxMipvbmVfY3JhICsgY3JhO1xuICBtYXRbMl1bM10gPSBkU1s1XTtcblxuICAvLyB0aGUgdXBkYXRlZCB0cmFuc2Zvcm0gaXMgdGhlIG9yaWdpbmFsIHRyYW5zZm9ybSB4IGRlbHRhIHRyYW5zZm9ybVxuICBjb25zdCBtYXQyID0gW1tdLFtdLFtdXTtcbiAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKysgKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKysgKSB7XG4gICAgICBtYXQyW2pdW2ldID0gbW9kZWxWaWV3VHJhbnNmb3JtW2pdWzBdICogbWF0WzBdW2ldXG4gICAgICAgICAgICAgICAgICAgKyBtb2RlbFZpZXdUcmFuc2Zvcm1bal1bMV0gKiBtYXRbMV1baV1cbiAgICAgICAgICAgICAgICAgICArIG1vZGVsVmlld1RyYW5zZm9ybVtqXVsyXSAqIG1hdFsyXVtpXTtcbiAgICB9XG4gICAgbWF0MltqXVszXSArPSBtb2RlbFZpZXdUcmFuc2Zvcm1bal1bM107XG4gIH1cbiAgcmV0dXJuIG1hdDI7XG59XG5cbmNvbnN0IF9nZXREZWx0YVMgPSAoe2RVLCBKX1VfU30pID0+IHtcbiAgY29uc3QgSiA9IG5ldyBNYXRyaXgoSl9VX1MpO1xuICBjb25zdCBVID0gbmV3IE1hdHJpeChkVSk7XG5cbiAgY29uc3QgSlQgPSBKLnRyYW5zcG9zZSgpO1xuICBjb25zdCBKVEogPSBKVC5tbXVsKEopO1xuICBjb25zdCBKVFUgPSBKVC5tbXVsKFUpO1xuXG4gIGxldCBKVEpJbnY7XG4gIHRyeSB7XG4gICAgSlRKSW52ID0gaW52ZXJzZShKVEopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBTID0gSlRKSW52Lm1tdWwoSlRVKTtcbiAgcmV0dXJuIFMudG8xREFycmF5KCk7XG59XG5cbmNvbnN0IF9nZXRKX1VfUyA9ICh7bW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSwgbW9kZWxWaWV3VHJhbnNmb3JtLCBwcm9qZWN0aW9uVHJhbnNmb3JtLCB3b3JsZENvb3JkfSkgPT4ge1xuICBjb25zdCBUID0gbW9kZWxWaWV3VHJhbnNmb3JtO1xuICBjb25zdCB7eCwgeSwgen0gPSB3b3JsZENvb3JkO1xuXG4gIGNvbnN0IHUgPSBhcHBseU1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0obW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSwgeCwgeSwgeik7XG5cbiAgY29uc3QgejIgPSB1LnogKiB1Lno7XG4gIC8vIFF1ZXN0aW9uOiBUaGlzIGlzIHRoZSBtb3N0IGNvbmZ1c2luZyBtYXRyaXggdG8gbWUuIEkndmUgbm8gaWRlYSBob3cgdG8gZGVyaXZlIHRoaXMuXG4gIC8vSl9VX1hjWzBdWzBdID0gKHByb2plY3Rpb25UcmFuc2Zvcm1bMF1bMF0gKiB1LnogLSBwcm9qZWN0aW9uVHJhbnNmb3JtWzJdWzBdICogdS54KSAvIHoyO1xuICAvL0pfVV9YY1swXVsxXSA9IChwcm9qZWN0aW9uVHJhbnNmb3JtWzBdWzFdICogdS56IC0gcHJvamVjdGlvblRyYW5zZm9ybVsyXVsxXSAqIHUueCkgLyB6MjtcbiAgLy9KX1VfWGNbMF1bMl0gPSAocHJvamVjdGlvblRyYW5zZm9ybVswXVsyXSAqIHUueiAtIHByb2plY3Rpb25UcmFuc2Zvcm1bMl1bMl0gKiB1LngpIC8gejI7XG4gIC8vSl9VX1hjWzFdWzBdID0gKHByb2plY3Rpb25UcmFuc2Zvcm1bMV1bMF0gKiB1LnogLSBwcm9qZWN0aW9uVHJhbnNmb3JtWzJdWzBdICogdS55KSAvIHoyO1xuICAvL0pfVV9YY1sxXVsxXSA9IChwcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzFdICogdS56IC0gcHJvamVjdGlvblRyYW5zZm9ybVsyXVsxXSAqIHUueSkgLyB6MjtcbiAgLy9KX1VfWGNbMV1bMl0gPSAocHJvamVjdGlvblRyYW5zZm9ybVsxXVsyXSAqIHUueiAtIHByb2plY3Rpb25UcmFuc2Zvcm1bMl1bMl0gKiB1LnkpIC8gejI7XG4gIFxuICAvLyBUaGUgYWJvdmUgaXMgdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLCBidXQgc2ltcGxpZnkgdG8gYmVsb3cgYmVjdWFzZSBwcm9qZXRpb25UcmFuc2Zvcm1bMl1bMF0gYW5kIFsyXVsxXSBhcmUgemVyb1xuICBKX1VfWGNbMF1bMF0gPSAocHJvamVjdGlvblRyYW5zZm9ybVswXVswXSAqIHUueikgLyB6MjtcbiAgSl9VX1hjWzBdWzFdID0gKHByb2plY3Rpb25UcmFuc2Zvcm1bMF1bMV0gKiB1LnopIC8gejI7XG4gIEpfVV9YY1swXVsyXSA9IChwcm9qZWN0aW9uVHJhbnNmb3JtWzBdWzJdICogdS56IC0gcHJvamVjdGlvblRyYW5zZm9ybVsyXVsyXSAqIHUueCkgLyB6MjtcbiAgSl9VX1hjWzFdWzBdID0gKHByb2plY3Rpb25UcmFuc2Zvcm1bMV1bMF0gKiB1LnopIC8gejI7XG4gIEpfVV9YY1sxXVsxXSA9IChwcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzFdICogdS56KSAvIHoyO1xuICBKX1VfWGNbMV1bMl0gPSAocHJvamVjdGlvblRyYW5zZm9ybVsxXVsyXSAqIHUueiAtIHByb2plY3Rpb25UcmFuc2Zvcm1bMl1bMl0gKiB1LnkpIC8gejI7XG5cbiAgLypcbiAgICBKX1hjX1Mgc2hvdWxkIGJlIGxpa2UgdGhpcywgYnV0IHogaXMgemVybywgc28gd2UgY2FuIHNpbXBsaWZ5XG4gICAgW1RbMF1bMl0gKiB5IC0gVFswXVsxXSAqIHosIFRbMF1bMF0gKiB6IC0gVFswXVsyXSAqIHgsIFRbMF1bMV0gKiB4IC0gVFswXVswXSAqIHksIFRbMF1bMF0sIFRbMF1bMV0sIFRbMF1bMl1dLFxuICAgIFtUWzFdWzJdICogeSAtIFRbMV1bMV0gKiB6LCBUWzFdWzBdICogeiAtIFRbMV1bMl0gKiB4LCBUWzFdWzFdICogeCAtIFRbMV1bMF0gKiB5LCBUWzFdWzBdLCBUWzFdWzFdLCBUWzFdWzJdXSxcbiAgICBbVFsyXVsyXSAqIHkgLSBUWzJdWzFdICogeiwgVFsyXVswXSAqIHogLSBUWzJdWzJdICogeCwgVFsyXVsxXSAqIHggLSBUWzJdWzBdICogeSwgVFsyXVswXSwgVFsyXVsxXSwgVFsyXVsyXV0sXG4gICovXG4gIEpfWGNfU1swXVswXSA9IFRbMF1bMl0gKiB5O1xuICBKX1hjX1NbMF1bMV0gPSAtVFswXVsyXSAqIHg7XG4gIEpfWGNfU1swXVsyXSA9IFRbMF1bMV0gKiB4IC0gVFswXVswXSAqIHk7XG4gIEpfWGNfU1swXVszXSA9IFRbMF1bMF07XG4gIEpfWGNfU1swXVs0XSA9IFRbMF1bMV07IFxuICBKX1hjX1NbMF1bNV0gPSBUWzBdWzJdO1xuXG4gIEpfWGNfU1sxXVswXSA9IFRbMV1bMl0gKiB5O1xuICBKX1hjX1NbMV1bMV0gPSAtVFsxXVsyXSAqIHg7XG4gIEpfWGNfU1sxXVsyXSA9IFRbMV1bMV0gKiB4IC0gVFsxXVswXSAqIHk7XG4gIEpfWGNfU1sxXVszXSA9IFRbMV1bMF07XG4gIEpfWGNfU1sxXVs0XSA9IFRbMV1bMV07XG4gIEpfWGNfU1sxXVs1XSA9IFRbMV1bMl07XG5cbiAgSl9YY19TWzJdWzBdID0gVFsyXVsyXSAqIHk7XG4gIEpfWGNfU1syXVsxXSA9IC1UWzJdWzJdICogeDtcbiAgSl9YY19TWzJdWzJdID0gVFsyXVsxXSAqIHggLSBUWzJdWzBdICogeTtcbiAgSl9YY19TWzJdWzNdID0gVFsyXVswXTtcbiAgSl9YY19TWzJdWzRdID0gVFsyXVsxXTtcbiAgSl9YY19TWzJdWzVdID0gVFsyXVsyXTtcblxuICBjb25zdCBKX1VfUyA9IFtbXSwgW11dO1xuICBmb3IgKGxldCBqID0gMDsgaiA8IDI7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBKX1VfU1tqXVtpXSA9IDAuMDtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMzsgaysrICkge1xuICAgICAgICBKX1VfU1tqXVtpXSArPSBKX1VfWGNbal1ba10gKiBKX1hjX1Nba11baV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBKX1VfUztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZmluZUVzdGltYXRlXG59XG4iLCJjb25zdCBidWlsZE1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0gPSAocHJvamVjdGlvblRyYW5zZm9ybSwgbW9kZWxWaWV3VHJhbnNmb3JtKSA9PiB7XG4gIC8vIGFzc3VtZSB0aGUgcHJvamVjdFRyYW5zZm9ybSBoYXMgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gIC8vIFtbZngsIDAsIGN4XSxcbiAgLy8gIFswLCBmeSwgY3ldXG4gIC8vICBbMCwgMCwgMV1dXG4gIGNvbnN0IG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0gPSBbXG4gICAgW1xuICAgICAgcHJvamVjdGlvblRyYW5zZm9ybVswXVswXSAqIG1vZGVsVmlld1RyYW5zZm9ybVswXVswXSArIHByb2plY3Rpb25UcmFuc2Zvcm1bMF1bMl0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMl1bMF0sXG4gICAgICBwcm9qZWN0aW9uVHJhbnNmb3JtWzBdWzBdICogbW9kZWxWaWV3VHJhbnNmb3JtWzBdWzFdICsgcHJvamVjdGlvblRyYW5zZm9ybVswXVsyXSAqIG1vZGVsVmlld1RyYW5zZm9ybVsyXVsxXSxcbiAgICAgIHByb2plY3Rpb25UcmFuc2Zvcm1bMF1bMF0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMF1bMl0gKyBwcm9qZWN0aW9uVHJhbnNmb3JtWzBdWzJdICogbW9kZWxWaWV3VHJhbnNmb3JtWzJdWzJdLFxuICAgICAgcHJvamVjdGlvblRyYW5zZm9ybVswXVswXSAqIG1vZGVsVmlld1RyYW5zZm9ybVswXVszXSArIHByb2plY3Rpb25UcmFuc2Zvcm1bMF1bMl0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMl1bM10sXG4gICAgXSxcbiAgICBbXG4gICAgICBwcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzFdICogbW9kZWxWaWV3VHJhbnNmb3JtWzFdWzBdICsgcHJvamVjdGlvblRyYW5zZm9ybVsxXVsyXSAqIG1vZGVsVmlld1RyYW5zZm9ybVsyXVswXSxcbiAgICAgIHByb2plY3Rpb25UcmFuc2Zvcm1bMV1bMV0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMV1bMV0gKyBwcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzJdICogbW9kZWxWaWV3VHJhbnNmb3JtWzJdWzFdLFxuICAgICAgcHJvamVjdGlvblRyYW5zZm9ybVsxXVsxXSAqIG1vZGVsVmlld1RyYW5zZm9ybVsxXVsyXSArIHByb2plY3Rpb25UcmFuc2Zvcm1bMV1bMl0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMl1bMl0sXG4gICAgICBwcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzFdICogbW9kZWxWaWV3VHJhbnNmb3JtWzFdWzNdICsgcHJvamVjdGlvblRyYW5zZm9ybVsxXVsyXSAqIG1vZGVsVmlld1RyYW5zZm9ybVsyXVszXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIG1vZGVsVmlld1RyYW5zZm9ybVsyXVswXSxcbiAgICAgIG1vZGVsVmlld1RyYW5zZm9ybVsyXVsxXSxcbiAgICAgIG1vZGVsVmlld1RyYW5zZm9ybVsyXVsyXSxcbiAgICAgIG1vZGVsVmlld1RyYW5zZm9ybVsyXVszXSxcbiAgICBdXG4gIF07XG4gIHJldHVybiBtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtO1xuICBcbiAgLypcbiAgLy8gdGhpcyBpcyB0aGUgZnVsbCBjb21wdXRhdGlvbiBpZiB0aGUgcHJvamVjdFRyYW5zZm9ybSBkb2VzIG5vdCBsb29rIGxpa2UgdGhlIGV4cGVjdGVkIGZvcm1hdCwgYnV0IG1vcmUgY29tcHV0YXRpb25zXG4gIC8vICBcbiAgY29uc3QgbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSA9IFtbXSxbXSxbXV07XG4gIGZvciAobGV0IGogPSAwOyBqIDwgMzsgaisrICkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICBtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtW2pdW2ldID0gcHJvamVjdGlvblRyYW5zZm9ybVtqXVswXSAqIG1vZGVsVmlld1RyYW5zZm9ybVswXVtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHByb2plY3Rpb25UcmFuc2Zvcm1bal1bMV0gKiBtb2RlbFZpZXdUcmFuc2Zvcm1bMV1baV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwcm9qZWN0aW9uVHJhbnNmb3JtW2pdWzJdICogbW9kZWxWaWV3VHJhbnNmb3JtWzJdW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybTtcbiAgKi9cbn1cblxuY29uc3QgYXBwbHlNb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtID0gKG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0sIHgsIHksIHopID0+IHtcbiAgLy8gYXNzdW1lIHogaXMgemVyb1xuICBjb25zdCB1eCA9IG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm1bMF1bMF0gKiB4ICsgbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVswXVsxXSAqIHkgKyBtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtWzBdWzNdO1xuICBjb25zdCB1eSA9IG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm1bMV1bMF0gKiB4ICsgbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsxXVsxXSAqIHkgKyBtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtWzFdWzNdO1xuICBjb25zdCB1eiA9IG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm1bMl1bMF0gKiB4ICsgbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsyXVsxXSAqIHkgKyBtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtWzJdWzNdO1xuICByZXR1cm4ge3g6IHV4LCB5OiB1eSwgejogdXp9O1xufVxuXG5jb25zdCBjb21wdXRlU2NyZWVuQ29vcmRpYXRlID0gKG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0sIHgsIHksIHopID0+IHtcbiAgY29uc3Qge3g6IHV4LCB5OiB1eSwgejogdXp9ID0gYXBwbHlNb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtKG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0sIHgsIHksIHopO1xuICAvL2lmKCBNYXRoLmFicyh1eikgPCAwLjAwMDAwMSApIHJldHVybiBudWxsO1xuICByZXR1cm4ge3g6IHV4L3V6LCB5OiB1eS91en07XG59XG5cbmNvbnN0IHNjcmVlblRvTWFya2VyQ29vcmRpbmF0ZSA9IChtb2RlbFZpZXdQcm9qZWN0aW9uVHJhbnNmb3JtLCBzeCwgc3kpID0+IHtcbiAgY29uc3QgYzExID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsyXVswXSAqIHN4IC0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVswXVswXTtcbiAgY29uc3QgYzEyID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsyXVsxXSAqIHN4IC0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVswXVsxXTtcbiAgY29uc3QgYzIxID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsyXVswXSAqIHN5IC0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsxXVswXTtcbiAgY29uc3QgYzIyID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsyXVsxXSAqIHN5IC0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsxXVsxXTtcbiAgY29uc3QgYjEgID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVswXVszXSAtIG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm1bMl1bM10gKiBzeDtcbiAgY29uc3QgYjIgID0gbW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybVsxXVszXSAtIG1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm1bMl1bM10gKiBzeTtcblxuICBjb25zdCBtID0gYzExICogYzIyIC0gYzEyICogYzIxO1xuICByZXR1cm4ge1xuICAgIHg6IChjMjIgKiBiMSAtIGMxMiAqIGIyKSAvIG0sXG4gICAgeTogKGMxMSAqIGIyIC0gYzIxICogYjEpIC8gbVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBidWlsZE1vZGVsVmlld1Byb2plY3Rpb25UcmFuc2Zvcm0sXG4gIGFwcGx5TW9kZWxWaWV3UHJvamVjdGlvblRyYW5zZm9ybSxcbiAgY29tcHV0ZVNjcmVlbkNvb3JkaWF0ZSxcbn1cbiIsIi8vIEZhc3QgY29tcHV0YXRpb24gb24gbnVtYmVyIG9mIGJpdCBzZXRzXG4vLyBSZWY6IGh0dHBzOi8vZ3JhcGhpY3Muc3RhbmZvcmQuZWR1L35zZWFuZGVyL2JpdGhhY2tzLmh0bWwjQ291bnRCaXRzU2V0UGFyYWxsZWxcbmNvbnN0IGNvbXB1dGUgPSAob3B0aW9ucykgPT4ge1xuICBjb25zdCB7djEsIHYyfSA9IG9wdGlvbnM7XG4gIGxldCBkID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHYxLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHggPSAodjFbaV0gXiB2MltpXSkgPj4+IDA7XG4gICAgZCArPSBiaXRDb3VudCh4KTtcbiAgfVxuICByZXR1cm4gZDtcbn1cblxuY29uc3QgYml0Q291bnQgPSAodikgPT4ge1xuICB2YXIgYyA9IHYgLSAoKHYgPj4gMSkgJiAweDU1NTU1NTU1KTtcbiAgYyA9ICgoYyA+PiAyKSAmIDB4MzMzMzMzMzMpICsgKGMgJiAweDMzMzMzMzMzKTtcbiAgYyA9ICgoYyA+PiA0KSArIGMpICYgMHgwRjBGMEYwRjtcbiAgYyA9ICgoYyA+PiA4KSArIGMpICYgMHgwMEZGMDBGRjtcbiAgYyA9ICgoYyA+PiAxNikgKyBjKSAmIDB4MDAwMEZGRkY7XG4gIHJldHVybiBjO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcHV0ZVxufTtcbiIsImNvbnN0IGtIb3VnaEJpbkRlbHRhID0gMTtcblxuLy8gbWF0aGNlcyBbcXVlcnlwb2ludEluZGV4OngsIGtleXBvaW50SW5kZXg6IHhdXG5jb25zdCBjb21wdXRlSG91Z2hNYXRjaGVzID0gKG9wdGlvbnMpID0+IHtcbiAgY29uc3Qge2tleXdpZHRoLCBrZXloZWlnaHQsIHF1ZXJ5d2lkdGgsIHF1ZXJ5aGVpZ2h0LCBtYXRjaGVzfSA9IG9wdGlvbnM7XG5cbiAgY29uc3QgbWF4WCA9IHF1ZXJ5d2lkdGggKiAxLjI7XG4gIGNvbnN0IG1pblggPSAtbWF4WDtcbiAgY29uc3QgbWF4WSA9IHF1ZXJ5aGVpZ2h0ICogMS4yO1xuICBjb25zdCBtaW5ZID0gLW1heFk7XG4gIGNvbnN0IG51bUFuZ2xlQmlucyA9IDEyO1xuICBjb25zdCBudW1TY2FsZUJpbnMgPSAxMDtcbiAgY29uc3QgbWluU2NhbGUgPSAtMTtcbiAgY29uc3QgbWF4U2NhbGUgPSAxO1xuICBjb25zdCBzY2FsZUsgPSAxMC4wO1xuICBjb25zdCBzY2FsZU9uZU92ZXJMb2dLID0gMS4wIC8gTWF0aC5sb2coc2NhbGVLKTtcbiAgY29uc3QgbWF4RGltID0gTWF0aC5tYXgoa2V5d2lkdGgsIGtleWhlaWdodCk7XG4gIGNvbnN0IGtleWNlbnRlclggPSBNYXRoLmZsb29yKGtleXdpZHRoIC8gMik7XG4gIGNvbnN0IGtleWNlbnRlclkgPSBNYXRoLmZsb29yKGtleWhlaWdodCAvIDIpO1xuXG4gIC8vIGNvbXB1dGUgbnVtWEJpbnMgYW5kIG51bVlCaW5zIGJhc2VkIG9uIG1hdGNoZXNcbiAgY29uc3QgcHJvamVjdGVkRGltcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBxdWVyeXNjYWxlID0gbWF0Y2hlc1tpXS5xdWVyeXBvaW50LnNjYWxlO1xuICAgIGNvbnN0IGtleXNjYWxlID0gbWF0Y2hlc1tpXS5rZXlwb2ludC5zY2FsZTtcbiAgICBpZiAoa2V5c2NhbGUgPT0gMCkgY29uc29sZS5sb2coXCJFUlJPUiBkaXZpZGUgemVyb1wiKTtcbiAgICBjb25zdCBzY2FsZSA9IHF1ZXJ5c2NhbGUgLyBrZXlzY2FsZTtcbiAgICBwcm9qZWN0ZWREaW1zLnB1c2goIHNjYWxlICogbWF4RGltICk7XG4gIH1cblxuICAvLyBUT0RPIG9wdGltaXplIG1lZGlhblxuICAvLyAgIHdlaXJkLiBtZWRpYW4gc2hvdWxkIGJlIFtNYXRoLmZsb29yKHByb2plY3RlZERpbXMubGVuZ3RoLzIpIC0gMV0gP1xuICBwcm9qZWN0ZWREaW1zLnNvcnQoKGExLCBhMikgPT4ge3JldHVybiBhMSAtIGEyfSk7XG4gIGNvbnN0IG1lZGlhblByb2plY3RlZERpbSA9IHByb2plY3RlZERpbXNbIE1hdGguZmxvb3IocHJvamVjdGVkRGltcy5sZW5ndGgvMikgLSAocHJvamVjdGVkRGltcy5sZW5ndGglMj09MD8xOjApIC0xIF07XG5cbiAgY29uc3QgYmluU2l6ZSA9IDAuMjUgKiBtZWRpYW5Qcm9qZWN0ZWREaW07XG4gIGNvbnN0IG51bVhCaW5zID0gTWF0aC5tYXgoNSwgTWF0aC5jZWlsKChtYXhYIC0gbWluWCkgLyBiaW5TaXplKSk7XG4gIGNvbnN0IG51bVlCaW5zID0gTWF0aC5tYXgoNSwgTWF0aC5jZWlsKChtYXhZIC0gbWluWSkgLyBiaW5TaXplKSk7XG5cbiAgY29uc3QgbnVtWFlCaW5zID0gbnVtWEJpbnMgKiBudW1ZQmlucztcbiAgY29uc3QgbnVtWFlBbmdsZUJpbnMgPSBudW1YWUJpbnMgKiBudW1BbmdsZUJpbnM7XG5cbiAgLy8gZG8gdm90aW5nXG4gIGNvbnN0IHF1ZXJ5cG9pbnRWYWxpZHMgPSBbXTtcbiAgY29uc3QgcXVlcnlwb2ludEJpbkxvY2F0aW9ucyA9IFtdO1xuICBjb25zdCB2b3RlcyA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBxdWVyeXBvaW50ID0gbWF0Y2hlc1tpXS5xdWVyeXBvaW50O1xuICAgIGNvbnN0IGtleXBvaW50ID0gbWF0Y2hlc1tpXS5rZXlwb2ludDtcblxuICAgIGNvbnN0IHt4LCB5LCBzY2FsZSwgYW5nbGV9ID0gX21hcENvcnJlc3BvbmRlbmNlKHtxdWVyeXBvaW50LCBrZXlwb2ludCwga2V5Y2VudGVyWCwga2V5Y2VudGVyWSwgc2NhbGVPbmVPdmVyTG9nS30pO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgdm90ZSBpcyB3aXRoaW4gcmFuZ2VcbiAgICBpZiAoeCA8IG1pblggfHwgeCA+PSBtYXhYIHx8IHkgPCBtaW5ZIHx8IHkgPj0gbWF4WSB8fCBhbmdsZSA8PSAtTWF0aC5QSSB8fCBhbmdsZSA+IE1hdGguUEkgfHwgc2NhbGUgPCBtaW5TY2FsZSB8fCBzY2FsZSA+PSBtYXhTY2FsZSkge1xuICAgICAgcXVlcnlwb2ludFZhbGlkc1tpXSA9IGZhbHNlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbWFwIHByb3BlcnRpZXMgdG8gYmluc1xuICAgIGxldCBmYmluWCA9IG51bVhCaW5zICogKHggLSBtaW5YKSAvIChtYXhYIC0gbWluWCk7XG4gICAgbGV0IGZiaW5ZID0gbnVtWUJpbnMgKiAoeSAtIG1pblkpIC8gKG1heFkgLSBtaW5ZKTtcbiAgICBsZXQgZmJpbkFuZ2xlID0gbnVtQW5nbGVCaW5zICogKGFuZ2xlICsgTWF0aC5QSSkgLyAoMi4wICogTWF0aC5QSSk7XG4gICAgbGV0IGZiaW5TY2FsZSA9IG51bVNjYWxlQmlucyAqIChzY2FsZSAtIG1pblNjYWxlKSAvIChtYXhTY2FsZSAtIG1pblNjYWxlKTtcblxuICAgIHF1ZXJ5cG9pbnRCaW5Mb2NhdGlvbnNbaV0gPSB7YmluWDogZmJpblgsIGJpblk6IGZiaW5ZLCBiaW5BbmdsZTogZmJpbkFuZ2xlLCBiaW5TY2FsZTogZmJpblNjYWxlfTtcblxuICAgIGxldCBiaW5YID0gTWF0aC5mbG9vcihmYmluWCAtIDAuNSk7XG4gICAgbGV0IGJpblkgPSBNYXRoLmZsb29yKGZiaW5ZIC0gMC41KTtcbiAgICBsZXQgYmluU2NhbGUgPSBNYXRoLmZsb29yKGZiaW5TY2FsZSAtIDAuNSk7XG4gICAgbGV0IGJpbkFuZ2xlID0gKE1hdGguZmxvb3IoZmJpbkFuZ2xlIC0gMC41KSArIG51bUFuZ2xlQmlucykgJSBudW1BbmdsZUJpbnM7XG5cbiAgICAvLyBjaGVjayBjYW4gdm90ZSBhbGwgMTYgYmluc1xuICAgIGlmIChiaW5YIDwgMCB8fCBiaW5YICsgMSA+PSBudW1YQmlucyB8fCBiaW5ZIDwgMCB8fCBiaW5ZICsgMSA+PSBudW1ZQmlucyB8fCBiaW5TY2FsZSA8IDAgfHwgYmluU2NhbGUgKzEgPj0gbnVtU2NhbGVCaW5zKSB7XG4gICAgICBxdWVyeXBvaW50VmFsaWRzW2ldID0gZmFsc2U7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBkeCA9IDA7IGR4IDwgMjsgZHgrKykge1xuICAgICAgbGV0IGJpblgyID0gYmluWCArIGR4O1xuXG4gICAgICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgMjsgZHkrKykge1xuICAgICAgICBsZXQgYmluWTIgPSBiaW5ZICsgZHk7XG5cbiAgICAgICAgZm9yIChsZXQgZGFuZ2xlID0gMDsgZGFuZ2xlIDwgMjsgZGFuZ2xlKyspIHtcbiAgICAgICAgICBsZXQgYmluQW5nbGUyID0gKGJpbkFuZ2xlICsgZGFuZ2xlKSAlIG51bUFuZ2xlQmlucztcblxuICAgICAgICAgIGZvciAobGV0IGRzY2FsZSA9IDA7IGRzY2FsZSA8IDI7IGRzY2FsZSsrKSB7XG4gICAgICAgICAgICBsZXQgYmluU2NhbGUyID0gYmluU2NhbGUgKyBkc2NhbGU7XG5cbiAgICAgICAgICAgIGNvbnN0IGJpbkluZGV4ID0gYmluWDIgKyBiaW5ZMiAqIG51bVhCaW5zICsgYmluQW5nbGUyICogbnVtWFlCaW5zICsgYmluU2NhbGUyICogbnVtWFlBbmdsZUJpbnM7XG5cbiAgICAgICAgICAgIGlmICh2b3Rlc1tiaW5JbmRleF0gPT09IHVuZGVmaW5lZCkgdm90ZXNbYmluSW5kZXhdID0gMDtcbiAgICAgICAgICAgIHZvdGVzW2JpbkluZGV4XSArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBxdWVyeXBvaW50VmFsaWRzW2ldID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCBtYXhWb3RlcyA9IDA7XG4gIGxldCBtYXhWb3RlSW5kZXggPSAtMTtcbiAgT2JqZWN0LmtleXModm90ZXMpLmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgaWYgKHZvdGVzW2luZGV4XSA+IG1heFZvdGVzKSB7XG4gICAgICBtYXhWb3RlcyA9IHZvdGVzW2luZGV4XTtcbiAgICAgIG1heFZvdGVJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG1heFZvdGVzIDwgMykgcmV0dXJuIFtdO1xuXG4gIC8vIGdldCBiYWNrIGJpbnMgZnJvbSB2b3RlIGluZGV4XG4gIGNvbnN0IGJpblggPSBNYXRoLmZsb29yKCgobWF4Vm90ZUluZGV4ICUgbnVtWFlBbmdsZUJpbnMpICUgbnVtWFlCaW5zKSAlIG51bVhCaW5zKTtcbiAgY29uc3QgYmluWSA9IE1hdGguZmxvb3IoKCgobWF4Vm90ZUluZGV4IC0gYmluWCkgJSBudW1YWUFuZ2xlQmlucykgJSBudW1YWUJpbnMpIC8gbnVtWEJpbnMpO1xuICBjb25zdCBiaW5BbmdsZSA9IE1hdGguZmxvb3IoKChtYXhWb3RlSW5kZXggLSBiaW5YIC0gKGJpblkgKiBudW1YQmlucykpICUgbnVtWFlBbmdsZUJpbnMpIC8gbnVtWFlCaW5zKTtcbiAgY29uc3QgYmluU2NhbGUgPSBNYXRoLmZsb29yKChtYXhWb3RlSW5kZXggLSBiaW5YIC0gKGJpblkgKiBudW1YQmlucykgLSAoYmluQW5nbGUgKiBudW1YWUJpbnMpKSAvIG51bVhZQW5nbGVCaW5zKTtcblxuICAvL2NvbnNvbGUubG9nKFwiaG91Z2ggdm90ZWQ6IFwiLCB7YmluWCwgYmluWSwgYmluQW5nbGUsIGJpblNjYWxlLCBtYXhWb3RlSW5kZXh9KTtcblxuICBjb25zdCBob3VnaE1hdGNoZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFxdWVyeXBvaW50VmFsaWRzW2ldKSBjb250aW51ZTtcblxuICAgIGNvbnN0IHF1ZXJ5QmlucyA9IHF1ZXJ5cG9pbnRCaW5Mb2NhdGlvbnNbaV07XG4gICAgLy8gY29tcHV0ZSBiaW4gZGlmZmVyZW5jZVxuICAgIGNvbnN0IGRpc3RCaW5YID0gTWF0aC5hYnMocXVlcnlCaW5zLmJpblggLSAoYmluWCswLjUpKTtcbiAgICBpZiAoZGlzdEJpblggPj0ga0hvdWdoQmluRGVsdGEpIGNvbnRpbnVlO1xuXG4gICAgY29uc3QgZGlzdEJpblkgPSBNYXRoLmFicyhxdWVyeUJpbnMuYmluWSAtIChiaW5ZKzAuNSkpO1xuICAgIGlmIChkaXN0QmluWSA+PSBrSG91Z2hCaW5EZWx0YSkgY29udGludWU7XG5cbiAgICBjb25zdCBkaXN0QmluU2NhbGUgPSBNYXRoLmFicyhxdWVyeUJpbnMuYmluU2NhbGUgLSAoYmluU2NhbGUrMC41KSk7XG4gICAgaWYgKGRpc3RCaW5TY2FsZSA+PSBrSG91Z2hCaW5EZWx0YSkgY29udGludWU7XG5cbiAgICBjb25zdCB0ZW1wID0gTWF0aC5hYnMocXVlcnlCaW5zLmJpbkFuZ2xlIC0gKGJpbkFuZ2xlKzAuNSkpO1xuICAgIGNvbnN0IGRpc3RCaW5BbmdsZSA9IE1hdGgubWluKHRlbXAsIG51bUFuZ2xlQmlucyAtIHRlbXApO1xuICAgIGlmIChkaXN0QmluQW5nbGUgPj0ga0hvdWdoQmluRGVsdGEpIGNvbnRpbnVlO1xuXG4gICAgaG91Z2hNYXRjaGVzLnB1c2gobWF0Y2hlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGhvdWdoTWF0Y2hlcztcbn1cblxuY29uc3QgX21hcENvcnJlc3BvbmRlbmNlID0gKHtxdWVyeXBvaW50LCBrZXlwb2ludCwga2V5Y2VudGVyWCwga2V5Y2VudGVyWSwgc2NhbGVPbmVPdmVyTG9nS30pID0+IHtcbiAgLy8gbWFwIGFuZ2xlIHRvICgtcGksIHBpXVxuICBsZXQgYW5nbGUgPSBxdWVyeXBvaW50LmFuZ2xlIC0ga2V5cG9pbnQuYW5nbGU7XG4gIGlmIChhbmdsZSA8PSAtTWF0aC5QSSkgYW5nbGUgKz0gMipNYXRoLlBJO1xuICBlbHNlIGlmIChhbmdsZSA+IE1hdGguUEkpIGFuZ2xlIC09IDIqTWF0aC5QSTtcblxuICBjb25zdCBzY2FsZSA9IHF1ZXJ5cG9pbnQuc2NhbGUgLyBrZXlwb2ludC5zY2FsZTtcblxuICAvLyAyeDIgc2ltaWxhcml0eVxuICBjb25zdCBjb3MgPSBzY2FsZSAqIE1hdGguY29zKGFuZ2xlKTtcbiAgY29uc3Qgc2luID0gc2NhbGUgKiBNYXRoLnNpbihhbmdsZSk7XG4gIGNvbnN0IFMgPSBbY29zLCAtc2luLCBzaW4sIGNvc107XG5cbiAgY29uc3QgdHAgPSBbXG4gICAgU1swXSAqIGtleXBvaW50LnggKyBTWzFdICoga2V5cG9pbnQueSxcbiAgICBTWzJdICoga2V5cG9pbnQueCArIFNbM10gKiBrZXlwb2ludC55XG4gIF07XG4gIGNvbnN0IHR4ID0gcXVlcnlwb2ludC54IC0gdHBbMF07XG4gIGNvbnN0IHR5ID0gcXVlcnlwb2ludC55IC0gdHBbMV07XG5cbiAgcmV0dXJuIHtcbiAgICB4OiBTWzBdICoga2V5Y2VudGVyWCArIFNbMV0gKiBrZXljZW50ZXJZICsgdHgsXG4gICAgeTogU1syXSAqIGtleWNlbnRlclggKyBTWzNdICoga2V5Y2VudGVyWSArIHR5LFxuICAgIGFuZ2xlOiBhbmdsZSxcbiAgICBzY2FsZTogTWF0aC5sb2coc2NhbGUpICogc2NhbGVPbmVPdmVyTG9nS1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb21wdXRlSG91Z2hNYXRjaGVzXG59XG4iLCJjb25zdCB7bWF0Y2h9ID0gcmVxdWlyZSgnLi9tYXRjaGluZycpO1xuXG5jbGFzcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IocXVlcnlXaWR0aCwgcXVlcnlIZWlnaHQsIGRlYnVnTW9kZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5xdWVyeVdpZHRoID0gcXVlcnlXaWR0aDtcbiAgICB0aGlzLnF1ZXJ5SGVpZ2h0ID0gcXVlcnlIZWlnaHQ7XG4gICAgdGhpcy5kZWJ1Z01vZGUgPSBkZWJ1Z01vZGU7XG4gIH1cblxuICBtYXRjaERldGVjdGlvbihrZXlmcmFtZXMsIGZlYXR1cmVQb2ludHMpIHtcbiAgICBsZXQgZGVidWdFeHRyYSA9IHtmcmFtZXM6IFtdfTtcblxuICAgIGxldCBiZXN0UmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge0gsIG1hdGNoZXMsIGRlYnVnRXh0cmE6IGZyYW1lRGVidWdFeHRyYX0gPSBtYXRjaCh7a2V5ZnJhbWU6IGtleWZyYW1lc1tpXSwgcXVlcnlwb2ludHM6IGZlYXR1cmVQb2ludHMsIHF1ZXJ5d2lkdGg6IHRoaXMucXVlcnlXaWR0aCwgcXVlcnloZWlnaHQ6IHRoaXMucXVlcnlIZWlnaHQsIGRlYnVnTW9kZTogdGhpcy5kZWJ1Z01vZGV9KTtcbiAgICAgIGRlYnVnRXh0cmEuZnJhbWVzLnB1c2goZnJhbWVEZWJ1Z0V4dHJhKTtcblxuICAgICAgaWYgKEgpIHtcblx0aWYgKGJlc3RSZXN1bHQgPT09IG51bGwgfHwgYmVzdFJlc3VsdC5tYXRjaGVzLmxlbmd0aCA8IG1hdGNoZXMubGVuZ3RoKSB7XG5cdCAgYmVzdFJlc3VsdCA9IHtrZXlmcmFtZUluZGV4OiBpLCBILCBtYXRjaGVzfTtcblx0fVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0UmVzdWx0ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4ge2tleWZyYW1lSW5kZXg6IC0xLCBkZWJ1Z0V4dHJhfTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSBbXTtcbiAgICBjb25zdCB3b3JsZENvb3JkcyA9IFtdO1xuICAgIGNvbnN0IGtleWZyYW1lID0ga2V5ZnJhbWVzW2Jlc3RSZXN1bHQua2V5ZnJhbWVJbmRleF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZXN0UmVzdWx0Lm1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHF1ZXJ5cG9pbnQgPSBiZXN0UmVzdWx0Lm1hdGNoZXNbaV0ucXVlcnlwb2ludDtcbiAgICAgIGNvbnN0IGtleXBvaW50ID0gYmVzdFJlc3VsdC5tYXRjaGVzW2ldLmtleXBvaW50O1xuICAgICAgc2NyZWVuQ29vcmRzLnB1c2goe1xuICAgICAgICB4OiBxdWVyeXBvaW50LngsXG4gICAgICAgIHk6IHF1ZXJ5cG9pbnQueSxcbiAgICAgIH0pXG4gICAgICB3b3JsZENvb3Jkcy5wdXNoKHtcbiAgICAgICAgeDogKGtleXBvaW50LnggKyAwLjUpIC8ga2V5ZnJhbWUuc2NhbGUsXG4gICAgICAgIHk6IChrZXlwb2ludC55ICsgMC41KSAvIGtleWZyYW1lLnNjYWxlLFxuICAgICAgICB6OiAwLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHtzY3JlZW5Db29yZHMsIHdvcmxkQ29vcmRzLCBrZXlmcmFtZUluZGV4OiBiZXN0UmVzdWx0LmtleWZyYW1lSW5kZXgsIGRlYnVnRXh0cmF9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNYXRjaGVyXG59XG4iLCJjb25zdCBUaW55UXVldWUgPSByZXF1aXJlKCd0aW55cXVldWUnKS5kZWZhdWx0O1xuY29uc3Qge2NvbXB1dGU6IGhhbW1pbmdDb21wdXRlfSA9IHJlcXVpcmUoJy4vaGFtbWluZy1kaXN0YW5jZS5qcycpO1xuY29uc3Qge2NvbXB1dGVIb3VnaE1hdGNoZXN9ID0gcmVxdWlyZSgnLi9ob3VnaC5qcycpO1xuY29uc3Qge2NvbXB1dGVIb21vZ3JhcGh5fSA9IHJlcXVpcmUoJy4vcmFuc2FjSG9tb2dyYXBoeS5qcycpO1xuY29uc3Qge211bHRpcGx5UG9pbnRIb21vZ3JhcGh5SW5ob21vZ2Vub3VzLCBtYXRyaXhJbnZlcnNlMzN9ID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2VvbWV0cnkuanMnKTtcblxuY29uc3QgSU5MSUVSX1RIUkVTSE9MRCA9IDM7XG4vL2NvbnN0IE1JTl9OVU1fSU5MSUVSUyA9IDg7ICAvL2RlZmF1bHRcbmNvbnN0IE1JTl9OVU1fSU5MSUVSUyA9IDY7XG5jb25zdCBDTFVTVEVSX01BWF9QT1AgPSA4O1xuY29uc3QgSEFNTUlOR19USFJFU0hPTEQgPSAwLjc7XG5cbi8vIG1hdGNoIGxpc3Qgb2YgcXVlcnBvaW50cyBhZ2FpbnN0IHByZS1idWlsdCBsaXN0IG9mIGtleWZyYW1lc1xuY29uc3QgbWF0Y2ggPSAoe2tleWZyYW1lLCBxdWVyeXBvaW50cywgcXVlcnl3aWR0aCwgcXVlcnloZWlnaHQsIGRlYnVnTW9kZX0pID0+IHtcbiAgbGV0IGRlYnVnRXh0cmEgPSB7fTtcblxuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGZvciAobGV0IGogPSAwOyBqIDwgcXVlcnlwb2ludHMubGVuZ3RoOyBqKyspIHtcbiAgICBjb25zdCBxdWVyeXBvaW50ID0gcXVlcnlwb2ludHNbal07XG4gICAgY29uc3Qga2V5cG9pbnRzID0gcXVlcnlwb2ludC5tYXhpbWE/IGtleWZyYW1lLm1heGltYVBvaW50czoga2V5ZnJhbWUubWluaW1hUG9pbnRzO1xuICAgIGlmIChrZXlwb2ludHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcblxuICAgIGNvbnN0IHJvb3ROb2RlID0gcXVlcnlwb2ludC5tYXhpbWE/IGtleWZyYW1lLm1heGltYVBvaW50c0NsdXN0ZXIucm9vdE5vZGU6IGtleWZyYW1lLm1pbmltYVBvaW50c0NsdXN0ZXIucm9vdE5vZGU7XG5cbiAgICBjb25zdCBrZXlwb2ludEluZGV4ZXMgPSBbXTtcbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBUaW55UXVldWUoW10sIChhMSwgYTIpID0+IHtyZXR1cm4gYTEuZCAtIGEyLmR9KTtcblxuICAgIC8vIHF1ZXJ5IGFsbCBwb3RlbnRpYWwga2V5cG9pbnRzXG4gICAgX3F1ZXJ5KHtub2RlOiByb290Tm9kZSwga2V5cG9pbnRzLCBxdWVyeXBvaW50LCBxdWV1ZSwga2V5cG9pbnRJbmRleGVzLCBudW1Qb3A6IDB9KTtcblxuICAgIGxldCBiZXN0SW5kZXggPSAtMTtcbiAgICBsZXQgYmVzdEQxID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgbGV0IGJlc3REMiA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBrZXlwb2ludEluZGV4ZXMubGVuZ3RoOyBrKyspIHtcbiAgICAgIGNvbnN0IGtleXBvaW50ID0ga2V5cG9pbnRzW2tleXBvaW50SW5kZXhlc1trXV07XG5cbiAgICAgIGNvbnN0IGQgPSBoYW1taW5nQ29tcHV0ZSh7djE6IGtleXBvaW50LmRlc2NyaXB0b3JzLCB2MjogcXVlcnlwb2ludC5kZXNjcmlwdG9yc30pO1xuICAgICAgaWYgKGQgPCBiZXN0RDEpIHtcblx0YmVzdEQyID0gYmVzdEQxO1xuXHRiZXN0RDEgPSBkO1xuXHRiZXN0SW5kZXggPSBrZXlwb2ludEluZGV4ZXNba107XG4gICAgICB9IGVsc2UgaWYgKGQgPCBiZXN0RDIpIHtcblx0YmVzdEQyID0gZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RJbmRleCAhPT0gLTEgJiYgKGJlc3REMiA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgfHwgKDEuMCAqIGJlc3REMSAvIGJlc3REMikgPCBIQU1NSU5HX1RIUkVTSE9MRCkpIHtcbiAgICAgIG1hdGNoZXMucHVzaCh7cXVlcnlwb2ludCwga2V5cG9pbnQ6IGtleXBvaW50c1tiZXN0SW5kZXhdfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRlYnVnTW9kZSkge1xuICAgIGRlYnVnRXh0cmEubWF0Y2hlcyA9IG1hdGNoZXM7XG4gIH1cblxuICBpZiAobWF0Y2hlcy5sZW5ndGggPCBNSU5fTlVNX0lOTElFUlMpIHJldHVybiB7ZGVidWdFeHRyYX07XG5cbiAgY29uc3QgaG91Z2hNYXRjaGVzID0gY29tcHV0ZUhvdWdoTWF0Y2hlcyh7XG4gICAga2V5d2lkdGg6IGtleWZyYW1lLndpZHRoLFxuICAgIGtleWhlaWdodDoga2V5ZnJhbWUuaGVpZ2h0LFxuICAgIHF1ZXJ5d2lkdGgsXG4gICAgcXVlcnloZWlnaHQsXG4gICAgbWF0Y2hlcyxcbiAgfSk7XG5cbiAgaWYgKGRlYnVnTW9kZSkge1xuICAgIGRlYnVnRXh0cmEuaG91Z2hNYXRjaGVzID0gaG91Z2hNYXRjaGVzO1xuICB9XG5cbiAgY29uc3QgSCA9IGNvbXB1dGVIb21vZ3JhcGh5KHtcbiAgICBzcmNQb2ludHM6IGhvdWdoTWF0Y2hlcy5tYXAoKG0pID0+IFttLmtleXBvaW50LngsIG0ua2V5cG9pbnQueV0pLFxuICAgIGRzdFBvaW50czogaG91Z2hNYXRjaGVzLm1hcCgobSkgPT4gW20ucXVlcnlwb2ludC54LCBtLnF1ZXJ5cG9pbnQueV0pLFxuICAgIGtleWZyYW1lLFxuICB9KTtcblxuICBpZiAoSCA9PT0gbnVsbCkgcmV0dXJuIHtkZWJ1Z0V4dHJhfTtcblxuICBjb25zdCBpbmxpZXJNYXRjaGVzID0gX2ZpbmRJbmxpZXJNYXRjaGVzKHtcbiAgICBILFxuICAgIG1hdGNoZXM6IGhvdWdoTWF0Y2hlcyxcbiAgICB0aHJlc2hvbGQ6IElOTElFUl9USFJFU0hPTERcbiAgfSk7XG4gIFxuICBpZiAoZGVidWdNb2RlKSB7XG4gICAgZGVidWdFeHRyYS5pbmxpZXJNYXRjaGVzID0gaW5saWVyTWF0Y2hlcztcbiAgfVxuXG4gIGlmIChpbmxpZXJNYXRjaGVzLmxlbmd0aCA8IE1JTl9OVU1fSU5MSUVSUykgcmV0dXJuIHtkZWJ1Z0V4dHJhfTsgXG5cbiAgLy8gZG8gYW5vdGhlciBsb29wIG9mIG1hdGNoIHVzaW5nIHRoZSBob21vZ3JhcGh5XG4gIGNvbnN0IEhJbnYgPSBtYXRyaXhJbnZlcnNlMzMoSCwgMC4wMDAwMSk7XG4gIGNvbnN0IGRUaHJlc2hvbGQyID0gMTAgKiAxMDtcbiAgY29uc3QgbWF0Y2hlczIgPSBbXTtcbiAgZm9yIChsZXQgaiA9IDA7IGogPCBxdWVyeXBvaW50cy5sZW5ndGg7IGorKykge1xuICAgIGNvbnN0IHF1ZXJ5cG9pbnQgPSBxdWVyeXBvaW50c1tqXTtcbiAgICBjb25zdCBtYXBxdWVyeXBvaW50ID0gbXVsdGlwbHlQb2ludEhvbW9ncmFwaHlJbmhvbW9nZW5vdXMoW3F1ZXJ5cG9pbnQueCwgcXVlcnlwb2ludC55XSwgSEludik7XG5cbiAgICBsZXQgYmVzdEluZGV4ID0gLTE7XG4gICAgbGV0IGJlc3REMSA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIGxldCBiZXN0RDIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICAgIGNvbnN0IGtleXBvaW50cyA9IHF1ZXJ5cG9pbnQubWF4aW1hPyBrZXlmcmFtZS5tYXhpbWFQb2ludHM6IGtleWZyYW1lLm1pbmltYVBvaW50cztcblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwga2V5cG9pbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICBjb25zdCBrZXlwb2ludCA9IGtleXBvaW50c1trXTtcblxuICAgICAgLy8gY2hlY2sgZGlzdGFuY2UgdGhyZXNob2xkXG4gICAgICBjb25zdCBkMiA9IChrZXlwb2ludC54IC0gbWFwcXVlcnlwb2ludFswXSkgKiAoa2V5cG9pbnQueCAtIG1hcHF1ZXJ5cG9pbnRbMF0pXG5cdFx0KyAoa2V5cG9pbnQueSAtIG1hcHF1ZXJ5cG9pbnRbMV0pICogKGtleXBvaW50LnkgLSBtYXBxdWVyeXBvaW50WzFdKTtcbiAgICAgIGlmIChkMiA+IGRUaHJlc2hvbGQyKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgZCA9IGhhbW1pbmdDb21wdXRlKHt2MToga2V5cG9pbnQuZGVzY3JpcHRvcnMsIHYyOiBxdWVyeXBvaW50LmRlc2NyaXB0b3JzfSk7XG4gICAgICBpZiAoZCA8IGJlc3REMSkge1xuXHRiZXN0RDIgPSBiZXN0RDE7XG5cdGJlc3REMSA9IGQ7XG5cdGJlc3RJbmRleCA9IGs7XG4gICAgICB9IGVsc2UgaWYgKGQgPCBiZXN0RDIpIHtcblx0YmVzdEQyID0gZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYmVzdEluZGV4ICE9PSAtMSAmJiAoYmVzdEQyID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCAoMS4wICogYmVzdEQxIC8gYmVzdEQyKSA8IEhBTU1JTkdfVEhSRVNIT0xEKSkge1xuICAgICAgbWF0Y2hlczIucHVzaCh7cXVlcnlwb2ludCwga2V5cG9pbnQ6IGtleXBvaW50c1tiZXN0SW5kZXhdfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRlYnVnTW9kZSkge1xuICAgIGRlYnVnRXh0cmEubWF0Y2hlczIgPSBtYXRjaGVzMjtcbiAgfVxuXG4gIGNvbnN0IGhvdWdoTWF0Y2hlczIgPSBjb21wdXRlSG91Z2hNYXRjaGVzKHtcbiAgICBrZXl3aWR0aDoga2V5ZnJhbWUud2lkdGgsXG4gICAga2V5aGVpZ2h0OiBrZXlmcmFtZS5oZWlnaHQsXG4gICAgcXVlcnl3aWR0aCxcbiAgICBxdWVyeWhlaWdodCxcbiAgICBtYXRjaGVzOiBtYXRjaGVzMixcbiAgfSk7XG5cbiAgaWYgKGRlYnVnTW9kZSkge1xuICAgIGRlYnVnRXh0cmEuaG91Z2hNYXRjaGVzMiA9IGhvdWdoTWF0Y2hlczI7XG4gIH1cblxuICBjb25zdCBIMiA9IGNvbXB1dGVIb21vZ3JhcGh5KHtcbiAgICBzcmNQb2ludHM6IGhvdWdoTWF0Y2hlczIubWFwKChtKSA9PiBbbS5rZXlwb2ludC54LCBtLmtleXBvaW50LnldKSxcbiAgICBkc3RQb2ludHM6IGhvdWdoTWF0Y2hlczIubWFwKChtKSA9PiBbbS5xdWVyeXBvaW50LngsIG0ucXVlcnlwb2ludC55XSksXG4gICAga2V5ZnJhbWUsXG4gIH0pO1xuXG4gIGlmIChIMiA9PT0gbnVsbCkgcmV0dXJuIHtkZWJ1Z0V4dHJhfTtcblxuICBjb25zdCBpbmxpZXJNYXRjaGVzMiA9IF9maW5kSW5saWVyTWF0Y2hlcyh7XG4gICAgSDogSDIsXG4gICAgbWF0Y2hlczogaG91Z2hNYXRjaGVzMixcbiAgICB0aHJlc2hvbGQ6IElOTElFUl9USFJFU0hPTERcbiAgfSk7XG5cbiAgaWYgKGRlYnVnTW9kZSkge1xuICAgIGRlYnVnRXh0cmEuaW5saWVyTWF0Y2hlczIgPSBpbmxpZXJNYXRjaGVzMjtcbiAgfVxuXG4gIHJldHVybiB7SDogSDIsIG1hdGNoZXM6IGlubGllck1hdGNoZXMyLCBkZWJ1Z0V4dHJhfTtcbn07XG5cbmNvbnN0IF9xdWVyeSA9ICh7bm9kZSwga2V5cG9pbnRzLCBxdWVyeXBvaW50LCBxdWV1ZSwga2V5cG9pbnRJbmRleGVzLCBudW1Qb3B9KSA9PiB7XG4gIGlmIChub2RlLmxlYWYpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUucG9pbnRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlwb2ludEluZGV4ZXMucHVzaChub2RlLnBvaW50SW5kZXhlc1tpXSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGRpc3RhbmNlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZE5vZGUgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgIGNvbnN0IGNlbnRlclBvaW50SW5kZXggPSBjaGlsZE5vZGUuY2VudGVyUG9pbnRJbmRleDtcbiAgICBjb25zdCBkID0gaGFtbWluZ0NvbXB1dGUoe3YxOiBrZXlwb2ludHNbY2VudGVyUG9pbnRJbmRleF0uZGVzY3JpcHRvcnMsIHYyOiBxdWVyeXBvaW50LmRlc2NyaXB0b3JzfSk7XG4gICAgZGlzdGFuY2VzLnB1c2goZCk7XG4gIH1cblxuICBsZXQgbWluRCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBtaW5EID0gTWF0aC5taW4obWluRCwgZGlzdGFuY2VzW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGlmIChkaXN0YW5jZXNbaV0gIT09IG1pbkQpIHtcbiAgICAgIHF1ZXVlLnB1c2goe25vZGU6IG5vZGUuY2hpbGRyZW5baV0sIGQ6IGRpc3RhbmNlc1tpXX0pO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZGlzdGFuY2VzW2ldID09PSBtaW5EKSB7XG4gICAgICBfcXVlcnkoe25vZGU6IG5vZGUuY2hpbGRyZW5baV0sIGtleXBvaW50cywgcXVlcnlwb2ludCwgcXVldWUsIGtleXBvaW50SW5kZXhlcywgbnVtUG9wfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG51bVBvcCA8IENMVVNURVJfTUFYX1BPUCAmJiBxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qge25vZGUsIGR9ID0gcXVldWUucG9wKCk7XG4gICAgbnVtUG9wICs9IDE7XG4gICAgX3F1ZXJ5KHtub2RlLCBrZXlwb2ludHMsIHF1ZXJ5cG9pbnQsIHF1ZXVlLCBrZXlwb2ludEluZGV4ZXMsIG51bVBvcH0pO1xuICB9XG59O1xuXG5jb25zdCBfZmluZElubGllck1hdGNoZXMgPSAob3B0aW9ucykgPT4ge1xuICBjb25zdCB7SCwgbWF0Y2hlcywgdGhyZXNob2xkfSA9IG9wdGlvbnM7XG5cbiAgY29uc3QgdGhyZXNob2xkMiA9IHRocmVzaG9sZCAqIHRocmVzaG9sZDtcblxuICBjb25zdCBnb29kTWF0Y2hlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBxdWVyeXBvaW50ID0gbWF0Y2hlc1tpXS5xdWVyeXBvaW50O1xuICAgIGNvbnN0IGtleXBvaW50ID0gbWF0Y2hlc1tpXS5rZXlwb2ludDtcbiAgICBjb25zdCBtcCA9IG11bHRpcGx5UG9pbnRIb21vZ3JhcGh5SW5ob21vZ2Vub3VzKFtrZXlwb2ludC54LCBrZXlwb2ludC55XSwgSCk7XG4gICAgY29uc3QgZDIgPSAobXBbMF0gLSBxdWVyeXBvaW50LngpICogKG1wWzBdIC0gcXVlcnlwb2ludC54KSArIChtcFsxXSAtIHF1ZXJ5cG9pbnQueSkgKiAobXBbMV0gLSBxdWVyeXBvaW50LnkpO1xuICAgIGlmIChkMiA8PSB0aHJlc2hvbGQyKSB7XG4gICAgICBnb29kTWF0Y2hlcy5wdXNoKCBtYXRjaGVzW2ldICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBnb29kTWF0Y2hlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1hdGNoXG59XG4iLCJjb25zdCB7TWF0cml4LCBpbnZlcnNlfSA9IHJlcXVpcmUoJ21sLW1hdHJpeCcpO1xuY29uc3Qge2NyZWF0ZVJhbmRvbWl6ZXJ9ID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9taXplci5qcycpO1xuY29uc3Qge3F1YWRyaWxhdGVyYWxDb252ZXgsIG1hdHJpeEludmVyc2UzMywgc21hbGxlc3RUcmlhbmdsZUFyZWEsIG11bHRpcGx5UG9pbnRIb21vZ3JhcGh5SW5ob21vZ2Vub3VzLCBjaGVja1RocmVlUG9pbnRzQ29uc2lzdGVudCwgY2hlY2tGb3VyUG9pbnRzQ29uc2lzdGVudCwgZGV0ZXJtaW5hbnR9ID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2VvbWV0cnkuanMnKTtcbmNvbnN0IHtzb2x2ZUhvbW9ncmFwaHl9ID0gcmVxdWlyZSgnLi4vdXRpbHMvaG9tb2dyYXBoeScpO1xuXG5jb25zdCBDQVVDSFlfU0NBTEUgPSAwLjAxO1xuY29uc3QgQ0hVTktfU0laRSA9IDEwO1xuY29uc3QgTlVNX0hZUE9USEVTRVMgPSAyMDtcbmNvbnN0IE5VTV9IWVBPVEhFU0VTX1FVSUNLID0gMTA7XG5cbi8vIFVzaW5nIFJBTlNBQyB0byBlc3RpbWF0ZSBob21vZ3JhcGh5XG5jb25zdCBjb21wdXRlSG9tb2dyYXBoeSA9IChvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHtzcmNQb2ludHMsIGRzdFBvaW50cywga2V5ZnJhbWUsIHF1aWNrTW9kZX0gPSBvcHRpb25zO1xuXG4gIC8vIHRlc3RQb2ludHMgaXMgZm91ciBjb3JuZXJzIG9mIGtleWZyYW1lXG4gIGNvbnN0IHRlc3RQb2ludHMgPSBbXG4gICAgWzAsIDBdLFxuICAgIFtrZXlmcmFtZS53aWR0aCwgMF0sXG4gICAgW2tleWZyYW1lLndpZHRoLCBrZXlmcmFtZS5oZWlnaHRdLFxuICAgIFswLCBrZXlmcmFtZS5oZWlnaHRdXG4gIF1cblxuICBjb25zdCBzYW1wbGVTaXplID0gNDsgLy8gdXNlIGZvdXIgcG9pbnRzIHRvIGNvbXB1dGUgaG9tb2dyYXBoeVxuICBpZiAoc3JjUG9pbnRzLmxlbmd0aCA8IHNhbXBsZVNpemUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHNjYWxlID0gQ0FVQ0hZX1NDQUxFO1xuICBjb25zdCBvbmVPdmVyU2NhbGUyID0gMS4wIC8gKHNjYWxlICogc2NhbGUpO1xuICBjb25zdCBjaHVja1NpemUgPSBNYXRoLm1pbihDSFVOS19TSVpFLCBzcmNQb2ludHMubGVuZ3RoKTtcblxuICBjb25zdCByYW5kb21pemVyID0gY3JlYXRlUmFuZG9taXplcigpO1xuXG4gIGNvbnN0IHBlcm0gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNQb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICBwZXJtW2ldID0gaTtcbiAgfVxuXG4gIHJhbmRvbWl6ZXIuYXJyYXlTaHVmZmxlKHthcnI6IHBlcm0sIHNhbXBsZVNpemU6IHBlcm0ubGVuZ3RofSk7XG5cbiAgY29uc3QgbnVtSHlwb3RoZXNpcyA9IHF1aWNrTW9kZT8gTlVNX0hZUE9USEVTRVNfUVVJQ0s6IE5VTV9IWVBPVEhFU0VTO1xuICBjb25zdCBtYXhUcmlhbHMgPSBudW1IeXBvdGhlc2lzICogMjtcblxuICAvLyBidWlsZCBudW1lcm91cyBoeXBvdGhlc2VzIGJ5IHJhbmRvbWluZyBkcmF3IGZvdXIgcG9pbnRzXG4gIC8vIFRPRE86IG9wdGltaXplOiBpZiBudW1iZXIgb2YgcG9pbnRzIGlzIGxlc3MgdGhhbiBjZXJ0YWluIG51bWJlciwgY2FuIGJydXRlIGZvcmNlIGFsbCBjb21iaW5hdGlvbnNcbiAgbGV0IHRyaWFsID0gMDtcbiAgY29uc3QgSHMgPSBbXTtcbiAgd2hpbGUgKHRyaWFsIDwgbWF4VHJpYWxzICYmIEhzLmxlbmd0aCA8IG51bUh5cG90aGVzaXMpIHtcbiAgICB0cmlhbCArPTE7XG5cbiAgICByYW5kb21pemVyLmFycmF5U2h1ZmZsZSh7YXJyOiBwZXJtLCBzYW1wbGVTaXplOiBzYW1wbGVTaXplfSk7XG5cbiAgICAvLyB0aGVpciByZWxhdGl2ZSBwb3NpdGlvbnMgbWF0Y2ggZWFjaCBvdGhlclxuICAgIGlmICghY2hlY2tGb3VyUG9pbnRzQ29uc2lzdGVudChcbiAgICAgIHNyY1BvaW50c1twZXJtWzBdXSwgc3JjUG9pbnRzW3Blcm1bMV1dLCBzcmNQb2ludHNbcGVybVsyXV0sIHNyY1BvaW50c1twZXJtWzNdXSxcbiAgICAgIGRzdFBvaW50c1twZXJtWzBdXSwgZHN0UG9pbnRzW3Blcm1bMV1dLCBkc3RQb2ludHNbcGVybVsyXV0sIGRzdFBvaW50c1twZXJtWzNdXSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IEggPSBzb2x2ZUhvbW9ncmFwaHkoXG4gICAgICBbc3JjUG9pbnRzW3Blcm1bMF1dLCBzcmNQb2ludHNbcGVybVsxXV0sIHNyY1BvaW50c1twZXJtWzJdXSwgc3JjUG9pbnRzW3Blcm1bM11dXSxcbiAgICAgIFtkc3RQb2ludHNbcGVybVswXV0sIGRzdFBvaW50c1twZXJtWzFdXSwgZHN0UG9pbnRzW3Blcm1bMl1dLCBkc3RQb2ludHNbcGVybVszXV1dLFxuICAgICk7XG4gICAgaWYgKEggPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgaWYoIV9jaGVja0hvbW9ncmFwaHlQb2ludHNHZW9tZXRyaWNhbGx5Q29uc2lzdGVudCh7SCwgdGVzdFBvaW50c30pKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBIcy5wdXNoKEgpO1xuICB9XG5cbiAgaWYgKEhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gcGljayB0aGUgYmVzdCBoeXBvdGhlc2lzXG4gIGNvbnN0IGh5cG90aGVzZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBIcy5sZW5ndGg7IGkrKykge1xuICAgIGh5cG90aGVzZXMucHVzaCh7XG4gICAgICBIOiBIc1tpXSxcbiAgICAgIGNvc3Q6IDBcbiAgICB9KVxuICB9XG5cbiAgbGV0IGN1ckNodWNrU2l6ZSA9IGNodWNrU2l6ZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNQb2ludHMubGVuZ3RoICYmIGh5cG90aGVzZXMubGVuZ3RoID4gMjsgaSArPSBjdXJDaHVja1NpemUpIHtcbiAgICBjdXJDaHVja1NpemUgPSBNYXRoLm1pbihjaHVja1NpemUsIHNyY1BvaW50cy5sZW5ndGggLSBpKTtcbiAgICBsZXQgY2h1Y2tFbmQgPSBpICsgY3VyQ2h1Y2tTaXplO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBoeXBvdGhlc2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICBmb3IgKGxldCBrID0gaTsgayA8IGNodWNrRW5kOyBrKyspIHtcbiAgICAgICAgY29uc3QgY29zdCA9IF9jYXVjaHlQcm9qZWN0aXZlUmVwcm9qZWN0aW9uQ29zdCh7SDogaHlwb3RoZXNlc1tqXS5ILCBzcmNQb2ludDogc3JjUG9pbnRzW2tdLCBkc3RQb2ludDogZHN0UG9pbnRzW2tdLCBvbmVPdmVyU2NhbGUyfSk7XG4gICAgICAgIGh5cG90aGVzZXNbal0uY29zdCArPSBjb3N0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGh5cG90aGVzZXMuc29ydCgoaDEsIGgyKSA9PiB7cmV0dXJuIGgxLmNvc3QgLSBoMi5jb3N0fSk7XG4gICAgaHlwb3RoZXNlcy5zcGxpY2UoLU1hdGguZmxvb3IoKGh5cG90aGVzZXMubGVuZ3RoKzEpLzIpKTsgLy8ga2VlcCB0aGUgYmVzdCBoYWxmXG4gIH1cblxuICBsZXQgZmluYWxIID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBoeXBvdGhlc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgSCA9IF9ub3JtYWxpemVIb21vZ3JhcGh5KHtpbkg6IGh5cG90aGVzZXNbaV0uSH0pO1xuICAgIGlmIChfY2hlY2tIZXVyaXN0aWNzKHtIOiBILCB0ZXN0UG9pbnRzLCBrZXlmcmFtZX0pKSB7XG4gICAgICBmaW5hbEggPSBIO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaW5hbEg7XG59XG5cbmNvbnN0IF9jaGVja0hldXJpc3RpY3MgPSAoe0gsIHRlc3RQb2ludHMsIGtleWZyYW1lfSkgPT4ge1xuICBjb25zdCBISW52ID0gbWF0cml4SW52ZXJzZTMzKEgsIDAuMDAwMDEpO1xuICBpZiAoSEludiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IG1wID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXN0UG9pbnRzLmxlbmd0aDsgaSsrKSB7IC8vIDQgdGVzdCBwb2ludHMsIGNvcm5lciBvZiBrZXlmcmFtZVxuICAgIG1wLnB1c2gobXVsdGlwbHlQb2ludEhvbW9ncmFwaHlJbmhvbW9nZW5vdXModGVzdFBvaW50c1tpXSwgSEludikpO1xuICB9XG4gIGNvbnN0IHNtYWxsQXJlYSA9IHNtYWxsZXN0VHJpYW5nbGVBcmVhKG1wWzBdLCBtcFsxXSwgbXBbMl0sIG1wWzNdKTtcblxuICBpZiAoc21hbGxBcmVhIDwga2V5ZnJhbWUud2lkdGggKiBrZXlmcmFtZS5oZWlnaHQgKiAwLjAwMDEpIHJldHVybiBmYWxzZTtcblxuICBpZiAoIXF1YWRyaWxhdGVyYWxDb252ZXgobXBbMF0sIG1wWzFdLCBtcFsyXSwgbXBbM10pKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IF9ub3JtYWxpemVIb21vZ3JhcGh5ID0gKHtpbkh9KSA9PiB7XG4gIGNvbnN0IG9uZU92ZXIgPSAxLjAgLyBpbkhbOF07XG5cbiAgY29uc3QgSCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIEhbaV0gPSBpbkhbaV0gKiBvbmVPdmVyO1xuICB9XG4gIEhbOF0gPSAxLjA7XG4gIHJldHVybiBIO1xufVxuXG5jb25zdCBfY2F1Y2h5UHJvamVjdGl2ZVJlcHJvamVjdGlvbkNvc3QgPSAoe0gsIHNyY1BvaW50LCBkc3RQb2ludCwgb25lT3ZlclNjYWxlMn0pID0+IHtcbiAgY29uc3QgeCA9IG11bHRpcGx5UG9pbnRIb21vZ3JhcGh5SW5ob21vZ2Vub3VzKHNyY1BvaW50LCBIKTtcbiAgY29uc3QgZiA9W1xuICAgIHhbMF0gLSBkc3RQb2ludFswXSxcbiAgICB4WzFdIC0gZHN0UG9pbnRbMV1cbiAgXTtcbiAgcmV0dXJuIE1hdGgubG9nKDEgKyAoZlswXSpmWzBdK2ZbMV0qZlsxXSkgKiBvbmVPdmVyU2NhbGUyKTtcbn1cblxuY29uc3QgX2NoZWNrSG9tb2dyYXBoeVBvaW50c0dlb21ldHJpY2FsbHlDb25zaXN0ZW50ID0gKHtILCB0ZXN0UG9pbnRzfSkgPT4ge1xuICBjb25zdCBtYXBwZWRQb2ludHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXN0UG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwcGVkUG9pbnRzW2ldID0gbXVsdGlwbHlQb2ludEhvbW9ncmFwaHlJbmhvbW9nZW5vdXModGVzdFBvaW50c1tpXSwgSCk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXN0UG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaTEgPSBpO1xuICAgIGNvbnN0IGkyID0gKGkrMSkgJSB0ZXN0UG9pbnRzLmxlbmd0aDtcbiAgICBjb25zdCBpMyA9IChpKzIpICUgdGVzdFBvaW50cy5sZW5ndGg7XG4gICAgaWYgKCFjaGVja1RocmVlUG9pbnRzQ29uc2lzdGVudChcbiAgICAgIHRlc3RQb2ludHNbaTFdLCB0ZXN0UG9pbnRzW2kyXSwgdGVzdFBvaW50c1tpM10sXG4gICAgICBtYXBwZWRQb2ludHNbaTFdLCBtYXBwZWRQb2ludHNbaTJdLCBtYXBwZWRQb2ludHNbaTNdKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcHV0ZUhvbW9ncmFwaHksXG59XG4iLCIvLyBjaGVjayB3aGljaCBzaWRlIHBvaW50IEMgb24gdGhlIGxpbmUgZnJvbSBBIHRvIEJcbmNvbnN0IGxpbmVQb2ludFNpZGUgPSAoQSwgQiwgQykgPT4ge1xuICByZXR1cm4gKChCWzBdLUFbMF0pKihDWzFdLUFbMV0pLShCWzFdLUFbMV0pKihDWzBdLUFbMF0pKTtcbn1cblxuLy8gc3JjUG9pbnRzLCBkc3RQb2ludHM6IGFycmF5IG9mIGZvdXIgZWxlbWVudHMgW3gsIHldXG5jb25zdCBjaGVja0ZvdXJQb2ludHNDb25zaXN0ZW50ID0gKHgxLCB4MiwgeDMsIHg0LCB4MXAsIHgycCwgeDNwLCB4NHApID0+IHtcbiAgaWYgKChsaW5lUG9pbnRTaWRlKHgxLCB4MiwgeDMpID4gMCkgIT09IChsaW5lUG9pbnRTaWRlKHgxcCwgeDJwLCB4M3ApID4gMCkpIHJldHVybiBmYWxzZTtcbiAgaWYgKChsaW5lUG9pbnRTaWRlKHgyLCB4MywgeDQpID4gMCkgIT09IChsaW5lUG9pbnRTaWRlKHgycCwgeDNwLCB4NHApID4gMCkpIHJldHVybiBmYWxzZTtcbiAgaWYgKChsaW5lUG9pbnRTaWRlKHgzLCB4NCwgeDEpID4gMCkgIT09IChsaW5lUG9pbnRTaWRlKHgzcCwgeDRwLCB4MXApID4gMCkpIHJldHVybiBmYWxzZTtcbiAgaWYgKChsaW5lUG9pbnRTaWRlKHg0LCB4MSwgeDIpID4gMCkgIT09IChsaW5lUG9pbnRTaWRlKHg0cCwgeDFwLCB4MnApID4gMCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IGNoZWNrVGhyZWVQb2ludHNDb25zaXN0ZW50ID0gKHgxLCB4MiwgeDMsIHgxcCwgeDJwLCB4M3ApID0+IHtcbiAgaWYgKChsaW5lUG9pbnRTaWRlKHgxLCB4MiwgeDMpID4gMCkgIT09IChsaW5lUG9pbnRTaWRlKHgxcCwgeDJwLCB4M3ApID4gMCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IGRldGVybWluYW50ID0gKEEpID0+IHtcbiAgY29uc3QgQzEgPSAgQVs0XSAqIEFbOF0gLSBBWzVdICogQVs3XTtcbiAgY29uc3QgQzIgPSAgQVszXSAqIEFbOF0gLSBBWzVdICogQVs2XTtcbiAgY29uc3QgQzMgPSAgQVszXSAqIEFbN10gLSBBWzRdICogQVs2XTtcbiAgcmV0dXJuIEFbMF0gKiBDMSAtIEFbMV0gKiBDMiArIEFbMl0gKiBDMztcbn1cblxuY29uc3QgbWF0cml4SW52ZXJzZTMzID0gKEEsIHRocmVzaG9sZCkgPT4ge1xuICBjb25zdCBkZXQgPSBkZXRlcm1pbmFudChBKTtcbiAgaWYgKE1hdGguYWJzKGRldCkgPD0gdGhyZXNob2xkKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgb25lT3ZlciA9IDEuMCAvIGRldDtcblxuICBjb25zdCBCID0gW1xuICAgIChBWzRdICogQVs4XSAtIEFbNV0gKiBBWzddKSAqIG9uZU92ZXIsXG4gICAgKEFbMl0gKiBBWzddIC0gQVsxXSAqIEFbOF0pICogb25lT3ZlcixcbiAgICAoQVsxXSAqIEFbNV0gLSBBWzJdICogQVs0XSkgKiBvbmVPdmVyLFxuICAgIChBWzVdICogQVs2XSAtIEFbM10gKiBBWzhdKSAqIG9uZU92ZXIsXG4gICAgKEFbMF0gKiBBWzhdIC0gQVsyXSAqIEFbNl0pICogb25lT3ZlcixcbiAgICAoQVsyXSAqIEFbM10gLSBBWzBdICogQVs1XSkgKiBvbmVPdmVyLFxuICAgIChBWzNdICogQVs3XSAtIEFbNF0gKiBBWzZdKSAqIG9uZU92ZXIsXG4gICAgKEFbMV0gKiBBWzZdIC0gQVswXSAqIEFbN10pICogb25lT3ZlcixcbiAgICAoQVswXSAqIEFbNF0gLSBBWzFdICogQVszXSkgKiBvbmVPdmVyLFxuICBdO1xuICByZXR1cm4gQjtcbn1cblxuY29uc3QgbWF0cml4TXVsMzMgPSAoQSwgQikgPT4ge1xuICBjb25zdCBDID0gW107XG4gIENbMF0gPSBBWzBdKkJbMF0gKyBBWzFdKkJbM10gKyBBWzJdKkJbNl07XG4gIENbMV0gPSBBWzBdKkJbMV0gKyBBWzFdKkJbNF0gKyBBWzJdKkJbN107XG4gIENbMl0gPSBBWzBdKkJbMl0gKyBBWzFdKkJbNV0gKyBBWzJdKkJbOF07XG4gIENbM10gPSBBWzNdKkJbMF0gKyBBWzRdKkJbM10gKyBBWzVdKkJbNl07XG4gIENbNF0gPSBBWzNdKkJbMV0gKyBBWzRdKkJbNF0gKyBBWzVdKkJbN107XG4gIENbNV0gPSBBWzNdKkJbMl0gKyBBWzRdKkJbNV0gKyBBWzVdKkJbOF07XG4gIENbNl0gPSBBWzZdKkJbMF0gKyBBWzddKkJbM10gKyBBWzhdKkJbNl07XG4gIENbN10gPSBBWzZdKkJbMV0gKyBBWzddKkJbNF0gKyBBWzhdKkJbN107XG4gIENbOF0gPSBBWzZdKkJbMl0gKyBBWzddKkJbNV0gKyBBWzhdKkJbOF07XG4gIHJldHVybiBDO1xufVxuXG5jb25zdCBtdWx0aXBseVBvaW50SG9tb2dyYXBoeUluaG9tb2dlbm91cyA9ICh4LCBIKSA9PiB7XG4gIGNvbnN0IHcgPSBIWzZdKnhbMF0gKyBIWzddKnhbMV0gKyBIWzhdO1xuICBjb25zdCB4cCA9IFtdO1xuICB4cFswXSA9IChIWzBdKnhbMF0gKyBIWzFdKnhbMV0gKyBIWzJdKS93O1xuICB4cFsxXSA9IChIWzNdKnhbMF0gKyBIWzRdKnhbMV0gKyBIWzVdKS93O1xuICByZXR1cm4geHA7XG59XG5cbmNvbnN0IHNtYWxsZXN0VHJpYW5nbGVBcmVhID0gKHgxLCB4MiwgeDMsIHg0KSA9PiB7XG4gIGNvbnN0IHYxMiA9IF92ZWN0b3IoeDIsIHgxKTtcbiAgY29uc3QgdjEzID0gX3ZlY3Rvcih4MywgeDEpO1xuICBjb25zdCB2MTQgPSBfdmVjdG9yKHg0LCB4MSk7XG4gIGNvbnN0IHYzMiA9IF92ZWN0b3IoeDIsIHgzKTtcbiAgY29uc3QgdjM0ID0gX3ZlY3Rvcih4NCwgeDMpO1xuICBjb25zdCBhMSA9IF9hcmVhT2ZUcmlhbmdsZSh2MTIsIHYxMyk7XG4gIGNvbnN0IGEyID0gX2FyZWFPZlRyaWFuZ2xlKHYxMywgdjE0KTtcbiAgY29uc3QgYTMgPSBfYXJlYU9mVHJpYW5nbGUodjEyLCB2MTQpO1xuICBjb25zdCBhNCA9IF9hcmVhT2ZUcmlhbmdsZSh2MzIsIHYzNCk7XG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1pbihNYXRoLm1pbihhMSwgYTIpLCBhMyksIGE0KTtcbn1cblxuLy8gY2hlY2sgaWYgZm91ciBwb2ludHMgZm9ybSBhIGNvbnZleCBxdWFkcmlsYXRlcm5hbC5cbi8vIGFsbCBmb3VyIGNvbWJpbmF0aW9ucyBzaG91bGQgaGF2ZSBzYW1lIHNpZ25cbmNvbnN0IHF1YWRyaWxhdGVyYWxDb252ZXggPSAoeDEsIHgyLCB4MywgeDQpID0+IHtcbiAgY29uc3QgZmlyc3QgPSBsaW5lUG9pbnRTaWRlKHgxLCB4MiwgeDMpIDw9IDA7XG4gIGlmICggKGxpbmVQb2ludFNpZGUoeDIsIHgzLCB4NCkgPD0gMCkgIT09IGZpcnN0KSByZXR1cm4gZmFsc2U7XG4gIGlmICggKGxpbmVQb2ludFNpZGUoeDMsIHg0LCB4MSkgPD0gMCkgIT09IGZpcnN0KSByZXR1cm4gZmFsc2U7XG4gIGlmICggKGxpbmVQb2ludFNpZGUoeDQsIHgxLCB4MikgPD0gMCkgIT09IGZpcnN0KSByZXR1cm4gZmFsc2U7XG5cbiAgLy9pZiAobGluZVBvaW50U2lkZSh4MSwgeDIsIHgzKSA8PSAwKSByZXR1cm4gZmFsc2U7XG4gIC8vaWYgKGxpbmVQb2ludFNpZGUoeDIsIHgzLCB4NCkgPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAvL2lmIChsaW5lUG9pbnRTaWRlKHgzLCB4NCwgeDEpIDw9IDApIHJldHVybiBmYWxzZTtcbiAgLy9pZiAobGluZVBvaW50U2lkZSh4NCwgeDEsIHgyKSA8PSAwKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5jb25zdCBfdmVjdG9yID0gKGEsIGIpID0+IHtcbiAgcmV0dXJuIFtcbiAgICBhWzBdIC0gYlswXSxcbiAgICBhWzFdIC0gYlsxXVxuICBdXG59XG5cbmNvbnN0IF9hcmVhT2ZUcmlhbmdsZSA9ICh1LCB2KSA9PiB7XG4gIGNvbnN0IGEgPSB1WzBdKnZbMV0gLSB1WzFdKnZbMF07XG4gIHJldHVybiBNYXRoLmFicyhhKSAqIDAuNTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1hdHJpeEludmVyc2UzMyxcbiAgbWF0cml4TXVsMzMsXG4gIHF1YWRyaWxhdGVyYWxDb252ZXgsXG4gIHNtYWxsZXN0VHJpYW5nbGVBcmVhLFxuICBtdWx0aXBseVBvaW50SG9tb2dyYXBoeUluaG9tb2dlbm91cyxcbiAgY2hlY2tUaHJlZVBvaW50c0NvbnNpc3RlbnQsXG4gIGNoZWNrRm91clBvaW50c0NvbnNpc3RlbnQsXG4gIGRldGVybWluYW50XG59XG5cbiIsImNvbnN0IHtNYXRyaXgsIGludmVyc2V9ID0gcmVxdWlyZSgnbWwtbWF0cml4Jyk7XG5cbmNvbnN0IHNvbHZlSG9tb2dyYXBoeSA9IChzcmNQb2ludHMsIGRzdFBvaW50cykgPT4ge1xuICBjb25zdCB7bm9ybVBvaW50czogbm9ybVNyY1BvaW50cywgcGFyYW06IHNyY1BhcmFtfSA9IF9ub3JtYWxpemVQb2ludHMoc3JjUG9pbnRzKTtcbiAgY29uc3Qge25vcm1Qb2ludHM6IG5vcm1Ec3RQb2ludHMsIHBhcmFtOiBkc3RQYXJhbX0gPSBfbm9ybWFsaXplUG9pbnRzKGRzdFBvaW50cyk7XG5cbiAgY29uc3QgbnVtID0gbm9ybURzdFBvaW50cy5sZW5ndGg7XG4gIGNvbnN0IEFEYXRhID0gW107XG4gIGNvbnN0IEJEYXRhID0gW107XG4gIGZvciAobGV0IGogPSAwOyBqIDwgbnVtOyBqKyspIHtcbiAgICBjb25zdCByb3cxID0gW1xuICAgICAgbm9ybVNyY1BvaW50c1tqXVswXSxcbiAgICAgIG5vcm1TcmNQb2ludHNbal1bMV0sXG4gICAgICAxLFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICAwLFxuICAgICAgLShub3JtU3JjUG9pbnRzW2pdWzBdICogbm9ybURzdFBvaW50c1tqXVswXSksXG4gICAgICAtKG5vcm1TcmNQb2ludHNbal1bMV0gKiBub3JtRHN0UG9pbnRzW2pdWzBdKSxcbiAgICBdO1xuICAgIGNvbnN0IHJvdzIgPSBbXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICBub3JtU3JjUG9pbnRzW2pdWzBdLFxuICAgICAgbm9ybVNyY1BvaW50c1tqXVsxXSxcbiAgICAgIDEsXG4gICAgICAtKG5vcm1TcmNQb2ludHNbal1bMF0gKiBub3JtRHN0UG9pbnRzW2pdWzFdKSxcbiAgICAgIC0obm9ybVNyY1BvaW50c1tqXVsxXSAqIG5vcm1Ec3RQb2ludHNbal1bMV0pLFxuICAgIF07XG4gICAgQURhdGEucHVzaChyb3cxKTtcbiAgICBBRGF0YS5wdXNoKHJvdzIpO1xuXG4gICAgQkRhdGEucHVzaChbbm9ybURzdFBvaW50c1tqXVswXV0pO1xuICAgIEJEYXRhLnB1c2goW25vcm1Ec3RQb2ludHNbal1bMV1dKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgQSA9IG5ldyBNYXRyaXgoQURhdGEpO1xuICAgIGNvbnN0IEIgPSBuZXcgTWF0cml4KEJEYXRhKTtcbiAgICBjb25zdCBBVCA9IEEudHJhbnNwb3NlKCk7XG4gICAgY29uc3QgQVRBID0gQVQubW11bChBKTtcbiAgICBjb25zdCBBVEIgPSBBVC5tbXVsKEIpO1xuICAgIGNvbnN0IEFUQUludiA9IGludmVyc2UoQVRBKTtcbiAgICBjb25zdCBDID0gQVRBSW52Lm1tdWwoQVRCKS50bzFEQXJyYXkoKTtcbiAgICBjb25zdCBIID0gX2Rlbm9ybWFsaXplSG9tb2dyYXBoeShDLCBzcmNQYXJhbSwgZHN0UGFyYW0pO1xuICAgIHJldHVybiBIO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gY2VudHJvaWQgYXQgb3JpZ2luIGFuZCBhdmcgZGlzdGFuY2UgZnJvbSBvcmlnaW4gaXMgc3FydCgyKVxuY29uc3QgX25vcm1hbGl6ZVBvaW50cyA9IChjb29yZHMpID0+IHtcbiAgLy9yZXR1cm4ge25vcm1hbGl6ZWRDb29yZHM6IGNvb3JkcywgcGFyYW06IHttZWFuWDogMCwgbWVhblk6IDAsIHM6IDF9fTsgLy8gc2tpcCBub3JtYWxpemF0aW9uXG5cbiAgbGV0IHN1bVggPSAwO1xuICBsZXQgc3VtWSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgc3VtWCArPSBjb29yZHNbaV1bMF07XG4gICAgc3VtWSArPSBjb29yZHNbaV1bMV07XG4gIH1cbiAgbGV0IG1lYW5YID0gc3VtWCAvIGNvb3Jkcy5sZW5ndGg7XG4gIGxldCBtZWFuWSA9IHN1bVkgLyBjb29yZHMubGVuZ3RoO1xuXG4gIGxldCBzdW1EaWZmID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkaWZmWCA9IGNvb3Jkc1tpXVswXSAtIG1lYW5YO1xuICAgIGNvbnN0IGRpZmZZID0gY29vcmRzW2ldWzFdIC0gbWVhblk7XG4gICAgc3VtRGlmZiArPSBNYXRoLnNxcnQoZGlmZlggKiBkaWZmWCArIGRpZmZZICogZGlmZlkpO1xuICB9XG4gIGxldCBzID0gTWF0aC5zcXJ0KDIpICogY29vcmRzLmxlbmd0aCAvIHN1bURpZmY7XG5cbiAgY29uc3Qgbm9ybVBvaW50cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIG5vcm1Qb2ludHMucHVzaChbXG4gICAgICAoY29vcmRzW2ldWzBdIC0gbWVhblgpICogcyxcbiAgICAgIChjb29yZHNbaV1bMV0gLSBtZWFuWSkgKiBzLFxuICAgIF0pO1xuICB9XG4gIHJldHVybiB7bm9ybVBvaW50cywgcGFyYW06IHttZWFuWCwgbWVhblksIHN9fTtcbn1cblxuLy8gRGVub3JtYWxpemUgaG9tb2dyYXBoeVxuLy8gd2hlcmUgVCBpcyB0aGUgbm9ybWFsaXphdGlvbiBtYXRyaXgsIGkuZS5cbi8vXG4vLyAgICAgWzEgIDAgIC1tZWFuWF1cbi8vIFQgPSBbMCAgMSAgLW1lYW5ZXVxuLy8gICAgIFswICAwICAgICAxL3NdXG4vL1xuLy8gICAgICAgICAgWzEgIDAgIHMqbWVhblhdXG4vLyBpbnYoVCkgPSBbMCAgMSAgcyptZWFuWV1cbi8vIFx0ICAgIFswICAwICAgICAgICBzXVxuLy9cbi8vIEggPSBpbnYoVGRzdCkgKiBIbiAqIFRzcmNcbi8vXG4vLyBAcGFyYW0ge1xuLy8gICBuSDogbm9ybUgsXG4vLyAgIHNyY1BhcmFtOiBwYXJhbSBvZiBzcmMgdHJhbnNmb3JtLFxuLy8gICBkc3RQYXJhbTogcGFyYW0gb2YgZHN0IHRyYW5zZm9ybVxuLy8gfVxuY29uc3QgX2Rlbm9ybWFsaXplSG9tb2dyYXBoeSA9IChuSCwgc3JjUGFyYW0sIGRzdFBhcmFtKSA9PiB7XG4gIC8qXG4gIE1hdHJpeCB2ZXJzaW9uXG4gIGNvbnN0IG5vcm1IID0gbmV3IE1hdHJpeChbXG4gICAgW25IWzBdLCBuSFsxXSwgbkhbMl1dLFxuICAgIFtuSFszXSwgbkhbNF0sIG5IWzVdXSxcbiAgICBbbkhbNl0sIG5IWzddLCAxXSxcbiAgXSk7XG4gIGNvbnN0IFRzcmMgPSBuZXcgTWF0cml4KFtcbiAgICBbMSwgMCwgLXNyY1BhcmFtLm1lYW5YXSxcbiAgICBbMCwgMSwgLXNyY1BhcmFtLm1lYW5ZXSxcbiAgICBbMCwgMCwgICAgMS9zcmNQYXJhbS5zXSxcbiAgXSk7XG5cbiAgY29uc3QgaW52VGRzdCA9IG5ldyBNYXRyaXgoW1xuICAgIFsxLCAwLCBkc3RQYXJhbS5zICogZHN0UGFyYW0ubWVhblhdLFxuICAgIFswLCAxLCBkc3RQYXJhbS5zICogZHN0UGFyYW0ubWVhblldLFxuICAgIFswLCAwLCBkc3RQYXJhbS5zXSxcbiAgXSk7XG4gIGNvbnN0IEggPSBpbnZUZHN0Lm1tdWwobm9ybUgpLm1tdWwoVHNyYyk7XG4gICovXG5cbiAgLy8gcGxhaW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIGFib3ZlIHVzaW5nIE1hdHJpeFxuICBjb25zdCBzTWVhblggPSBkc3RQYXJhbS5zICogZHN0UGFyYW0ubWVhblg7XG4gIGNvbnN0IHNNZWFuWSA9IGRzdFBhcmFtLnMgKiBkc3RQYXJhbS5tZWFuWTtcblxuICBjb25zdCBIID0gW1xuICAgICAgbkhbMF0gKyBzTWVhblggKiBuSFs2XSwgXG4gICAgICBuSFsxXSArIHNNZWFuWCAqIG5IWzddLFxuICAgICAgKG5IWzBdICsgc01lYW5YICogbkhbNl0pICogLXNyY1BhcmFtLm1lYW5YICsgKG5IWzFdICsgc01lYW5YICogbkhbN10pICogLXNyY1BhcmFtLm1lYW5ZICsgKG5IWzJdICsgc01lYW5YKSAvIHNyY1BhcmFtLnMsXG4gICAgICBuSFszXSArIHNNZWFuWSAqIG5IWzZdLCBcbiAgICAgIG5IWzRdICsgc01lYW5ZICogbkhbN10sXG4gICAgICAobkhbM10gKyBzTWVhblkgKiBuSFs2XSkgKiAtc3JjUGFyYW0ubWVhblggKyAobkhbNF0gKyBzTWVhblkgKiBuSFs3XSkgKiAtc3JjUGFyYW0ubWVhblkgKyAobkhbNV0gKyBzTWVhblkpIC8gc3JjUGFyYW0ucyxcbiAgICAgIGRzdFBhcmFtLnMgKiBuSFs2XSxcbiAgICAgIGRzdFBhcmFtLnMgKiBuSFs3XSxcbiAgICAgIGRzdFBhcmFtLnMgKiBuSFs2XSAqIC1zcmNQYXJhbS5tZWFuWCArIGRzdFBhcmFtLnMgKiBuSFs3XSAqIC1zcmNQYXJhbS5tZWFuWSArIGRzdFBhcmFtLnMgLyBzcmNQYXJhbS5zLFxuICBdO1xuXG4gIC8vIG1ha2UgSFs4XSA9PT0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICBIW2ldID0gSFtpXSAvIEhbOF07XG4gIH1cbiAgcmV0dXJuIEg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzb2x2ZUhvbW9ncmFwaHlcbn1cbiIsImNvbnN0IG1SYW5kU2VlZCA9IDEyMzQ7XG5cbmNvbnN0IGNyZWF0ZVJhbmRvbWl6ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHJhbmRvbWl6ZXIgPSB7XG4gICAgc2VlZDogbVJhbmRTZWVkLFxuXG4gICAgYXJyYXlTaHVmZmxlKG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IHthcnIsIHNhbXBsZVNpemV9ID0gb3B0aW9ucztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2FtcGxlU2l6ZTsgaSsrKSB7XG5cbiAgICAgICAgdGhpcy5zZWVkID0gKDIxNDAxMyAqIHRoaXMuc2VlZCArIDI1MzEwMTEpICUgKDEgPDwgMzEpO1xuICAgICAgICBsZXQgayA9ICh0aGlzLnNlZWQgPj4gMTYpICYgMHg3ZmZmO1xuICAgICAgICBrID0gayAlIGFyci5sZW5ndGg7XG5cbiAgICAgICAgbGV0IHRtcCA9IGFycltpXTtcbiAgICAgICAgYXJyW2ldID0gYXJyW2tdO1xuICAgICAgICBhcnJba10gPSB0bXA7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG5leHRJbnQobWF4VmFsdWUpIHtcbiAgICAgIHRoaXMuc2VlZCA9ICgyMTQwMTMgKiB0aGlzLnNlZWQgKyAyNTMxMDExKSAlICgxIDw8IDMxKTtcbiAgICAgIGxldCBrID0gKHRoaXMuc2VlZCA+PiAxNikgJiAweDdmZmY7XG4gICAgICBrID0gayAlIG1heFZhbHVlO1xuICAgICAgcmV0dXJuIGs7XG4gICAgfVxuICB9XG4gIHJldHVybiByYW5kb21pemVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlUmFuZG9taXplclxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiY29uc3Qge01hdGNoZXJ9ID0gcmVxdWlyZSgnLi9tYXRjaGluZy9tYXRjaGVyLmpzJyk7XG5jb25zdCB7RXN0aW1hdG9yfSA9IHJlcXVpcmUoJy4vZXN0aW1hdGlvbi9lc3RpbWF0b3IuanMnKTtcblxubGV0IHByb2plY3Rpb25UcmFuc2Zvcm0gPSBudWxsO1xubGV0IG1hdGNoaW5nRGF0YUxpc3QgPSBudWxsO1xubGV0IGRlYnVnTW9kZSA9IGZhbHNlO1xubGV0IG1hdGNoZXIgPSBudWxsO1xubGV0IGVzdGltYXRvciA9IG51bGw7XG5cbm9ubWVzc2FnZSA9IChtc2cpID0+IHtcbiAgY29uc3Qge2RhdGF9ID0gbXNnO1xuXG4gIGlmIChkYXRhLnR5cGUgPT09ICdzZXR1cCcpIHtcbiAgICBwcm9qZWN0aW9uVHJhbnNmb3JtID0gZGF0YS5wcm9qZWN0aW9uVHJhbnNmb3JtO1xuICAgIG1hdGNoaW5nRGF0YUxpc3QgPSBkYXRhLm1hdGNoaW5nRGF0YUxpc3Q7XG4gICAgZGVidWdNb2RlID0gZGF0YS5kZWJ1Z01vZGU7XG4gICAgbWF0Y2hlciA9IG5ldyBNYXRjaGVyKGRhdGEuaW5wdXRXaWR0aCwgZGF0YS5pbnB1dEhlaWdodCwgZGVidWdNb2RlKTtcbiAgICBlc3RpbWF0b3IgPSBuZXcgRXN0aW1hdG9yKGRhdGEucHJvamVjdGlvblRyYW5zZm9ybSk7XG4gIH1cbiAgZWxzZSBpZiAoZGF0YS50eXBlID09PSAnbWF0Y2gnKSB7XG4gICAgY29uc3QgaW50ZXJlc3RlZFRhcmdldEluZGV4ZXMgPSBkYXRhLnRhcmdldEluZGV4ZXM7XG5cbiAgICBsZXQgbWF0Y2hlZFRhcmdldEluZGV4ID0gLTE7XG4gICAgbGV0IG1hdGNoZWRNb2RlbFZpZXdUcmFuc2Zvcm0gPSBudWxsO1xuICAgIGxldCBtYXRjaGVkRGVidWdFeHRyYSA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyZXN0ZWRUYXJnZXRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtYXRjaGluZ0luZGV4ID0gaW50ZXJlc3RlZFRhcmdldEluZGV4ZXNbaV07XG5cbiAgICAgIGNvbnN0IHtrZXlmcmFtZUluZGV4LCBzY3JlZW5Db29yZHMsIHdvcmxkQ29vcmRzLCBkZWJ1Z0V4dHJhfSA9IG1hdGNoZXIubWF0Y2hEZXRlY3Rpb24obWF0Y2hpbmdEYXRhTGlzdFttYXRjaGluZ0luZGV4XSwgZGF0YS5mZWF0dXJlUG9pbnRzKTtcbiAgICAgIG1hdGNoZWREZWJ1Z0V4dHJhID0gZGVidWdFeHRyYTtcblxuICAgICAgaWYgKGtleWZyYW1lSW5kZXggIT09IC0xKSB7XG5cdGNvbnN0IG1vZGVsVmlld1RyYW5zZm9ybSA9IGVzdGltYXRvci5lc3RpbWF0ZSh7c2NyZWVuQ29vcmRzLCB3b3JsZENvb3Jkc30pO1xuXG5cdGlmIChtb2RlbFZpZXdUcmFuc2Zvcm0pIHtcblx0ICBtYXRjaGVkVGFyZ2V0SW5kZXggPSBtYXRjaGluZ0luZGV4O1xuXHQgIG1hdGNoZWRNb2RlbFZpZXdUcmFuc2Zvcm0gPSBtb2RlbFZpZXdUcmFuc2Zvcm07XG5cdH1cblx0YnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgdHlwZTogJ21hdGNoRG9uZScsXG4gICAgICB0YXJnZXRJbmRleDogbWF0Y2hlZFRhcmdldEluZGV4LFxuICAgICAgbW9kZWxWaWV3VHJhbnNmb3JtOiBtYXRjaGVkTW9kZWxWaWV3VHJhbnNmb3JtLFxuICAgICAgZGVidWdFeHRyYTogbWF0Y2hlZERlYnVnRXh0cmFcbiAgICB9KTtcbiAgfVxuICBlbHNlIGlmIChkYXRhLnR5cGUgPT09ICd0cmFja1VwZGF0ZScpIHtcbiAgICBjb25zdCB7bW9kZWxWaWV3VHJhbnNmb3JtLCB3b3JsZENvb3Jkcywgc2NyZWVuQ29vcmRzfSA9IGRhdGE7XG4gICAgY29uc3QgZmluYWxNb2RlbFZpZXdUcmFuc2Zvcm0gPSBlc3RpbWF0b3IucmVmaW5lRXN0aW1hdGUoe2luaXRpYWxNb2RlbFZpZXdUcmFuc2Zvcm06IG1vZGVsVmlld1RyYW5zZm9ybSwgd29ybGRDb29yZHMsIHNjcmVlbkNvb3Jkc30pO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICd0cmFja1VwZGF0ZURvbmUnLFxuICAgICAgbW9kZWxWaWV3VHJhbnNmb3JtOiBmaW5hbE1vZGVsVmlld1RyYW5zZm9ybSxcbiAgICB9KTtcbiAgfVxufTtcblxuIl0sInNvdXJjZVJvb3QiOiIifQ==