const Parents = {
    Interface: require("../Interface/Interface Parent.js"),
    Type: require("../Type/Type Parent.js"),
};

class Any {}
class SmallInt {}

const ItemTypes = Object.freeze({
    Any: [Any, "any", "*", 1 << 0],
    Array: [Array, [], "[]", "array", 1 << 1],
    BigInt: [BigInt, 1n, "n", "bigint", 1 << 2],
    Boolean: [Boolean, [true, false], true, false, "true", "false", "truefalse", "true, false", "boolean", 1 << 4],
    Error: [Error, "!", "error", 1 << 11],
    Function: [Function, "()", "=>", "() =>", "() {}", "() => {}", "=> {}", "fn", "function", 1 << 12],
    Interface: [Parents.Interface, "interface", 1 << 13],
    Number: [Number, 0, "0",  "num", "number", 1 << 16],
    Object: [Object, {}, "{}", "obj", "object", 1 << 17],
    SmallInt: [SmallInt, "1s", "smallint", "small", 1 << 18],
    String: [String, "'", '"', '`', "string", 1 << 19],
    Symbol: [Symbol, "sym", "symbol", 1 << 20],
    Type: [Parents.Type, "type", 1 << 21],
    URL: [URL, "url", 1 << 22],
});

module.exports = ItemTypes;