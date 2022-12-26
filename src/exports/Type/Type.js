const isObject = require("../../util/isObject.js");
const InternalError = require("../../util/Internal Error.js");
const ItemTypes = require("./Item Types.js");
const TypeParent = require("./Type Parent.js");

const defaultItems = [
    "any",
    "array",
    "bigInt",
    "boolean",
    "function",
    "number",
    "object",
    "string",
    "symbol",
];

/**
 * A utility to allow the forcing of variable and parameter types.
 * @class Type @extends TypeParent
 * @introduced 1.0.0, 12/25/2022
 * @maintained
 */
class Type extends TypeParent {
    /**
     * Constructor method for the Type Class.
     * @param {Object} TypeOptions The options for the Type Definition.
     *     @param {*} TypeOptions.type The type.
     *     @param {Boolean} [TypeOptions.required] Whether the Type will be forced. Defaults to true.
     *     @param {Boolean} [TypeOptions.throwError] Whether the Type Class will throw an Error when faulty. Defaults to true.
     *     @param {Boolean} [TypeOptions.returnBoolean] Whether the Type Class will return a Boolean instead of a value.
     *     @param {*} [TypeOptions.default] When the Type is not forced, it will return this value if false.
     */
    constructor(TypeOptions) {
        super();
        const error = new InternalError({ name: "TypeDef Error", message: "Unable to validate provided options.", stackTrace: true, date: false });

        if(isObject(TypeOptions) === false) throw error;

        const options = Object.assign({
            type: "any",
            required: true,
            throwError: true,
            default: undefined,
            returnBoolean: true,
        }, TypeOptions);
        
        if(typeof options.required !== "boolean") throw error;
        if(typeof options.throwError !== "boolean") throw error;

        this.options = options;
        this.itemType;

        Object.keys(ItemTypes).forEach(itemType => {
            if(ItemTypes[itemType].includes(options.type)) {
                if(defaultItems.includes(itemType.toLowerCase())) {
                    this.itemType = itemType.toLowerCase();
                } else {
                    this.itemType = ItemTypes[itemType][0];
                }
            } else if(ItemTypes[itemType] === options.type) {
                if(defaultItems.includes(itemType.toLowerCase())) {
                    this.itemType = itemType.toLowerCase();
                } else {
                    this.itemType = ItemTypes[itemType][0];
                }
            } else return;
        });

        if(!this.itemType) this.itemType = options.type;
    }

    /**
     * Determines if the provided Parameter matches the type.
     * @param {*} ItemParameter The Parameter to determine if matches this Type. 
     * @returns {*} Either whether it matches, an error, or the value/default value.
     */
    check(ItemParameter) {
        const TypeDefError = new InternalError({ name: "TypeDef Error", message: "Unable to validate Parameter as provided type.", stackTrace: true, date: false });
        const InvalidTypeError = new InternalError({ name: "InvalidType Error", message: "The provided Type is invalid, and is not usable.", stackTrace: true, date: false });

        let valid = false;
        
        if(!this.itemType || this.itemType === null) throw InvalidTypeError;
        else {
            const parameter = ItemParameter;
            if(
                (this.itemType === "any") ||
                ((this.itemType !== "object" && this.itemType !== "array") && typeof parameter === this.itemType) ||
                (parameter === this.itemType) ||
                (this.itemType === "object" && isObject(parameter) == true) ||
                (this.itemType === "array" && Array.isArray(parameter))
            ) {
                valid = true;
            } else {
                try {
                    if(parameter instanceof this.itemType) valid = true;
                } catch(_) {

                }
            }
        }

        if(this.options.returnBoolean === true) {
            if(this.options.throwError === true) {
                if(valid === false) throw TypeDefError;
                else return valid;
            } else return valid;
        }

        else {
            if(this.options.required === true) {
                if(this.options.throwError === true) {
                    if(valid === false) throw TypeDefError;
                    else return ItemParameter;
                } else {
                    if(valid === true) return ItemParameter;
                    else return this.options.default ?? undefined;
                }
            } else {
                if(valid === true) return ItemParameter;
                else return this.options.default ?? undefined;
            }
        }
    }

    /**
     * Determines if all provided Parameters match the provided Type.
     * @param  {...any} ItemParameters The group of Parameters to determine whether all match the Type.
     * @returns {Array} An array of values from the check method.
     */
    checkAll(...ItemParameters) {
        const all = [];

        ItemParameters.forEach(parameter => {
            const value = this.check(parameter);
            all.push(value);
        });

        return all;
    }

    applyTo(ItemParameter) {
        return this.check(ItemParameter);
    }

    applyToAll(...ItemParameters) {
        return this.checkAll(...ItemParameters);
    }
}

module.exports = Type;