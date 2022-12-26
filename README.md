# forcetype
**Note**: This will be used in `atils@3.0.0`. I have it published here that way I can work on other projects as well (I use this more than you think).

## Imports
```js
const { 
    Type, 
    Interface, 
    InterfaceParser, 
    ItemTypes 
} = require("forcetype");
```

## Type Class
The Type Class is a simple way to force **singular** item types.

```js
const { Type } = require("forcetype");
const type = new Type({
    type: "*",
    // Any type. Includes basic "typeof" items, as well as classes.
    required: Boolean,
    // Whether the item is required. If set to false and throwError is true
    // an error will not be thrown. Otherwise, it will return the default
    // value (if returnBoolean is set to false)
    throwError: Boolean,
    // Requires the "required" parameter to be set to true. Will throw an error.
    returnBoolean: Boolean,
    // Only works with throwError set to false.
    // Returns a Boolean instead of the value/default value.
    default: "*",
    // Any item to be returned with the right conditions.
    // Does not get enforced.
});

type.check(ItemParameter);
// ItemParameter refers to the item you want to determine if matches the
// required type.

type.checkAll(...ItemParameters);
// REST Parameters for items to check.
```

## Interface Class
The Interface Class allows you to force type declarations on an object.

```js
const { Interface } = require("forcetype");
const i = new Interface(ObjectStructure);
// ObjectStructure refers to an Object that defines Type Declarations.
// Example:
/* 
{
    exampleKey1: String,
    exampleKey2: {
        type: String,
        required: false,
    } 
    // This is the preferred method, as it uses the same parameters as 
    // the Type Class.
}
*/
```

## Interface Parser
The Interface Parser is definitely the best way to go about type declarations. It allows you to utilize files with customized syntax to create Interfaces.

### .jsint Files
**`.jsint` (Stands for JavaScript Interface)** files are used to parse customized syntax into an Interface. It's capabilities are currently limited as it's still being worked on, but in the future this will be the most customizable type of Interface.

### How to Use the Interface Parser
> 1. Create a new `interface.jsint` file.
> 2. Import the InterfaceParser Function in your `index.js` file.
> 3. Run a new InterfaceParser instance.
> ```js
> const { InterfaceParser } = require("forcetype");
> class RandomClass {}
>
> const i = InterfaceParser({ filePath: "./interface.jsint" }, {
>    Random: RandomClass
> });
>
> // The first parameter refers to the options for the Parser itself, and
> // the second refers to any customized types.
>```
> 4. Open your `interface.jsint` file.
> 5. Create your Interface!

The InterfaceParser will read the provided file and will return an Interface based on the contents of the file.

### Creating Your .jsint File
The .jsint Files use a customized type of Syntax meant to help the Parser read and create your file.

**Creating Your First Key**<br>
Creating keys is very simple.
```jsint
KEYNAME = String;
```
This will make the Interface require an Object to look like:
```js
{
    KEYNAME: "Hello world!",
}
```

*Note: Semicolons are required after each declaration.*

**Creating an Array**<br>
Creating an Array of items is also simple. Because our Syntax is simple.<br>
***Note: You cannot create an Array consisting of multiple item types, yet.***

```jsint
KEYNAME = String;
ARRAYKEY = Array<String>;
```
The object will look like:
```js
{
    KEYNAME: "Hello world!",
    ARRAYKEY: ["Hello", "world!"],
}
```

**Creating an Optional Parameter**<br>
Like everything else, this is simple.
```jsint
KEYNAME = String;
ARRAYKEY = Array<String>;
OPTIONALKEY = Optional<Boolean>;
OPTIONALARRAYKEY = Optional<Array<String>>;
```

But, you can also specify default items.
```jsint
KEYNAME = String;
ARRAYKEY = Array<String>;
OPTIONALKEY = Optional<Boolean>:true;
OPTIONALARRAYKEY = Optional<Array<String>>:["Hello", "world!"];
```

Default Items are not forced via type declarations, and are read as JSON.
You can also specify custom keys via:
```jsint
CUSTOM = Random;
```
(This will call the RandomClass we specified earlier).

So here's an example of a .jsint File:
```jsint
userID = String;
password = String;
phoneNumber = Optional<Number>;
posts = Optional<Array<Post>>:[];
likes = Optional<Array<Post>>:[];
followers = Array<User>;
banned = Optional<Boolean>:false;
```

```js
const { InterfaceParser } = require("forcetype");
const i = InterfaceParser({ filePath: "./User.jsint" }, User, Post);

i.check(Object);
```

## Item Types
```js
Any // ForceType "Any" Keyword for any parameter
Array // Standard JavaScript Array
BigInt // Standard JavaScript BigInt
Boolean // Standard JavaScript Boolean
Error // Standard JavaScript Error
Function // Standard JavaScript Function
Interface // ForceType "Interface" Keyword for Interfaces
Number // Either any JavaScript Number or any JavaScript BigInt
Object // Standard JavaScript Object
SmallInt // ForceType "SmallInt" Keyword for JavaScript Number
String // Standard JavaScript String
Symbol // Standard JavaScript Symbol
Type // ForceType "Type" Keyword for Types
URL // Standard JavaScript Strings formatted as a URL
```

### How to define Item Types
```js
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
```

Just use any item within that Array. OR:
```js
const { ItemTypes } = require("forcetype");
const arrayItem = ItemTypes.Array;
```