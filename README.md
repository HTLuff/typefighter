# Typefighter ESLint Plugin >O<

`typefighter` is an ESLint plugin designed to provide type checking based on comments above functions. This allows developers to specify input and output types for functions and have them enforced through linting without the need for a full TypeScript setup, offering the flexibility of JavaScript while gaining some of the type safety benefits traditionally associated with compiled TypeScript. This approach can be particularly beneficial for legacy projects or teams that prefer to stay within the JavaScript ecosystem but still want to enforce type constraints for better code quality.

## Features

- Enforce input and output types for JavaScript functions through comments.
- Provides detailed error messages when type mismatches are detected.
- Easy integration with ESLint.

## Installation

To install `typefighter`, you need to have `eslint` and `eslint-scope` installed in your project. You can install these dependencies using npm:

```bash
npm install eslint eslint-scope espree
```

Then, install the `typefighter` ESLint plugin:

```bash
npm install eslint-plugin-typefighter
```

## Usage

To use `typefighter`, add it to your ESLint configuration file (`.eslintrc.json`, `.eslintrc.js`, etc.):

```json
{
  "plugins": ["typefighter"],
  "rules": {
    "typefighter/type-check": "error"
  }
}
```

## Adding Type Annotations

You can add type annotations to your functions using comments. The format for the annotations is as follows:

```javascript
/**
 * typefighter
 * @function functionName
 * @input type1, type2, ...
 * @output returnType
 */
function functionName(param1, param2, ...) {
  // function implementation
}
```

### Example

```javascript
/**
 * typefighter
 * @function multiplyBy
 * @input number, number
 * @output number
 */
function multiplyBy(num, multiple) {
    return num * multiple;
}

multiplyBy("5", 2); // error >O< multiplyBy: Argument at position 0 should be of type number, but got string
```

In this example, the `multiplyBy` function expects two `number` arguments and returns a `number`. If you pass a `string` to `multiplyBy`, `typefighter` will trigger a warning.

### Current Limitations

Currently, the `typefighter` plugin has limitations when handling variables as parameters. For example:

```javascript
let num = "hello";
multiplyBy(num, 2); // This might not trigger a warning as expected
```

In this case, `typefighter` may not correctly resolve the type of `num` due to limitations in scope resolution. The plugin relies on the `eslint-scope` library to handle variable scopes, but it can sometimes fail to accurately determine the type of variables when they are passed as arguments.

## Development

### Running ESLint

To run ESLint with the `typefighter` plugin, use the following command:

```bash
npm run lint
```

### Running Tests

To run the tests for this project, use:

```bash
npm test
```

## Contributing

We welcome contributions to the `typefighter` project. If you have an idea for a new feature or have found a bug, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

`typefighter` relies on the following open-source projects:

- [ESLint](https://eslint.org/)
- [eslint-scope](https://github.com/eslint/eslint-scope)
- [espree](https://github.com/eslint/espree)

## Contact

For more information or to report issues, please visit the [GitHub repository](https://github.com/HTLuff/typefighter).
