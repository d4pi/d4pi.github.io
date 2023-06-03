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
}
