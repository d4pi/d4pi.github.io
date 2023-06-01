"use strict";
{
    const rawItemAttributesTextArea = document.getElementById("raw-item-attributes");
    const itemAttributesDiv = document.getElementById("item-attributes");
    const itemLinkAnchor = document.getElementById("item-link");
    function rawItemAttributesTextArea_InputEventHandler() {
        const rawItemAttributes = new RawItemAttributes(rawItemAttributesTextArea.value);
        rawItemAttributes.renderAnchor(itemLinkAnchor);
        const itemAttributes = new ItemAttributes(rawItemAttributes);
        itemAttributes.renderDiv(itemAttributesDiv);
    }
    rawItemAttributesTextArea.addEventListener("input", rawItemAttributesTextArea_InputEventHandler);
    rawItemAttributesTextArea_InputEventHandler();
}
