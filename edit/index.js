"use strict";
{
    const rawInputTextArea = document.getElementById("raw-input");
    const itemTextDiv = document.getElementById("item-text");
    const itemLinkAnchor = document.getElementById("item-link");
    function rawInputTextArea_Input_EventHandler() {
        const rawItemAttributes = new RawInput(rawInputTextArea.value);
        rawItemAttributes.renderAnchor(itemLinkAnchor);
        const itemAttributes = new ItemAttributes(rawItemAttributes);
        itemAttributes.renderDiv(itemTextDiv);
    }
    rawInputTextArea.addEventListener("input", rawInputTextArea_Input_EventHandler);
    const hash = window.location.hash;
    const encodedText = (hash.length > 0) ? hash.substring("#".length) : "";
    rawInputTextArea.value = RawInput.decode(encodedText);
    rawInputTextArea_Input_EventHandler();
    // ---
    const rawFileInput = document.getElementById("raw-file");
    const rawUrlInput = document.getElementById("raw-url");
    const rawImageImage = document.getElementById("raw-image");
    rawFileInput.addEventListener("change", () => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            var _a;
            rawImageImage.src = (_a = fileReader.result) === null || _a === void 0 ? void 0 : _a.toString();
        });
        fileReader.readAsDataURL(rawFileInput.files[0]);
    });
    rawUrlInput.addEventListener("change", (event) => {
        fetch(rawUrlInput.value)
            .then((response) => response.blob())
            .then((blob) => rawImageImage.src = URL.createObjectURL(blob));
    });
}
