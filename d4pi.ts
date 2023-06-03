class D4piUtilities {
    static isIgnorable(input: string): boolean {
        return (input === undefined
            || input === null
            || input === ""
            || input.charAt(0) === "#"
            || input.replace(/\s/g, "") === "");
    }

    static sanitize(input: string): string {
        if (input === undefined
            || input === null
            || input === "") {
            return "";
        }

        return input.replace(/['"&<>]/g, "");
    }
}

class InputProcessor {
    pattern: RegExp;
    template: string;

    constructor(pattern: RegExp, template: string) {
        this.pattern = pattern;
        this.template = template;
    }

    static transform(input: string, processors: InputProcessor[]): string {
        const sanitizedInput = D4piUtilities.sanitize(input);
        for (let processor of processors) {
            if (processor.pattern.test(sanitizedInput)) {
                return sanitizedInput.replace(processor.pattern, processor.template);
            }
        }

        return sanitizedInput;
    }

    static classRequirementProcessors: InputProcessor[] = [
        new InputProcessor(/^B.*$/i, "Barbarian"),
        new InputProcessor(/^D.*$/i, "Druid"),
        new InputProcessor(/^N.*$/i, "Necromancer"),
        new InputProcessor(/^R.*$/i, "Rogue"),
        new InputProcessor(/^S.*$/i, "Sorcerer")
    ];

    static attributeProcessors: InputProcessor[] = [
        new InputProcessor(/^(\d+((\+| )\d+)?) ?(IP)?$/i, "$1 Item Power"),
        new InputProcessor(/^(\d+(\.\d+))%? *CR$/i, "$1% Cooldown Reduction"),
        new InputProcessor(/^(\d+(\.\d+))%? *DR$/i, "$1% Damage Reduction"),
        new InputProcessor(/^(\d+(\.\d+))%? *FR$/i, "$1% Fire Resistance"),
        new InputProcessor(/^(\d+(\.\d+))%? *LR$/i, "$1% Lightning Resistance"),
        new InputProcessor(/^(\d+(\.\d+))%? *MCR$/i, "$1% Mana Cost Reduction"),
        new InputProcessor(/^(\d+(\.\d+))%? *SR$/i, "$1% Shadow Resistance"),
        new InputProcessor(/^(\d+) (\d+) DpH$/i, "[$1 - $3] Damage per Hit"),
        new InputProcessor(/^(\d+) *A$/i, "$1 Armor"),
        new InputProcessor(/^(\d+) *DPS$/i, "$1 Damage Per Second"),
        new InputProcessor(/^(\d+\.\d+) ApS$/i, "$1 Attacks per Second"),
        new InputProcessor(/^(\d+\.\d+) ApSSW$/i, "$1 Attacks per Second (Slow Weapon)"),
        new InputProcessor(/^(\d+\.\d+) ApSVFW$/i, "$1 Attacks per Second (Very Fast Weapon)"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *AS$/i, "+$1% Attack Speed"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *CD$/i, "+$1% Cold Damage"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *CSC$/i, "+$1% Critical Strike Chance"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *CSD$/i, "+$1% Core Skill Damage"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *CSD$/i, "+$1% Critical Strike Damage"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *DtCCE$/i, "+$1% Damage to Crowd Controlled Enemies"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *DtCE$/i, "+$1% Damage to Close Enemies"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *DtSlE$/i, "+$1% Damage to Slowed Enemies"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *DtStE$/i, "+$1% Damage to Stunned Enemies"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *HR$/i, "+$1% Healing Received"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *OD$/i, "+$1% Overpower Damage"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *TA$/i, "+$1% Total Armor"),
        new InputProcessor(/^\+?(\d+(\.\d+)?)%? *VD$/i, "+$1% Vulnerable Damage"),
        new InputProcessor(/^\+?(\d+) *AS$/i, "+$1 All Stats"),
        new InputProcessor(/^\+?(\d+) *I$/i, "+$1 Intelligence"),
        new InputProcessor(/^\+?(\d+) *LOK$/i, "+$1 Life On Kill"),
        new InputProcessor(/^\+?(\d+) *LRwNDR$/i, "+$1 Life Regeneration while Not Damaged Recently"),
        new InputProcessor(/^\+?(\d+) *ML$/i, "+$1 Maximum Life"),
        new InputProcessor(/^\+?(\d+) *RoC$/i, "+$1 Rank of Caltrops (Rogue Only)"),
        new InputProcessor(/^\+?(\d+) *RoI$/i, "+$1 Rank of Incinerate (Sorcerer Only)"),
        new InputProcessor(/^\+?(\d+) *RoLS$/i, "+$1 Rank of Lightning Spear (Sorcerer Only)"),
        new InputProcessor(/^\+?(\d+) *RoM$/i, "+$1 Rank of Meteor (Sorcerer Only)"),
        new InputProcessor(/^\+?(\d+) *RoSG$/i, "+$1 Rank of Smoke Grenade (Rogue Only)"),
        new InputProcessor(/^\+?(\d+) *S$/i, "+$1 Strength"),
        new InputProcessor(/^\+?(\d+) *W$/i, "+$1 Willpower"),
        new InputProcessor(/^=[^=]*$/, "==="),
        new InputProcessor(/^EG \+?(\d+(\.\d+))%? MSf1S$/i, "Evade Grants +$1% Movement Speed for 1 Second"),
        new InputProcessor(/^ES$/, "Empty Socket"),
        new InputProcessor(/^LHUta *(\d+(\.\d+)?)%? *CtEINE$/i, "Lucky Hit: Up to a +$1% Chance to Execute Injured Non-Elites"),
        new InputProcessor(/^WIYPAG *(\d+(\.\d+)?)%? *MLaB$/i, "While Injured, Your Potion Also Grants $1% Maximum Life as Barrier"),
        new InputProcessor(/^WIYPAG *(\d+(\.\d+)?)%? *MSf2S$/i, "While Injured, Your Potion Also Grants $1% Movement Speed for 2 Seconds"),
        new InputProcessor(/^WIYPAR *(\d+(\.\d+)?)%? *R$/i, "While Injured, Your Potion Also Restores $1% Resource")
    ];

    static typeProcessors: InputProcessor[] = [
        new InputProcessor(/^Am$/i, "Amulet"),
        new InputProcessor(/^Ax$/i, "Axe"),
        new InputProcessor(/^Bo$/i, "Boots"),
        new InputProcessor(/^Bw$/i, "Bow"),
        new InputProcessor(/^Ch$/i, "Chest Armor"),
        new InputProcessor(/^Cr$/i, "Crossbow"),
        new InputProcessor(/^D$/i, "Dagger"),
        new InputProcessor(/^F$/i, "Focus"),
        new InputProcessor(/^G$/i, "Gloves"),
        new InputProcessor(/^H$/i, "Helm"),
        new InputProcessor(/^M$/i, "Mace"),
        new InputProcessor(/^Pa$/i, "Pants"),
        new InputProcessor(/^Po$/i, "Polearm"),
        new InputProcessor(/^R$/i, "Ring"),
        new InputProcessor(/^Sc$/i, "Scythe"),
        new InputProcessor(/^Sh$/i, "Shield"),
        new InputProcessor(/^St$/i, "Staff"),
        new InputProcessor(/^Sw$/i, "Sword"),
        new InputProcessor(/^TA$/i, "Two-Handed Axe"),
        new InputProcessor(/^TM$/i, "Two-Handed Mace"),
        new InputProcessor(/^TSc$/i, "Two-Handed Scythe"),
        new InputProcessor(/^TSw$/i, "Two-Handed Sword"),
        new InputProcessor(/^W$/i, "Wand")
    ];

    static levelRequirementProcessors: InputProcessor[] = [
        new InputProcessor(/^RL *(\d+)$/i, "Requires Level $1")
    ];

    static rarityLevelProcessors: InputProcessor[] = [
        new InputProcessor(/^A$/i, "Ancestral"),
        new InputProcessor(/^C$/i, "Common"),
        new InputProcessor(/^L$/i, "Legendary"),
        new InputProcessor(/^M$/i, "Magic"),
        new InputProcessor(/^R$/i, "Rare"),
        new InputProcessor(/^S$/i, "Sacred"),
        new InputProcessor(/^U$/i, "Unique")
    ];
}

class RawInput {
    linkData: string = "";
    name: string = "";
    rarityLevels: string[] = [];
    type: string = "";
    miscEntries: string[] = [];
    levelRequirement: string = "";
    classRequirement: string = "";

    constructor(input: string) {
        const sanitizedInput = D4piUtilities.sanitize(input);
        const sanitizedLines = sanitizedInput.split(/\n|\r/);
        const nonIgnorableSanitizedLines = sanitizedLines.filter(line => !D4piUtilities.isIgnorable(line));

        this.linkData = nonIgnorableSanitizedLines.slice(0, nonIgnorableSanitizedLines.length).join(RawInput.newline);

        if (nonIgnorableSanitizedLines.length > 0) {
            this.name = nonIgnorableSanitizedLines.shift()!;
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const firstLine = nonIgnorableSanitizedLines.shift()!;
            const rawRarityLevel = firstLine.replace(/^((A|S)? *(C|L|M|R|U)).*$/i, "$1");
            this.rarityLevels = Array.from(rawRarityLevel.replace(/\s/g, ""));
            const rawItemType = firstLine.substring(rawRarityLevel.length);
            this.type = rawItemType.replace(/\s/g, "");
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const lastLine = nonIgnorableSanitizedLines[nonIgnorableSanitizedLines.length - 1];
            if (InputProcessor.classRequirementProcessors.some(processor => processor.pattern.test(lastLine))) {
                this.classRequirement = nonIgnorableSanitizedLines.pop()!;
            }
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const lastLine = nonIgnorableSanitizedLines[nonIgnorableSanitizedLines.length - 1];
            if (InputProcessor.levelRequirementProcessors.some(processor => processor.pattern.test(lastLine))) {
                this.levelRequirement = nonIgnorableSanitizedLines.pop()!;
            }
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            this.miscEntries = nonIgnorableSanitizedLines;
        }
    }

    static newline = "\n";

    renderAnchor(output: HTMLAnchorElement) {
        const encodedData = encodeURIComponent(this.linkData);
        const itemLink = window.location.protocol + "//" + window.location.host + "/view/#" + encodedData;
        output.href = itemLink;
        output.text = itemLink;
    }

    static decode(input: string): string {
        return decodeURIComponent(input);
    }
}

class ItemAttributes {
    name: string = "";
    rarityLevels: string[] = [];
    itemType: string = "";
    otherAttributes: string[] = [];
    levelRequirement: string = "";
    classRequirement: string = "";

    constructor(input: RawInput) {
        this.name = D4piUtilities.sanitize(input.name);

        this.rarityLevels = input.rarityLevels.map(level => D4piUtilities.sanitize(InputProcessor.transform(level, InputProcessor.rarityLevelProcessors)));

        this.itemType = D4piUtilities.sanitize(InputProcessor.transform(input.type, InputProcessor.typeProcessors));

        this.otherAttributes = input.miscEntries.map(attribute => D4piUtilities.sanitize(InputProcessor.transform(attribute, InputProcessor.attributeProcessors)));

        this.levelRequirement = D4piUtilities.sanitize(InputProcessor.transform(input.levelRequirement, InputProcessor.levelRequirementProcessors));

        this.classRequirement = D4piUtilities.sanitize(InputProcessor.transform(input.classRequirement, InputProcessor.classRequirementProcessors));
    }

    renderDiv(output: HTMLDivElement) {
        const lastRarityLevel = this.rarityLevels[this.rarityLevels.length - 1];

        // Common
        output.style.background = "linear-gradient(0deg, #151515 0%, #202020 75%, #606060 100%)";
        output.style.borderImage = "linear-gradient(#808080, #252525) 1";

        if (lastRarityLevel === "Magic") {
            output.style.background = "linear-gradient(0deg, #151515 0%, #202040 75%, #202060 100%)";
            output.style.borderImage = "linear-gradient(#303080, #252525) 1";
        } else if (lastRarityLevel === "Rare") {
            output.style.background = "linear-gradient(0deg, #151411 0%, #1f1a12 75%, #51390c 100%)";
            output.style.borderImage = "linear-gradient(#866c12, #252218) 1";
        } else if (lastRarityLevel === "Legendary") {
            output.style.background = "linear-gradient(0deg, #151515 0%, #804820 75%, #F07025 100%)";
            output.style.borderImage = "linear-gradient(#FFA500, #252525) 1";
        } else if (lastRarityLevel === "Unique") {
            output.style.background = "linear-gradient(0deg, #151411 0%, #1f1a12 75%, #88390c 100%)";
            output.style.borderImage = "linear-gradient(#868c12, #252218) 1";
        }

        output.style.borderWidth = "5px";
        output.style.borderStyle = "solid";
        output.style.margin = "1em";
        output.style.padding = "1em";
        output.style.width = "fit-content";

        output.innerHTML = "";

        output.innerHTML += "<p>" + D4piUtilities.sanitize(this.name) + "</p>"

        output.innerHTML += "<p>" + D4piUtilities.sanitize(this.rarityLevels.join(" ") + " " + this.itemType) + "</p>"

        for (let attribute of this.otherAttributes) {
            const sanitizedAttribute = D4piUtilities.sanitize(attribute);

            if (sanitizedAttribute === "===") {
                output.innerHTML += "<hr>";
            } else {
                output.innerHTML += "<p>" + sanitizedAttribute + "</p>"
            }
        }

        output.innerHTML += "<p class=\"text-end\">" + D4piUtilities.sanitize(this.levelRequirement) + "</p>"

        output.innerHTML += "<p class=\"text-end\">" + D4piUtilities.sanitize(this.classRequirement) + "</p>"
    }
}
