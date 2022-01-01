const { validateStringIsNumber, validateLengthOf } = require("./validators");

class EncrypterBase {
    constructor(charSet, charValidator, valValidator) {
        this.charDict = EncrypterBase.parseCharSet(charSet, charValidator, valValidator);
    }

    static parseCharSet(charSet, charValidator, valValidator) {
        const charRows = charSet.split("\n");

        if (charRows[0].trim() !== "character, value") {
            throw new Error('Character set is missing header "character, value".')
        }
        
        const charDict = charRows.slice(1).reduce((acc, curr) => {
            const pairSplit = curr.split(", ");

            if (pairSplit.length !== 2) {
                throw new Error(`Could not derive character/value pair from "${curr}".`);
            }

            const char = pairSplit[0];
            const val = pairSplit[1].replace("\r", "");

            if (typeof charValidator === "function") charValidator(char);
            if (typeof valValidator === "function") valValidator(val);

            acc.byChar[char] = val;
            acc.byVal[val] = char;

            return acc;
        }, {byChar: {}, byVal: {}});

        if (Object.keys(charDict.byChar).length !== Object.keys(charDict.byVal).length) {
            throw new Error(`Character and value keys are mismatched. Check for duplicates.`);
        }

        return charDict;
    }
}

class LetterNumber extends EncrypterBase {
    constructor(charSet) {
        super(charSet, 
            (char) => validateLengthOf(char, 1), 
            (val) => validateStringIsNumber(val)
        )
    }

    encrypt(str, offset = 0) {
        return str.split("").reduce((acc, curr) => {
            const val = this.charDict.byChar[curr];
            if (!val) return acc;
            const encoded = (v => v > 99 ? v % 100 : v)(parseInt(val) + offset);
            const minTwo = encoded < 10 ? `0${encoded}` : `${encoded}`;
            return acc + minTwo;
        }, "");
    }

    decrypt(str, offset = 0) {
        let out = "";

        for (let i=2; i<=str.length; i+=2) {
            const encoded = parseInt(str.slice(i-2, i));
            const decoded = (v => v > 99 ? `${v % 100}` : `${v}`)(100 - ((offset - encoded) % 100));
            out += this.charDict.byVal[decoded] || "";
        }

        return out;
    }
}

class LetterLetter extends EncrypterBase {
    constructor(charSet) {
        super(charSet, 
            (char) => validateLengthOf(char, 1),
            (val) => validateLengthOf(val, 1)
        )
    } 

    encrypt(str) {
        return str.split("").reduce((acc, curr) => acc + (this.charDict.byChar[curr] || ""), "");
    }

    decrypt(str) {
        return str.split("").reduce((acc, curr) => acc + (this.charDict.byVal[curr] || ""), "");
    }
}

module.exports = { LetterNumber, LetterLetter };