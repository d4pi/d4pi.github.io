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

class RawTextProcessor {
    inputPattern: RegExp;
    outputTemplate: string;

    constructor(inputPattern: RegExp, outputTemplate: string) {
        this.inputPattern = inputPattern;
        this.outputTemplate = outputTemplate;
    }

    static transform(input: string, processors: RawTextProcessor[]): string {
        const sanitizedInput = D4piUtilities.sanitize(input);
        for (let processor of processors) {
            if (processor.inputPattern.test(sanitizedInput)) {
                return sanitizedInput.replace(processor.inputPattern, processor.outputTemplate);
            }
        }

        return sanitizedInput;
    }

    static classRequirementProcessors: RawTextProcessor[] = [
        new RawTextProcessor(/^B$/i, "Barbarian"),
        new RawTextProcessor(/^D$/i, "Druid"),
        new RawTextProcessor(/^N$/i, "Necromancer"),
        new RawTextProcessor(/^R$/i, "Rogue"),
        new RawTextProcessor(/^S$/i, "Sorcerer")
    ];

    static itemAttributesProcessors: RawTextProcessor[] = [
        new RawTextProcessor(/^(\d+( \d+)?) ?(IP)?$/i, "$1 Item Power"),
        new RawTextProcessor(/^(\d+(\.\d+))%? CR$/i, "$1% Cooldown Reduction"),
        new RawTextProcessor(/^(\d+(\.\d+))%? DR$/i, "$1% Damage Reduction"),
        new RawTextProcessor(/^(\d+(\.\d+))%? FR$/i, "$1% Fire Resistance"),
        new RawTextProcessor(/^(\d+(\.\d+))%? LR$/i, "$1% Lightning Resistance"),
        new RawTextProcessor(/^(\d+(\.\d+))%? MCR$/i, "$1% Mana Cost Reduction"),
        new RawTextProcessor(/^(\d+(\.\d+))%? SR$/i, "$1% Shadow Resistance"),
        new RawTextProcessor(/^(\d+) (\d+) DpH$/i, "[$1 - $3] Damage per Hit"),
        new RawTextProcessor(/^(\d+) A$/i, "$1 Armor"),
        new RawTextProcessor(/^(\d+) DPS$/i, "$1 Damage Per Second"),
        new RawTextProcessor(/^(\d+\.\d+) ApS$/i, "$1 Attacks per Second"),
        new RawTextProcessor(/^(\d+\.\d+) ApSSW$/i, "$1 Attacks per Second (Slow Weapon)"),
        new RawTextProcessor(/^(\d+\.\d+) ApSVFW$/i, "$1 Attacks per Second (Very Fast Weapon)"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? AS$/i, "+$1% Attack Speed"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? CD$/i, "+$1% Cold Damage"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? CSC$/i, "+$1% Critical Strike Chance"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? CSD$/i, "+$1% Core Skill Damage"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? CSD$/i, "+$1% Critical Strike Damage"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? DtCCE$/i, "+$1% Damage to Crowd Controlled Enemies"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? DtCE$/i, "+$1% Damage to Close Enemies"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? DtSlE$/i, "+$1% Damage to Slowed Enemies"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? DtStE$/i, "+$1% Damage to Stunned Enemies"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? HR$/i, "+$1% Healing Received"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? OD$/i, "+$1% Overpower Damage"),
        new RawTextProcessor(/^\+?(\d+(\.\d+))%? VD$/i, "+$1% Vulnerable Damage"),
        new RawTextProcessor(/^\+?(\d+) AS$/i, "+$1 All Stats"),
        new RawTextProcessor(/^\+?(\d+) I$/i, "+$1 Intelligence"),
        new RawTextProcessor(/^\+?(\d+) LOK$/i, "+$1 Life On Kill"),
        new RawTextProcessor(/^\+?(\d+) LRwNDR$/i, "+$1 Life Regeneration while Not Damaged Recently"),
        new RawTextProcessor(/^\+?(\d+) ML$/i, "+$1 Maximum Life"),
        new RawTextProcessor(/^\+?(\d+) RoC$/i, "+$1 Rank of Caltrops (Rogue Only)"),
        new RawTextProcessor(/^\+?(\d+) RoI$/i, "+$1 Rank of Incinerate (Sorcerer Only)"),
        new RawTextProcessor(/^\+?(\d+) RoLS$/i, "+$1 Rank of Lightning Spear (Sorcerer Only)"),
        new RawTextProcessor(/^\+?(\d+) RoM$/i, "+$1 Rank of Meteor (Sorcerer Only)"),
        new RawTextProcessor(/^\+?(\d+) RoSG$/i, "+$1 Rank of Smoke Grenade (Rogue Only)"),
        new RawTextProcessor(/^\+?(\d+) S$/i, "+$1 Strength"),
        new RawTextProcessor(/^\+?(\d+) W$/i, "+$1 Willpower"),
        new RawTextProcessor(/^=[^=]*$/, "==="),
        new RawTextProcessor(/^EG \+?(\d+(\.\d+))%? MSf1S$/i, "Evade Grants +$1% Movement Speed for 1 Second"),
        new RawTextProcessor(/^ES$/, "Empty Socket"),
        new RawTextProcessor(/^LHUta *(\d+(\.\d+))%? *CtEINE$/i, "Lucky Hit: Up to a +$1% Chance to Execute Injured Non-Elites"),
        new RawTextProcessor(/^WIYPAG *(\d+(\.\d+))%? *MLaB$/i, "While Injured, Your Potion Also Grants $1% Maximum Life as Barrier"),
        new RawTextProcessor(/^WIYPAR *(\d+(\.\d+))%? *R$/i, "While Injured, Your Potion Also Restores $1% Resource"),
    ];

    static itemTypeProcessors: RawTextProcessor[] = [
        new RawTextProcessor(/^Am$/i, "Amulet"),
        new RawTextProcessor(/^Ax$/i, "Axe"),
        new RawTextProcessor(/^Bo$/i, "Boots"),
        new RawTextProcessor(/^Bw$/i, "Bow"),
        new RawTextProcessor(/^Ch$/i, "Chest Armor"),
        new RawTextProcessor(/^Cr$/i, "Crossbow"),
        new RawTextProcessor(/^D$/i, "Dagger"),
        new RawTextProcessor(/^F$/i, "Focus"),
        new RawTextProcessor(/^G$/i, "Gloves"),
        new RawTextProcessor(/^H$/i, "Helm"),
        new RawTextProcessor(/^M$/i, "Mace"),
        new RawTextProcessor(/^Pa$/i, "Pants"),
        new RawTextProcessor(/^Po$/i, "Polearm"),
        new RawTextProcessor(/^R$/i, "Ring"),
        new RawTextProcessor(/^Sc$/i, "Scythe"),
        new RawTextProcessor(/^Sh$/i, "Shield"),
        new RawTextProcessor(/^St$/i, "Staff"),
        new RawTextProcessor(/^Sw$/i, "Sword"),
        new RawTextProcessor(/^TA$/i, "Two-Handed Axe"),
        new RawTextProcessor(/^TM$/i, "Two-Handed Mace"),
        new RawTextProcessor(/^TSc$/i, "Two-Handed Scythe"),
        new RawTextProcessor(/^TSw$/i, "Two-Handed Sword"),
        new RawTextProcessor(/^W$/i, "Wand")
    ];

    static levelRequirementProcessors: RawTextProcessor[] = [
        new RawTextProcessor(/^RL *(\d+)$/i, "Requires Level $1")
    ];

    static rarityLevelProcessors: RawTextProcessor[] = [
        new RawTextProcessor(/^A$/i, "Ancestral"),
        new RawTextProcessor(/^C$/i, "Common"),
        new RawTextProcessor(/^L$/i, "Legendary"),
        new RawTextProcessor(/^M$/i, "Magic"),
        new RawTextProcessor(/^R$/i, "Rare"),
        new RawTextProcessor(/^S$/i, "Sacred"),
        new RawTextProcessor(/^U$/i, "Unique")
    ];
}

class RawItemAttributes {
    name: string = "";
    rarityLevels: string[] = [];
    itemType: string = "";
    otherAttributes: string[] = [];
    levelRequirement: string = "";
    classRequirement: string = "";

    constructor(input: string) {
        const sanitizedInput = D4piUtilities.sanitize(input);
        const sanitizedLines = sanitizedInput.split(/\n|\r/);
        const nonIgnorableSanitizedLines = sanitizedLines.filter(line => !D4piUtilities.isIgnorable(line));

        if (nonIgnorableSanitizedLines.length > 0) {
            this.name = nonIgnorableSanitizedLines.shift()!;
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const firstLine = nonIgnorableSanitizedLines.shift()!;
            const rawRarityLevel = firstLine.replace(/^((A|S)? *(C|L|M|R|U)).*$/i, "$1");
            this.rarityLevels = Array.from(rawRarityLevel.replace(/\s/g, ""));
            const rawItemType = firstLine.substring(rawRarityLevel.length);
            this.itemType = rawItemType.replace(/\s/g, "");
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const lastLine = nonIgnorableSanitizedLines[nonIgnorableSanitizedLines.length - 1];
            if (RawTextProcessor.classRequirementProcessors.some(processor => processor.inputPattern.test(lastLine))) {
                this.classRequirement = nonIgnorableSanitizedLines.pop()!;
            }
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            const lastLine = nonIgnorableSanitizedLines[nonIgnorableSanitizedLines.length - 1];
            if (RawTextProcessor.levelRequirementProcessors.some(processor => processor.inputPattern.test(lastLine))) {
                this.levelRequirement = nonIgnorableSanitizedLines.pop()!;
            }
        }

        if (nonIgnorableSanitizedLines.length > 0) {
            this.otherAttributes = nonIgnorableSanitizedLines;
        }
    }

    renderAnchor(output: HTMLAnchorElement) {
        const encodedData = this.encode();
        const itemLink = "https://d4pi.com/view/#" + encodedData;
        output.href = itemLink;
        output.text = itemLink;
    }

    static newline = "\n";
    static encoderID_0_2_0_0 = "0.2.0.0&";

    encode(): string {
        return encodeURIComponent(this.encode_0_2_0_0());
    }

    encode_0_2_0_0(): string {

        let output = RawItemAttributes.encoderID_0_2_0_0 + RawItemAttributes.newline;

        output += this.name + RawItemAttributes.newline;

        output += this.rarityLevels.length + RawItemAttributes.newline;
        for (let level of this.rarityLevels) {
            output += level + RawItemAttributes.newline;
        }

        output += this.itemType + RawItemAttributes.newline;

        output += this.otherAttributes.length + RawItemAttributes.newline;
        for (let attribute of this.otherAttributes) {
            output += attribute + RawItemAttributes.newline;
        }

        output += this.levelRequirement + RawItemAttributes.newline;

        output += this.classRequirement + RawItemAttributes.newline;

        return output;
    }

    static decode(input: string): string {
        const decodedInput = decodeURIComponent(input);
        if (decodedInput.startsWith(RawItemAttributes.encoderID_0_2_0_0)) {
            return RawItemAttributes.decode_0_2_0_0(decodedInput);
        }

        return "";
    }

    static decode_0_2_0_0(input: string): string {
        let inputLines = input.split(RawItemAttributes.newline);
        const outputLines: string[] = [];

        if (inputLines.length > 0) {
            inputLines.shift();
        }

        if (inputLines.length > 0) {
            outputLines.push(inputLines.shift()!);
        }

        if (inputLines.length > 0) {
            let rarityLevelCount = Number(inputLines.shift());
            if (rarityLevelCount > 0 && inputLines.length > rarityLevelCount) {
                outputLines.push(inputLines.slice(0, rarityLevelCount).join(" "));
                inputLines = inputLines.slice(rarityLevelCount, inputLines.length);
            }
        }

        if (inputLines.length > 0) {
            outputLines[outputLines.length - 1] += " " + inputLines.shift();
        }

        if (inputLines.length > 0) {
            let otherAttributesCount = Number(inputLines.shift());
            if (otherAttributesCount > 0 && inputLines.length > otherAttributesCount) {
                outputLines.push(inputLines.slice(0, otherAttributesCount).join(RawItemAttributes.newline));
                inputLines = inputLines.slice(otherAttributesCount, inputLines.length);
            }
        }

        if (inputLines.length > 0) {
            outputLines.push(inputLines.shift()!);
        }

        if (inputLines.length > 0) {
            outputLines.push(inputLines.shift()!);
        }

        return outputLines.join(RawItemAttributes.newline);
    }
}

class ItemAttributes {
    name: string = "";
    rarityLevels: string[] = [];
    itemType: string = "";
    otherAttributes: string[] = [];
    levelRequirement: string = "";
    classRequirement: string = "";

    constructor(input: RawItemAttributes) {
        this.name = D4piUtilities.sanitize(input.name);

        this.rarityLevels = input.rarityLevels.map(level => D4piUtilities.sanitize(RawTextProcessor.transform(level, RawTextProcessor.rarityLevelProcessors)));

        this.itemType = D4piUtilities.sanitize(RawTextProcessor.transform(input.itemType, RawTextProcessor.itemTypeProcessors));

        this.otherAttributes = input.otherAttributes.map(attribute => D4piUtilities.sanitize(RawTextProcessor.transform(attribute, RawTextProcessor.itemAttributesProcessors)));

        this.levelRequirement = D4piUtilities.sanitize(RawTextProcessor.transform(input.levelRequirement, RawTextProcessor.levelRequirementProcessors));

        this.classRequirement = D4piUtilities.sanitize(RawTextProcessor.transform(input.classRequirement, RawTextProcessor.classRequirementProcessors));
    }

    renderDiv(output: HTMLDivElement) {
        output.style.background = "linear-gradient(0deg, #151411 0%, #1f1a12 75%, #51390c 100%)";
        output.style.borderImage = "linear-gradient(#866c12, #252218) 1";
        output.style.borderWidth = "5px";
        output.style.borderStyle = "solid";
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
