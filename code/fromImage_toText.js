'use strict';

var d4pi_textData = {};

function d4pi_fromImage_toText(
    text_dataId,
    textImage_canvas
) {
    Tesseract.recognize(
        textImage_canvas,
        'eng',
        {}
    ).catch(() => {
        d4pi_textData[text_dataId] = newTextData(0, '', []);
    }).then(result => {
        d4pi_textData[text_dataId] = newTextData(
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
