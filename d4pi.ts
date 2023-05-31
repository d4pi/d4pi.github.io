class RawItemAttributes {
    name: string;
    rarityAndType: string;
    otherAttributes: string[];

    constructor(htmlTextAreaElement: HTMLTextAreaElement) {
        const text = htmlTextAreaElement.value;
        const lines = text.split(/\r?\n/);
        this.name = (lines.length > 0) ? lines[0] : "";
        this.rarityAndType = (lines.length > 1) ? lines[1] : "";
        this.otherAttributes = (lines.length > 2) ? lines.slice(2) : [];
    }
}

class RawItemAttributeProcessor {
    rawTextMatcher: RegExp;
    RawItemAttributeProcessor: string;

    constructor(rawTextMatcher: RegExp, RawItemAttributeProcessor: string) {
        this.rawTextMatcher = rawTextMatcher;
        this.RawItemAttributeProcessor = RawItemAttributeProcessor;
    }
}

class ItemAttributes {
    name: string = "";
    rarity: string = "";
    type: string = "";
    otherAttributes: string[] = [];
    levelRequirement: string = "";
    classRequirement: string = "";

    init1(rawItemAttributes: RawItemAttributes) {
        this.name = rawItemAttributes.name;

        const rawRarityText = rawItemAttributes.rarityAndType.replace(/^((A|S)? ?(C|L|M|R|U)).*$/i, "$1");
        this.rarity = Array.from(rawRarityText.replace(" ", "")).map((c) => { return ItemAttributes.transform(c, ItemAttributes.rarityProcessors); }).join(" ");

        const rawTypeText = rawItemAttributes.rarityAndType.substring(rawRarityText.length);
        this.type = ItemAttributes.transform(rawTypeText.replace(" ", ""), ItemAttributes.typeProcessors);

        while (rawItemAttributes.otherAttributes[rawItemAttributes.otherAttributes.length - 1].replace(/\s/g, "").length == 0) {
            rawItemAttributes.otherAttributes.pop();
        }

        this.classRequirement = "";
        if (rawItemAttributes.otherAttributes.length > 0) {
            this.classRequirement = ItemAttributes.transform(rawItemAttributes.otherAttributes[rawItemAttributes.otherAttributes.length - 1], ItemAttributes.classRequirementProcessors);
            if (this.classRequirement !== "") {
                rawItemAttributes.otherAttributes.pop();
            }
        }

        this.levelRequirement = "";
        if (rawItemAttributes.otherAttributes.length > 0) {
            this.levelRequirement = ItemAttributes.transform(rawItemAttributes.otherAttributes[rawItemAttributes.otherAttributes.length - 1], ItemAttributes.levelRequirementProcessors);
            if (this.levelRequirement !== "") {
                rawItemAttributes.otherAttributes.pop();
            }
        }

        this.otherAttributes = [];
        for (let rawOtherAttribute of rawItemAttributes.otherAttributes) {
            this.otherAttributes.push(ItemAttributes.transform(rawOtherAttribute, ItemAttributes.attributeProcessors));
        }
    }

    static transform(rawText: string, processors: RawItemAttributeProcessor[]) {
        for (let processor of processors) {
            if (processor.rawTextMatcher.test(rawText)) {
                return rawText.replace(processor.rawTextMatcher, processor.RawItemAttributeProcessor);
            }
        }

        return "";
    }

    static rarityProcessors: RawItemAttributeProcessor[] = [
        new RawItemAttributeProcessor(/^A$/i, "Ancestral"),
        new RawItemAttributeProcessor(/^S$/i, "Sacred"),
        new RawItemAttributeProcessor(/^C$/i, "Common"),
        new RawItemAttributeProcessor(/^L$/i, "Legendary"),
        new RawItemAttributeProcessor(/^M$/i, "Magic"),
        new RawItemAttributeProcessor(/^R$/i, "Rare"),
        new RawItemAttributeProcessor(/^U$/i, "Unique")
    ];

    static typeProcessors: RawItemAttributeProcessor[] = [
        new RawItemAttributeProcessor(/^Am$/i, "Amulet"),
        new RawItemAttributeProcessor(/^Ax$/i, "Axe"),
        new RawItemAttributeProcessor(/^Bo$/i, "Boots"),
        new RawItemAttributeProcessor(/^Bw$/i, "Bow"),
        new RawItemAttributeProcessor(/^Ch$/i, "Chest Armor"),
        new RawItemAttributeProcessor(/^Cr$/i, "Crossbow"),
        new RawItemAttributeProcessor(/^D$/i, "Dagger"),
        new RawItemAttributeProcessor(/^F$/i, "Focus"),
        new RawItemAttributeProcessor(/^G$/i, "Gloves"),
        new RawItemAttributeProcessor(/^H$/i, "Helm"),
        new RawItemAttributeProcessor(/^M$/i, "Mace"),
        new RawItemAttributeProcessor(/^Pa$/i, "Pants"),
        new RawItemAttributeProcessor(/^Po$/i, "Polearm"),
        new RawItemAttributeProcessor(/^R$/i, "Ring"),
        new RawItemAttributeProcessor(/^Sc$/i, "Scythe"),
        new RawItemAttributeProcessor(/^Sh$/i, "Shield"),
        new RawItemAttributeProcessor(/^St$/i, "Staff"),
        new RawItemAttributeProcessor(/^Sw$/i, "Sword"),
        new RawItemAttributeProcessor(/^TA$/i, "Two-Handed Axe"),
        new RawItemAttributeProcessor(/^TM$/i, "Two-Handed Mace"),
        new RawItemAttributeProcessor(/^TSc$/i, "Two-Handed Scythe"),
        new RawItemAttributeProcessor(/^TSw$/i, "Two-Handed Sword"),
        new RawItemAttributeProcessor(/^W$/i, "Wand")
    ];

    static attributeProcessors: RawItemAttributeProcessor[] = [
        new RawItemAttributeProcessor(/^-+$/, "---"),
        new RawItemAttributeProcessor(/^(\d+) (\d+) DpH$/i, "[$1 - $3] Damage per Hit"),
        new RawItemAttributeProcessor(/^(\d+) A$/i, "$1 Armor"),
        new RawItemAttributeProcessor(/^(\d+) DPS$/i, "$1 Damage Per Second"),
        new RawItemAttributeProcessor(/^(\d+\.\d+) ApS$/i, "$1 Attacks per Second"),
        new RawItemAttributeProcessor(/^(\d+\.\d+) ApSSW$/i, "$1 Attacks per Second (Slow Weapon)"),
        new RawItemAttributeProcessor(/^(\d+\.\d+) ApSVFW$/i, "$1 Attacks per Second (Very Fast Weapon)"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? CR$/i, "$1% Cooldown Reduction"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? DR$/i, "$1% Damage Reduction"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? FR$/i, "$1% Fire Resistance"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? LR$/i, "$1% Lightning Resistance"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? MCR$/i, "$1% Mana Cost Reduction"),
        new RawItemAttributeProcessor(/^(\d+(\.\d+))%? SR$/i, "$1% Shadow Resistance"),
        new RawItemAttributeProcessor(/^\+?(\d+) I$/i, "+$1 Intelligence"),
        new RawItemAttributeProcessor(/^\+?(\d+) AS$/i, "+$1 All Stats"),
        new RawItemAttributeProcessor(/^\+?(\d+) LOK$/i, "+$1 Life On Kill"),
        new RawItemAttributeProcessor(/^\+?(\d+) LRwNDR$/i, "+$1 Life Regeneration while Not Damaged Recently"),
        new RawItemAttributeProcessor(/^\+?(\d+) ML$/i, "+$1 Maximum Life"),
        new RawItemAttributeProcessor(/^\+?(\d+) RoC$/i, "+$1 Rank of Caltrops (Rogue Only)"),
        new RawItemAttributeProcessor(/^\+?(\d+) RoI$/i, "+$1 Rank of Incinerate (Sorcerer Only)"),
        new RawItemAttributeProcessor(/^\+?(\d+) RoLS$/i, "+$1 Rank of Lightning Spear (Sorcerer Only)"),
        new RawItemAttributeProcessor(/^\+?(\d+) RoM$/i, "+$1 Rank of Meteor (Sorcerer Only)"),
        new RawItemAttributeProcessor(/^\+?(\d+) RoSG$/i, "+$1 Rank of Smoke Grenade (Rogue Only)"),
        new RawItemAttributeProcessor(/^\+?(\d+) S$/i, "+$1 Strength"),
        new RawItemAttributeProcessor(/^\+?(\d+) W$/i, "+$1 Willpower"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? AS$/i, "+$1% Attack Speed"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? CD$/i, "+$1% Cold Damage"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? CSC$/i, "+$1% Critical Strike Chance"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? CSD$/i, "+$1% Core Skill Damage"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? CSD$/i, "+$1% Critical Strike Damage"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? DtCCE$/i, "+$1% Damage to Crowd Controlled Enemies"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? DtCE$/i, "+$1% Damage to Close Enemies"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? DtSlE$/i, "+$1% Damage to Slowed Enemies"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? DtStE$/i, "+$1% Damage to Stunned Enemies"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? HR$/i, "+$1% Healing Received"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? OD$/i, "+$1% Overpower Damage"),
        new RawItemAttributeProcessor(/^\+?(\d+(\.\d+))%? VD$/i, "+$1% Vulnerable Damage"),
        new RawItemAttributeProcessor(/^EG \+?(\d+(\.\d+))%? MSf1S$/i, "Evade Grants +$1% Movement Speed for 1 Second"),
        new RawItemAttributeProcessor(/^ES$/, "Empty Socket"),
        new RawItemAttributeProcessor(/^LHUta *(\d+(\.\d+))%? *CtEINE$/i, "Lucky Hit: Up to a +$1% Chance to Execute Injured Non-Elites"),
        new RawItemAttributeProcessor(/^WIYPAG *(\d+(\.\d+))%? *MLaB$/i, "While Injured, Your Potion Also Grants $1% Maximum Life as Barrier"),
        new RawItemAttributeProcessor(/^WIYPAR *(\d+(\.\d+))%? *R$/i, "While Injured, Your Potion Also Restores $1% Resource"),
    ];

    static levelRequirementProcessors: RawItemAttributeProcessor[] = [
        new RawItemAttributeProcessor(/^RL *(\d+)$/i, "Requires Level $1")
    ];

    static classRequirementProcessors: RawItemAttributeProcessor[] = [
        new RawItemAttributeProcessor(/^B$/i, "Barbarian"),
        new RawItemAttributeProcessor(/^D$/i, "Druid"),
        new RawItemAttributeProcessor(/^N$/i, "Necromancer"),
        new RawItemAttributeProcessor(/^R$/i, "Rogue"),
        new RawItemAttributeProcessor(/^S$/i, "Sorcerer")
    ];

    renderDiv(htmlDivElement: HTMLDivElement) {
        htmlDivElement.style.background = "linear-gradient(0deg, #151411 0%, #1f1a12 75%, #51390c 100%)";
        htmlDivElement.style.borderImage = "linear-gradient(#866c12, #252218) 1";
        htmlDivElement.style.borderWidth = "5px";
        htmlDivElement.style.borderStyle = "solid";
        htmlDivElement.style.padding = "1em";
        htmlDivElement.style.width = "fit-content";

        htmlDivElement.innerHTML = "";

        htmlDivElement.innerHTML += "<p>" + ItemAttributes.sanitize(this.name) + "</p>"
        htmlDivElement.innerHTML += "<p>" + ItemAttributes.sanitize(this.rarity + " " + this.type) + "</p>"

        for (let otherAttribute of this.otherAttributes) {
            const sanitizedText = ItemAttributes.sanitize(otherAttribute);

            if (sanitizedText === "---") {
                htmlDivElement.innerHTML += "<hr>";
            } else {
                htmlDivElement.innerHTML += "<p>" + ItemAttributes.sanitize(sanitizedText) + "</p>"
            }
        }

        htmlDivElement.innerHTML += "<p class=\"text-end\">" + ItemAttributes.sanitize(this.levelRequirement) + "</p>"
        htmlDivElement.innerHTML += "<p class=\"text-end\">" + ItemAttributes.sanitize(this.classRequirement) + "</p>"
    }

    static sanitize(str: string): string {
        return str.replace(/['"&<>]/g, "?");
    }

    encode_0_1(): string {
        // encodeURIComponent
        let ret = "0.1__";
        ret += this.name + "__";
        ret += this.rarity + "__";
        ret += this.type + "__";
        ret += this.levelRequirement + "__";
        ret += this.classRequirement + "__";
        ret += this.otherAttributes.join("__");
        return encodeURIComponent(ret);
    }

    decode_0_1(encodedText: string) {
        encodedText = decodeURIComponent(encodedText);

        const separator = "__";
        let i = encodedText.indexOf(separator);
        encodedText = encodedText.substring(i + separator.length);

        i = encodedText.indexOf(separator);
        this.name = encodedText.substring(0, i);
        encodedText = encodedText.substring(i + separator.length);

        i = encodedText.indexOf(separator);
        this.rarity = encodedText.substring(0, i);
        encodedText = encodedText.substring(i + separator.length);

        i = encodedText.indexOf(separator);
        this.type = encodedText.substring(0, i);
        encodedText = encodedText.substring(i + separator.length);

        i = encodedText.indexOf(separator);
        this.levelRequirement = encodedText.substring(0, i);
        encodedText = encodedText.substring(i + separator.length);

        i = encodedText.indexOf(separator);
        this.classRequirement = encodedText.substring(0, i);
        encodedText = encodedText.substring(i + separator.length);

        while ((i = encodedText.indexOf(separator)) !== -1) {
            this.otherAttributes.push(encodedText.substring(0, i));
            encodedText = encodedText.substring(i + separator.length);
        }
    }

    renderAnchor(htmlAnchorElement: HTMLAnchorElement) {
        const encodedText = this.encode_0_1()
        htmlAnchorElement.href = "view/#" + encodedText;
        htmlAnchorElement.text = "https://d4pi.com/view/#" + encodedText;
    }

    init2(encodedText: string) {
        this.decode_0_1(encodedText);
    }
}
