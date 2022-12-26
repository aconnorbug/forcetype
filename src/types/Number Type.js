const Type = require("../exports/Type/Type.js");

const NumberType = new Type({
    type: Number,
    required: true,
    throwError: true,
    returnBoolean: false,
    default: undefined,
});

module.exports = NumberType;