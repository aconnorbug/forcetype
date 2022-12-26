const Type = require("../Type/Type.js");
const ObjectType = require("../../types/Object Type.js");
const ItemTypes = require("../Type/Item Types.js");
const InterfaceParent = require("./Interface Parent.js");
const isObject = require("../../util/isObject.js");
const InternalError = require("../../util/Internal Error.js");

/**
 * Creates a Type Declaration to force an Object to follow specified Types.
 * @class Interface @extends InterfaceParent
 * @introduced 1.0.0, 12/25/2022
 * @maintained
 */
class Interface extends InterfaceParent {
    static ReturnTypes = Object.freeze({
        Value: "Interface.RETURN_TYPE.Value",
        Boolean: "Interface.RETURN_TYPE.Boolean",
        All: "Interface.RETURN_TYPE.All",
    });

    /**
     * Constructor method for the Interface Class.
     * @param {Object} ObjectStructure The Structure of the Interface. See the README.
     */
    constructor(ObjectStructure) {
        super();
        ObjectType.check(ObjectStructure);

        this.returns = Interface.ReturnTypes.Boolean;
        this.structure = {};

        Object.keys(ObjectStructure).forEach(StructureKey => {
            // As of atils@3.0.0, the Interface will (by default) not throw Type Declaration Errors. This can be overridden.
            let TypeOptions = {
                type: ItemTypes.Any,
                required: true,
                throwError: false,
                returnBoolean: true,
                default: undefined,
            };

            if(isObject(ObjectStructure[StructureKey]) === true) {
                let array = false;
                if(Array.isArray(ObjectStructure[StructureKey].type)) {
                    let item = ObjectStructure[StructureKey].type[0];
                    if(typeof item === "string") {
                        item = item.toLowerCase();
                    }

                    ObjectStructure[StructureKey].type = item;
                    array = true;
                }

                TypeOptions = Object.assign(TypeOptions, ObjectStructure[StructureKey]);
                
                let ValueTypeOptions = {...TypeOptions};
                ValueTypeOptions.returnBoolean = false;
                
                this.structure[StructureKey] = {
                    BooleanReturnType: new Type(TypeOptions),
                    ValueReturnType: new Type(ValueTypeOptions),
                    isArray: array,
                };
            } 
            
            else if(Array.isArray(ObjectStructure[StructureKey])) {
                let item = ObjectStructure[StructureKey][0];
                if(isObject(item)) {
                    TypeOptions = Object.assign(TypeOptions, item);
                    let ValueTypeOptions = {...TypeOptions};
                    ValueTypeOptions.returnBoolean = false;

                    this.structure[StructureKey] = {
                        BooleanReturnType: new Type(TypeOptions),
                        ValueReturnType: new Type(ValueTypeOptions),
                        isArray: true,
                    };
                }

                else if(typeof item === "string") {
                    TypeOptions.type = ObjectStructure[StructureKey][0].toLowerCase();
                    let ValueTypeOptions = {...TypeOptions};
                    ValueTypeOptions.returnBoolean = false;

                    this.structure[StructureKey] = {
                        BooleanReturnType: new Type(TypeOptions),
                        ValueReturnType: new Type(ValueTypeOptions),
                        isArray: true,
                    }
                }
            }

            else if(typeof ObjectStructure[StructureKey] === "string") {
                TypeOptions.type = ObjectStructure[StructureKey].toLowerCase();
                let ValueTypeOptions = {...TypeOptions};
                ValueTypeOptions.returnBoolean = false;

                this.structure[StructureKey] = {
                    BooleanReturnType: new Type(TypeOptions),
                    ValueReturnType: new Type(ValueTypeOptions),
                    isArray: false,
                }
            }
        });
    }

    /**
     * Sets the way things are returned when using the "check" method.
     * @param {String} ReturnType The method of returning items. Use "Interface.ReturnTypes[]".
     * @returns {Interface}
     */
    setReturnType(ReturnType) {
        if(
            ReturnType === Interface.ReturnTypes.All ||
            ReturnType === Interface.ReturnTypes.Booleans ||
            ReturnType === Interface.ReturnTypes.Value    
        ) {
            this.returns = ReturnType;
            return this;
        } else this.returns = Interface.ReturnTypes.Boolean;

        return this;
    }

    /**
     * Determines if an Object follows the previously provided Structure.
     * @param {Object} ObjectItem The Object to determine if follows the Structure.
     * @returns {*} Depends on Return Type.
     */
    check(ObjectItem) {
        ObjectType.check(ObjectItem);
        const object = {};
        let valid = true;

        Object.keys(this.structure).forEach(key => {
            let v = true;
            if(this.structure[key].isArray === true) {
                if(Array.isArray(ObjectItem[key])) {
                    ObjectItem[key].forEach(item => {
                        let _valid = this.structure[key].BooleanReturnType.check(item);
                        if(_valid !== true) {
                            v = false;
                        }
                    });
                } else {
                    v = false;
                }
            } else {
                if(this.structure[key].BooleanReturnType.check(ObjectItem[key]) !== true) v = false;
            }

            if(v === false) valid = false;
            if(Array.isArray(ObjectItem[key])) {
                let it = [];
                ObjectItem[key].forEach(i => {
                    let item = this.structure[key].ValueReturnType.check(i);
                    if(item !== undefined) it.push(item);
                });

                object[key] = it;
            }
            else object[key] = this.structure[key].ValueReturnType.check(ObjectItem[key]);
        });

        if(this.returns === Interface.ReturnTypes.Boolean) return valid;
        else if(this.returns === Interface.ReturnTypes.Value) return object;
        else if(this.returns === Interface.ReturnTypes.All) return { boolean: valid, values: object };
        else throw new InternalError({ name: "Unknown Return Type", message: "The Return Type is not valid." });
    }
}

module.exports = Interface;