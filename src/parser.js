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
    .option('encode', {
        alias: 'e',
        type: "string",
        desc: "encode the target file"
    })
    .option('decode', {
        alias: 'd',
        type: "string",
        desc: "decode the target file"
    })
    .option('key', {
        alias: 'k',
        type: "number",
        desc: "a number to offset letter-number encoding"
    })
    .check((argv) => {
        const { encode, decode } = argv;
        if (!encode && !decode) {
            throw new Error("An argument must be provided for either --encode or --decode.");
        }
        return true;
    })
    .help()

module.exports = () => parser.argv;