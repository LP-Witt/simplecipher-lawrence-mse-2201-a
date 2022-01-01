const yargs = require("yargs");

const parser = yargs
    .option('charset', {
        alias: 'c',
        demand: true,
        type: "string",
        desc: "target file containing a character set for encoding/decoding"
    })
    .option('algorithm', {
        alias: 'a',
        demand: true,
        type: "string",
        desc: "algorithm 'ln' (letter-number) or 'll' (letter-letter)"
    })
    .option('encrypt', {
        alias: 'e',
        type: "string",
        desc: "encrypt the target file"
    })
    .option('decrypt', {
        alias: 'd',
        type: "string",
        desc: "decrypt the target file"
    })
    .option('key', {
        alias: 'k',
        type: "number",
        desc: "a number to offset letter-number encoding"
    })
    .check((argv) => {
        const { encrypt, decrypt } = argv;
        if (!encrypt && !decrypt) {
            throw new Error("An argument must be provided for either --encrypt or --decrypt.");
        }
        return true;
    })
    .help()

module.exports = () => parser.argv;