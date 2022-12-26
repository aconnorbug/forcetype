# Examples

## Interface
```js
const { Interface } = require("atils");
const i = new Interface({
    exampleKey: String,
    exampleKey2: {
        type: String,
        required: true,
    },
    exampleKey3: {
        type: Number,
        required: false,
        default: 0,
    },
    exampleKey4: [ String ],
    exampleKey5: [
        {
            type: String,
            required: true,
        }
    ],
});

// The "default" key is only required when the "required" key is set to false.
// Wrapping a value in an Array makes it so the parameter is an Array of (item).
```

## InterfaceParser
The `InterfaceParser` uses `.jsint` files to create Interfaces. It works a little bit differently than a standard Interface.
**.jsint files are only used with the InterfaceParser.**

### **.jsint Files**
.jsint Files follow a really simple syntax:
```jsint
KeyName = Type;
```

An example of a .jsint file would look like this:
```jsint
id = String;
username = String;
password = String;
likes = Array<String>;
```

And yes, with the InterfaceParser, you can use custom classes.
```jsint
id = String;
username = String;
password = Password;
likes = Array<Post>;
```

### **Using the InterfaceParser**
The `InterfaceParser` is rather simple to use. Using the last example of .jsint files, we'll be applying custom Class Types to the InterfaceParser.
```js
const { InterfaceParser } = require("atils");
const i = new InterfaceParser({ filePath: "./interfaces/Interface.jsint" }, {
    Password: class {},
    Post: class {},
});

// Specifying the "Password" key as a Class will make that Class be the type used for any label with the "Password" key.
// Same thing with the "Post" key, but it falls into an "Array of Posts".
```

### **.jsint -> Interface**
```jsint
exampleKey = String;
exampleKey2 = Array<String>;
```

```js
const { Interface } = require("atils");
const i = new Interface({
    exampleKey: String,
    exampleKey2: [String],
});
```