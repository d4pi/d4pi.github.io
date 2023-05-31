{
    const rawItemAttributesTextArea = document.getElementById("raw-item-attributes") as HTMLTextAreaElement;
    const itemViewDiv = document.getElementById("item-view") as HTMLDivElement;
    const itemLinkAnchor = document.getElementById("item-link") as HTMLAnchorElement;

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
