{
    const rawInputTextArea = document.getElementById("raw-input") as HTMLTextAreaElement;
    const itemTextDiv = document.getElementById("item-text") as HTMLDivElement;
    const itemLinkAnchor = document.getElementById("item-link") as HTMLAnchorElement;

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

    const rawFileInput = document.getElementById("raw-file") as HTMLInputElement;
    const rawUrlInput = document.getElementById("raw-url") as HTMLInputElement;
    const rawImageImage = document.getElementById("raw-image") as HTMLImageElement;

    rawFileInput.addEventListener("change", () => {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            rawImageImage.src = fileReader.result?.toString()!;
        });
        fileReader.readAsDataURL(rawFileInput.files![0]);
    });

    rawUrlInput.addEventListener("change", (event) => {
        fetch(rawUrlInput.value)
            .then((response) => response.blob())
            .then((blob) => rawImageImage.src = URL.createObjectURL(blob));
    });
}
