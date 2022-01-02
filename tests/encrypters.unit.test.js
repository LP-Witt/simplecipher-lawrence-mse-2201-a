const { EncrypterBase, LetterLetter, LetterNumber } = require("../src/encrypters");

const validCharSet = `character, value\na, 1\nb, 2\nc, 3\n!, 4\n?, 5`;

test("EncrypterBase creates a valid character dictionary", () => {
  const expected = {
    byChar: {
      a: "1",
      b: "2",
      c: "3",
      "!": "4",
      "?": "5",
    },
    byVal: {
      1: "a",
      2: "b",
      3: "c",
      4: "!",
      5: "?",
    },
  };

  const actual = new EncrypterBase(validCharSet).charDict;

  expect(actual).toEqual(expected);
});

test("EncrypterBase throws an error when character set has no header", () => {
  const charSet = `a, 1\nb, 2\nc, 3\n!, 4\n?, 5`;

  expect(() => new EncrypterBase(charSet)).toThrow(
    'Character set is missing header "character, value".',
  );
});

test("EncrypterBase throws an error when character set has an invalid pair", () => {
  const charSet = `character, value\na,1\nb, 2\nc, 3\n!, 4\n?, 5`;

  expect(() => new EncrypterBase(charSet)).toThrow(
    'Could not derive character/value pair from "a,1".',
  );
});

test("EncrypterBase throws an error when the same value or character is reassigned", () => {
  const charSet1 = `character, value\na, 1\nb, 2\nc, 3\n!, 4\n?, 4`;

  const charSet2 = `character, value\na, 1\nc, 2\nc, 3\n!, 4\n?, 5`;

  expect(() => new EncrypterBase(charSet1)).toThrow(
    'The value "4" has already been assigned to character "!".',
  );

  expect(() => new EncrypterBase(charSet2)).toThrow(
    'The character "c" has already been assigned to value "2".',
  );
});

test("EncrypterBase.validateProperty throws an error when the provided character or value is not found", () => {
  const encrypter = new EncrypterBase(validCharSet);

  expect(() => encrypter.validateProperty("character", "v")).toThrow(
    'The character "v" does not exist in the provided character set.',
  );

  expect(() => encrypter.validateProperty("value", "v")).toThrow(
    'The value "v" does not exist in the provided character set.',
  );
});

test("LetterNumber.encrypt correctly encrypts a message", () => {
  const encrypter = new LetterNumber(validCharSet);
  const expected = "040205";

  const actual = encrypter.encrypt("!b?");

  expect(expected).toBe(actual);
});

test("LetterNumber.encrypt correctly encrypts a message with offset parameter", () => {
  const encrypter = new LetterNumber(validCharSet);
  const expected = "070508";

  const actual = encrypter.encrypt("!b?", 103);

  expect(expected).toBe(actual);
});

test("LetterNumber.decrypt correctly decrypts a message", () => {
  const encrypter = new LetterNumber(validCharSet);
  const expected = "!b?";

  const actual = encrypter.decrypt("040205");

  expect(expected).toBe(actual);
});

test("LetterNumber.decrypt correctly decrypts a message with offset parameter", () => {
  const encrypter = new LetterNumber(validCharSet);
  const expected = "!b?";

  const actual = encrypter.decrypt("070508", 103);

  expect(expected).toBe(actual);
});

test("LetterNumber throws an error when it recieves an invalid character set", () => {
  const charSet1 = `character, value\nab, 1\nb, 2\nc, 3\n!, 4\n?, 5`;

  const charSet2 = `character, value\na, 1\nb, 2\nc, 3\n!, 4\n?, .`;

  expect(() => new LetterNumber(charSet1)).toThrow('Expected length of "ab" to be 1.');

  expect(() => new LetterNumber(charSet2)).toThrow('Expected "." to be a number.');
});

test("LetterLetter.encrypt correctly encrypts a message", () => {
  const encrypter = new LetterLetter(validCharSet);
  const expected = "425";

  const actual = encrypter.encrypt("!b?");

  expect(expected).toBe(actual);
});

test("LetterLetter.encrypt correctly decrypts a message", () => {
  const encrypter = new LetterLetter(validCharSet);
  const expected = "!b?";

  const actual = encrypter.decrypt("425");

  expect(expected).toBe(actual);
});

test("LetterLetter throws an error when it recieves an invalid character set", () => {
  const charSet1 = `character, value\nab, 1\nb, 2\nc, 3\n!, 4\n?, 5`;

  const charSet2 = `character, value\na, 1\nb, 2\nc, 3\n!, 4\n?, 56`;

  expect(() => new LetterLetter(charSet1)).toThrow('Expected length of "ab" to be 1.');

  expect(() => new LetterLetter(charSet2)).toThrow('Expected length of "56" to be 1.');
});
