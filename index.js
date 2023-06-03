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
    const defaultInput = `# Item Name

Masked Work

# Abbreviated Item Rarity Level & Item Type

s r h

# Other Item Attributes

281 ip

=

# Item Attributes can be entered as-is.

351 Armor

=

# Item Attributes can be entered with case-insensitive abbreviations/acronyms.

+3.3% CSC
+18 i
WIYPAG 25% MSf2S

=

# Item Attributes can be entered without punctuation.

5CSD
10LRwNDR
2.5ta

=

# Last 2 lines: Level & Class Requirements
RL 17
S

# Lines starting with \`#\` are ignored.

# Empty-ish lines are ignored.

# Lines starting with \`=\` are treated as separators.
`;
    rawInputTextArea.value = defaultInput;
    rawInputTextArea_Input_EventHandler();
}
