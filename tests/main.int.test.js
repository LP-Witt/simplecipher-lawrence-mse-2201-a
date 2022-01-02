const fs = require("fs");
const path = require("path");

const main = require("../src/main");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  try {
    fs.unlinkSync(path.resolve(process.cwd(), "tests/data/example.enc.txt"));
  } catch {}
});

test("it encrypts and writes a message using the LetterNumber algorithm", async () => {
  const args = {
    charset: "tests/data/charset1.txt",
    algorithm: "ln",
    encrypt: "tests/data/example.txt",
  };

  const initial = fs.readFileSync(path.resolve(process.cwd(), args.encrypt), "utf-8");

  await main(args);

  const result = fs.readFileSync(
    path.resolve(process.cwd(), "tests/data/example.enc.txt"),
    "utf-8",
  );

  expect(result).toBeDefined();
  expect(initial).not.toEqual(result);
});

test("it decrypts and writes a message using the LetterNumber algorithm", async () => {
  const encryptArgs = {
    charset: "tests/data/charset1.txt",
    algorithm: "ln",
    encrypt: "tests/data/example.txt",
  };

  const expected = fs.readFileSync(
    path.resolve(process.cwd(), encryptArgs.encrypt),
    "utf-8",
  );

  await main(encryptArgs);

  const decryptArgs = {
    charset: "tests/data/charset1.txt",
    algorithm: "ln",
    decrypt: "tests/data/example.enc.txt",
  };

  await main(decryptArgs);

  const actual = fs.readFileSync(
    path.resolve(process.cwd(), encryptArgs.encrypt),
    "utf-8",
  );

  expect(expected).toBe(actual);
});

test("it encrypts and writes a message using the LetterLetter algorithm", async () => {
  const args = {
    charset: "tests/data/charset2.txt",
    algorithm: "ll",
    encrypt: "tests/data/example.txt",
  };

  const initial = fs.readFileSync(path.resolve(process.cwd(), args.encrypt), "utf-8");

  await main(args);

  const result = fs.readFileSync(
    path.resolve(process.cwd(), "tests/data/example.enc.txt"),
    "utf-8",
  );

  expect(result).toBeDefined();
  expect(initial).not.toEqual(result);
});

test("it decrypts and writes a message using the LetterLetter algorithm", async () => {
  const encryptArgs = {
    charset: "tests/data/charset2.txt",
    algorithm: "ll",
    encrypt: "tests/data/example.txt",
  };

  const expected = fs.readFileSync(
    path.resolve(process.cwd(), encryptArgs.encrypt),
    "utf-8",
  );

  await main(encryptArgs);

  const decryptArgs = {
    charset: "tests/data/charset2.txt",
    algorithm: "ll",
    decrypt: "tests/data/example.enc.txt",
  };

  await main(decryptArgs);

  const actual = fs.readFileSync(
    path.resolve(process.cwd(), encryptArgs.encrypt),
    "utf-8",
  );

  expect(expected).toBe(actual);
});

it("throws an error if the algorithm argument is invalid", async () => {
  const args = {
    charset: "tests/data/charset1.txt",
    algorithm: "nl",
    encrypt: "tests/data/example.txt",
  };

  await expect(main(args)).rejects.toThrow(
    'Expected --algorithm argument "nl" to be one of: ll, ln.',
  );
});

it("throws an error if the key argument is invalid", async () => {
  const args = {
    charset: "tests/data/charset1.txt",
    algorithm: "ln",
    encrypt: "tests/data/example.txt",
    key: "key",
  };

  await expect(main(args)).rejects.toThrow(
    'Expected --key argument "key" to be a number. Recieved string.',
  );
});

it("throws an error if arguments contain an invalid path", async () => {
  const args = {
    charset: "tests/data/charset3.txt",
    algorithm: "ln",
    encrypt: "tests/data/example.txt",
  };

  await expect(main(args)).rejects.toThrow();
});
