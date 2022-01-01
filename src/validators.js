const isDefined = (val) => typeof val !== "undefined";

const validateLengthOf = (val, len) => {
    if (val.length !== len) {
        throw new Error(`Expected length of ${val} to be ${len}.`)
    }
}

const validateStringIsNumber = (val) => {
    if (parseInt(val) !== parseInt(val)) {
        throw new Error(`Expected ${val} to be a number.`);
    }
}

const validateAlgorithm = (algorithm) => {
    const algorithms = ["ll", "ln"];
    if (!algorithms.includes(algorithm)) {
        throw new Error(`Expected --algorithm argument "${algorithm}" to be one of: ${algorithms.join(", ")}.`)
    }
};

const validateKey = (key, algorithm) => {
    if (isDefined(key) && typeof key !== "number" && algorithm === "ln") {
        throw new Error(`Expected --key argument "${key}" to be a number. Recieved ${typeof key}.`);
    }
}

module.exports = { validateStringIsNumber, validateLengthOf, validateAlgorithm, validateKey };