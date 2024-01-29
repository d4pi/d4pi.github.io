'use strict';

var _itemImageData = {};

function _fromInputImage_toTextImage(
    inputImage_afterBrightnessThreshold_canvas_id,
    inputImage_afterItemImageDetection_canvas_id,
    inputImage_image,
    itemImage_canvas_id,
    itemImage_data_id,
    textImage_canvas_id,
    screenshot_processor_InputImageBrightnessThreshold,
    screenshot_processor_ItemImageMaxWidth,
    screenshot_processor_ItemImageMinWidth,
    screenshot_processor_ItemPictureHeight,
    screenshot_processor_ItemPictureWidth,
    screenshot_processor_TextImageBorderTrimSize,
    screenshot_processor_TextImageCornerTrimSize
) {
    const inputImage = cv.imread(inputImage_image);
    cv.cvtColor(inputImage, inputImage, cv.COLOR_RGBA2GRAY, 0);
    const d4pi_blurKernelSize = new cv.Size(3, 3);
    const d4pi_blurAnchor = new cv.Point(-1, -1);
    cv.blur(inputImage, inputImage, d4pi_blurKernelSize, d4pi_blurAnchor, cv.BORDER_DEFAULT);
    cv.threshold(inputImage, inputImage, screenshot_processor_InputImageBrightnessThreshold, 255, cv.THRESH_BINARY);
    cv.imshow(inputImage_afterBrightnessThreshold_canvas_id, inputImage);
    cv.Canny(inputImage, inputImage, 50, 100, 3, true);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(inputImage, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    hierarchy.delete();
    const d4pi_edge_color = new cv.Scalar(64, 64, 64);
    let drawContours_color = null;
    const approximatePolygonEpsilon = (screenshot_processor_ItemImageMinWidth + screenshot_processor_ItemImageMaxWidth) / 2 * 4 * .03;
    const d4pi_polygon_color = new cv.Scalar(96, 0, 0);
    const approximatePolygons = new cv.MatVector();
    const d4pi_rectangle_color = new cv.Scalar(128, 128, 0);
    const convexHulls = new cv.MatVector();
    const itemImageMinArea = screenshot_processor_ItemImageMinWidth * screenshot_processor_ItemImageMinWidth;
    const itemImageMinPerimeter = screenshot_processor_ItemImageMinWidth * 4;
    const d4pi_boundingRectangleCandidate_color = new cv.Scalar(0, 160, 0);
    _itemImageData[itemImage_data_id] = {
        candidates: [],
        bestCandidate: newRectangleData(0, 0, 0, 0)
    };
    const inputImage_ItemImageDetection_report = cv.Mat.zeros(inputImage.rows, inputImage.cols, cv.CV_8UC3);
    inputImage.delete();
    for (let i = 0; i < contours.size(); ++i) {
        drawContours_color = d4pi_edge_color;
        const contour = contours.get(i);
        const approximatePolygon = new cv.Mat();
        cv.approxPolyDP(contour, approximatePolygon, approximatePolygonEpsilon, true);
        if (approximatePolygon.rows >= 4) {
            drawContours_color = d4pi_polygon_color;
            approximatePolygons.push_back(approximatePolygon);
            const boundingRectangle = cv.boundingRect(approximatePolygon);
            const boundingRectangleArea = Math.max(boundingRectangle.width * boundingRectangle.height, 1);
            const convexHull = new cv.Mat();
            cv.convexHull(approximatePolygon, convexHull, false, true);
            const convexHullArea = cv.contourArea(convexHull, false);
            const areaRatio = convexHullArea / boundingRectangleArea;
            if (areaRatio > .9) {
                drawContours_color = d4pi_rectangle_color;
                convexHulls.push_back(convexHull);
                const polygonArcLength = cv.arcLength(approximatePolygon, true);
                if (boundingRectangle.width <= boundingRectangle.height
                    && screenshot_processor_ItemImageMinWidth <= boundingRectangle.width
                    && boundingRectangle.width <= screenshot_processor_ItemImageMaxWidth
                    && itemImageMinArea <= boundingRectangleArea
                    && itemImageMinPerimeter <= polygonArcLength
                ) {
                    drawContours_color = d4pi_boundingRectangleCandidate_color;
                    const itemImage_data = _itemImageData[itemImage_data_id];
                    const _newRectangleData = newRectangleData(
                        boundingRectangle.x,
                        boundingRectangle.y,
                        boundingRectangle.width,
                        boundingRectangle.height
                    );
                    if (itemImage_data.candidates.every(candidate =>
                        candidate.x !== _newRectangleData.x
                        || candidate.y !== _newRectangleData.y
                        || candidate.width !== _newRectangleData.width
                        || candidate.height !== _newRectangleData.height
                    )) {
                        itemImage_data.candidates.push(_newRectangleData);
                        const bestCandidate = itemImage_data.bestCandidate;
                        if (bestCandidate.width * bestCandidate.height < _newRectangleData.width * _newRectangleData.height) {
                            itemImage_data.bestCandidate = _newRectangleData;
                        }
                    }
                }
            }
            convexHull.delete();
        }
        approximatePolygon.delete();
        cv.drawContours(inputImage_ItemImageDetection_report, contours, i, drawContours_color);
    }
    contours.delete();
    const d4pi_approximatePolygon_color = new cv.Scalar(96, 0, 96);
    for (let i = 0; i < approximatePolygons.size(); ++i) {
        cv.drawContours(inputImage_ItemImageDetection_report, approximatePolygons, i, d4pi_approximatePolygon_color);
    }
    approximatePolygons.delete();
    const d4pi_convexHull_color = new cv.Scalar(0, 128, 128);
    for (let i = 0; i < convexHulls.size(); ++i) {
        cv.drawContours(inputImage_ItemImageDetection_report, convexHulls, i, d4pi_convexHull_color);
    }
    convexHulls.delete();
    const itemImage_data = _itemImageData[itemImage_data_id];
    let itemImage = null;
    if (itemImage_data.candidates.length === 0) {
        itemImage = cv.imread(inputImage_image);
    } else {
        const d4pi_boundingRectangle_color = new cv.Scalar(0, 192, 0);
        cv.rectangle(
            inputImage_ItemImageDetection_report,
            new cv.Point(itemImage_data.bestCandidate.x, itemImage_data.bestCandidate.y),
            new cv.Point(itemImage_data.bestCandidate.x + itemImage_data.bestCandidate.width, itemImage_data.bestCandidate.y + itemImage_data.bestCandidate.height),
            d4pi_boundingRectangle_color,
            3,
            cv.LINE_AA
        );
        const inputImage = cv.imread(inputImage_image);
        itemImage = inputImage.roi(itemImage_data.bestCandidate);
        inputImage.delete();
    }
    cv.imshow(inputImage_afterItemImageDetection_canvas_id, inputImage_ItemImageDetection_report);
    inputImage_ItemImageDetection_report.delete();
    cv.imshow(itemImage_canvas_id, itemImage);
    const textImage = new cv.Mat();
    cv.cvtColor(itemImage, textImage, cv.COLOR_RGBA2GRAY, 0);
    itemImage.delete();
    if (itemImage_data.candidates.length !== 0) {
        const d4pi_overwrite_color = new cv.Scalar(0, 0, 0);
        cv.rectangle(
            textImage,
            new cv.Point(textImage.size().width - screenshot_processor_ItemPictureWidth, 0),
            new cv.Point(textImage.size().width, screenshot_processor_ItemPictureHeight),
            d4pi_overwrite_color,
            -1
        );
        cv.rectangle(
            textImage,
            new cv.Point(0, 0),
            new cv.Point(textImage.size().width, textImage.size().height),
            d4pi_overwrite_color,
            screenshot_processor_TextImageBorderTrimSize,
            cv.LINE_AA
        );
        cv.line(
            textImage,
            new cv.Point(0, screenshot_processor_TextImageCornerTrimSize),
            new cv.Point(screenshot_processor_TextImageCornerTrimSize, 0),
            d4pi_overwrite_color,
            screenshot_processor_TextImageCornerTrimSize * 2,
            cv.LINE_AA
        );
    }
    cv.imshow(textImage_canvas_id, textImage);
    textImage.delete();

    function newRectangleData(x, y, width, height) {
        return {
            height: height,
            width: width,
            x: x,
            y: y,

            get key() { return `Rectangle (height: ${this.height}) (width: ${this.width}) (x: ${this.x}) (y: ${this.y})`; },
        };
    }
}
