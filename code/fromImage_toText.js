'use strict';

var _textData = {};

function _fromImage_toText(
    text_data_id,
    textImage_canvas
) {
    Tesseract.recognize(
        textImage_canvas,
        'eng',
        {}
    ).catch(() => {
        _textData[text_data_id] = newTextData(0, '', []);
    }).then(result => {
        _textData[text_data_id] = newTextData(
            result.data.confidence,
            result.data.text,
            result.data.words.map(word => word.text)
        );
    });

    function newTextData(confidence, text, words) {
        return {
            confidence: confidence,
            text: text,
            words: words
        };
    }
}
