const isDefined = (val) => typeof val !== "undefined";

const validateLengthOf = (val, len) => {
  if (val.length !== len) {
    throw new Error(`Expected length of "${val}" to be ${len}.`);
  }
};

const validateStringIsNumber = (val) => {
  if (parseInt(val) !== parseInt(val)) {
    throw new Error(`Expected "${val}" to be a number.`);
  }
};

const validateIsNotAssigned = (prop, obj, key, value) => {
  if (isDefined(obj[prop])) {
    throw new Error(
      `The ${key} "${prop}" has already been assigned to ${value} "${obj[prop]}".`,
    );
  }
};

const validateAlgorithm = (algorithm) => {
  const algorithms = ["ll", "ln"];
  if (!algorithms.includes(algorithm)) {
    throw new Error(
      `Expected --algorithm argument "${algorithm}" to be one of: ${algorithms.join(
        ", ",
      )}.`,
    );
  }
};

const validateKey = (key, algorithm) => {
  if (isDefined(key) && typeof key !== "number" && algorithm === "ln") {
    throw new Error(
      `Expected --key argument "${key}" to be a number. Recieved ${typeof key}.`,
    );
  }
};

module.exports = {
  isDefined,
  validateIsNotAssigned,
  validateStringIsNumber,
  validateLengthOf,
  validateAlgorithm,
  validateKey,
};
