function isObject(item) {
    if(typeof item !== "object" || item == null || Array.isArray(item)) return false;
    else return true;
}

module.exports = isObject;