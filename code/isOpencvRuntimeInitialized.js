// This must be loaded before opencv.js -- see
// https://docs.opencv.org/4.9.0/d0/d84/tutorial_js_usage.html.

'use strict';

var _isOpencvRuntimeInitialized = false;

var Module = {
    onRuntimeInitialized() {
        _isOpencvRuntimeInitialized = true;
    }
};
