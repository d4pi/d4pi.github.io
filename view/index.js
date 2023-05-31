"use strict";
{
    const itemViewDiv = document.getElementById("item-view");
    const itemLinkAnchor = document.getElementById("item-link");
    const itemAttributes = new ItemAttributes();
    const hash = window.location.hash;
    const encodedText = (hash.length > 0) ? hash.substring(1) : "";
    itemAttributes.init2(encodedText);
    itemAttributes.renderDiv(itemViewDiv);
    itemAttributes.renderAnchor(itemLinkAnchor);
}
