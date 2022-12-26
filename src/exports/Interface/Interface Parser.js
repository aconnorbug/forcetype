const Interface = require("./Interface.js");
const fs = require("fs");
const path = require("path");
const ObjectType = require("../../types/Object Type.js");

/**
 * Creates an Interface from a .jsint File.
 * @param {Object} InterfaceParserOptions Options for the InterfaceParser.
 *     @param {String} InterfaceParserOptions.filePath The file to read.
 * @param {Object} KeyTypes An Object consisting of custom Value Types to be used with the .jsint File. 
 * @returns {Interface} The created Interface.
 */
function InterfaceParser(InterfaceParserOptions, KeyTypes) {
    if(InterfaceParserOptions) ObjectType.check(InterfaceParserOptions);
    if(KeyTypes) ObjectType.check(KeyTypes);

    const options = Object.assign({
        filePath: path.join(__dirname, '/Example.jsint')
    }, InterfaceParserOptions);

    let p = options.filePath;
    if(!p.endsWith(".jsint")) p = `${p}.jsint`;

    let content = fs.readFileSync(p, 'utf-8').split(/\r\n|\r|\n/).join("");
    const allItems = content.split(";").slice(0, content.split(";").length - 1);

    const settings = {};
    const obj = {};
    const defaults = {};
    const keys = [];

    if(KeyTypes) {
        Object.keys(KeyTypes).forEach(key => {
            keys.push(key);
        });
    }

    allItems.forEach(async(item) => {
        let i = item.split("=");

        let name = i[0].trim();
        let baseType = i[1].trim();
        let optional = false;

        if(name === "SETTING") {
            let setting = baseType.split(":")[0];
            let value = baseType.split(":")[1];

            settings[setting] = value;
            return;
        }

        if((baseType.startsWith("Optional<") || baseType.startsWith("Optional <")) && baseType.includes(">")) {
            optional = true;
            baseType = baseType
                .replace("Optional<", "")
                .replace("Optional <", "")
                .replace(">", "");

            if(baseType.split(":")[1]?.trim()) {
                defaults[name] = JSON.parse(baseType.split(":")[1]?.trim());
                baseType = baseType.split(":")[0].trim();
            }

            if(defaults[name] !== false && (!defaults[name] || defaults[name] === "")) defaults[name] = undefined;
        }

        if((baseType.startsWith("Array<") || baseType.startsWith("Array <")) && baseType.endsWith(">")) {
            let arrayOf = baseType.replace(/(Array)|(<)|(>)/g, "");
            let def = defaults[name];

            if(keys.includes(arrayOf)) {
                obj[name] = [{
                    type: [KeyTypes[arrayOf]].trim(),
                    optional,
                    def
                }];
            } else {
                obj[name] = [{
                    type: arrayOf.toLowerCase(),
                    optional,
                    def
                }];
            }
        } else {
            let def = defaults[name];
            if(keys.includes(baseType)) {
                obj[name] = {
                    type: KeyTypes[baseType],
                    optional,
                    def
                };
            } else {
                obj[name] = {
                    type: baseType.toLowerCase(),
                    optional,
                    def
                }
            }
        }
    });

    const i = new Interface(parse(obj, settings));
    return i;
}

function parse(object, settings) {
    const readable = {};

    Object.keys(object).forEach(item => {
        let r = true;
        let def = undefined;
        let throwE = false;

        if(object[item]?.optional === true) {
            r = false;
            def = object[item].def;

        } else if(Array.isArray(object[item]) && object[item][0].optional === true) {
            r = false;
            def = object[item][0].def;
        }

        if(settings?.throwError && JSON.parse(settings?.throwError) === true) throwE = true;
        
        if(Array.isArray(object[item])) {
            readable[item] = {
                type: [object[item][0].type],
                required: r ?? true,
                throwError: throwE,
                isArray: true,
                default: def
            }
        } else {
            readable[item] = {
                type: object[item].type,
                required: r,
                throwError: throwE,
                default: def
            };
        }
    });

    return readable;
}

module.exports = InterfaceParser;