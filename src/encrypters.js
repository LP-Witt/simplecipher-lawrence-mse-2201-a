const {
  isDefined,
  validateStringIsNumber,
  validateLengthOf,
  validateIsNotAssigned,
} = require("./validators");

class EncrypterBase {
  constructor(charSet, charValidator, valValidator) {
    this.charDict = EncrypterBase.parseCharSet(charSet, charValidator, valValidator);
  }

  static parseCharSet(charSet, charValidator, valValidator) {
    const charRows = charSet.split("\n");

    if (charRows[0].trim() !== "character, value") {
      throw new Error('Character set is missing header "character, value".');
    }

    const charDict = charRows.slice(1).reduce(
      (acc, curr) => {
        const pairSplit = curr.split(", ");

        if (pairSplit.length !== 2)
          throw new Error(`Could not derive character/value pair from "${curr}".`);

        const char = pairSplit[0];
        const val = pairSplit[1].replace("\r", "");

        if (typeof charValidator === "function") charValidator(char);
        if (typeof valValidator === "function") valValidator(val);

        validateIsNotAssigned(char, acc.byChar, "character", "value");
        validateIsNotAssigned(val, acc.byVal, "value", "character");

        acc.byChar[char] = val;
        acc.byVal[val] = char;

        return acc;
      },
      { byChar: {}, byVal: {} },
    );

    return charDict;
  }

  validateProperty(type, prop) {
    const result = {
      character: this.charDict.byChar[prop],
      value: this.charDict.byVal[prop],
    }[type];

    if (!isDefined(result)) {
      throw new Error(
        `The ${type} "${prop}" does not exist in the provided character set.`,
      );
    }
  }
}

class LetterNumber extends EncrypterBase {
  constructor(charSet) {
    super(
      charSet,
      (char) => validateLengthOf(char, 1),
      (val) => validateStringIsNumber(val),
    );
  }

  encrypt(str, offset = 0) {
    return str.split("").reduce((acc, curr) => {
      this.validateProperty("character", curr);
      const val = this.charDict.byChar[curr];
      const encoded = ((v) => (v > 99 ? v % 100 : v))(parseInt(val) + offset);
      const minTwo = encoded < 10 ? `0${encoded}` : `${encoded}`;
      return acc + minTwo;
    }, "");
  }

  decrypt(str, offset = 0) {
    let out = "";

    for (let i = 2; i <= str.length; i += 2) {
      const encoded = parseInt(str.slice(i - 2, i));
      const decoded = ((v) => (v > 99 ? `${v % 100}` : `${v}`))(
        100 - ((offset - encoded) % 100),
      );
      this.validateProperty("value", decoded);
      out += this.charDict.byVal[decoded];
    }

    return out;
  }
}

class LetterLetter extends EncrypterBase {
  constructor(charSet) {
    super(
      charSet,
      (char) => validateLengthOf(char, 1),
      (val) => validateLengthOf(val, 1),
    );
  }

  encrypt(str) {
    return str.split("").reduce((acc, curr) => {
      this.validateProperty("character", curr);
      return acc + this.charDict.byChar[curr];
    }, "");
  }

  decrypt(str) {
    return str.split("").reduce((acc, curr) => {
      this.validateProperty("value", curr);
      return acc + this.charDict.byVal[curr];
    }, "");
  }
}

module.exports = { EncrypterBase, LetterNumber, LetterLetter };
