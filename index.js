"use strict";
{
    const rawItemAttributesTextArea = document.getElementById("raw-item-attributes");
    const itemViewDiv = document.getElementById("item-view");
    const itemLinkAnchor = document.getElementById("item-link");
    const rawItemAttributes = new RawItemAttributes(rawItemAttributesTextArea);
    const itemAttributes = new ItemAttributes();
    itemAttributes.init1(rawItemAttributes);
    itemAttributes.renderDiv(itemViewDiv);
    itemAttributes.renderAnchor(itemLinkAnchor);
    function rawItemAttributesTextArea_InputEventHandler() {
        const rawItemAttributes = new RawItemAttributes(rawItemAttributesTextArea);
        const itemAttributes = new ItemAttributes();
        itemAttributes.init1(rawItemAttributes);
        itemAttributes.renderDiv(itemViewDiv);
        itemAttributes.renderAnchor(itemLinkAnchor);
    }
    rawItemAttributesTextArea.addEventListener("input", rawItemAttributesTextArea_InputEventHandler);
}
