const Type = require("../exports/Type/Type.js");

const ObjectType = new Type({
    type: Object,
    required: true,
    throwError: true,
});

module.exports = ObjectType;