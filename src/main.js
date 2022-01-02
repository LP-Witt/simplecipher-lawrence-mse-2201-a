const fs = require("fs");
const path = require("path");

const { validateAlgorithm, validateKey } = require("./validators");
const { LetterLetter, LetterNumber } = require("./encrypters");

const main = async (args) => {
  const { charset, algorithm, encrypt, decrypt, key } = args;

  validateAlgorithm(algorithm);
  validateKey(key, algorithm);

  console.log("Reading character set...");

  const charSet = await (async () => {
    try {
      return await fs.promises.readFile(path.resolve(process.cwd(), charset), "utf-8");
    } catch (err) {
      throw err;
    }
  })();

  console.log("Initialising encrypter...");

  const encrypter = {
    ll: () => new LetterLetter(charSet),
    ln: () => new LetterNumber(charSet),
  }[algorithm]();

  const method = encrypt ? "encrypt" : "decrypt";
  const ext = encrypt ? ".enc" : "";

  console.log("Reading message...");

  const message = await (async () => {
    try {
      return await fs.promises.readFile(
        path.resolve(process.cwd(), encrypt || decrypt),
        "utf-8",
      );
    } catch (err) {
      throw err;
    }
  })();

  console.log(method.charAt(0).toUpperCase() + method.slice(1) + "ing message...");

  const result = encrypter[method](message, key);

  console.log("Writing message...");

  const location = (encrypt || decrypt).split("/");
  const fileName = location.pop().split(".")[0];
  const destination = path.resolve(process.cwd(), ...location, `${fileName}${ext}.txt`);

  try {
    await fs.promises.writeFile(destination, result, "utf-8");
    console.log("Process complete.");
  } catch (err) {
    throw err;
  }
};

module.exports = main;
