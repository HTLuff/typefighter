const eslintScope = require("eslint-scope");

const extractAnnotations = (comments) => {
  const annotations = {};
  comments.forEach((comment) => {
    const lines = comment.value
      .split("\n")
      .map((line) => line.trim().replace(/^\*+/, "").trim());
    let currentFunction = null;
    let isTypefighterComment = false;

    lines.forEach((line) => {
      if (line.startsWith("typefighter")) {
        isTypefighterComment = true;
      }

      if (isTypefighterComment) {
        if (line.startsWith("@function")) {
          currentFunction = line.split(" ")[1];
          annotations[currentFunction] = {};
        } else if (line.startsWith("@input")) {
          const inputStr = line.replace("@input ", "");
          annotations[currentFunction]["input"] = inputStr
            .split(",")
            .map((type) => type.trim());
        } else if (line.startsWith("@output")) {
          annotations[currentFunction]["output"] = line
            .replace("@output ", "")
            .trim();
        }
      }
    });
  });
  //   console.log("Extracted Annotations:", JSON.stringify(annotations, null, 2));
  return annotations;
};

const getLiteralType = (node) => {
  switch (typeof node.value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "unknown";
  }
};

const getIdentifierType = (scopeManager, node) => {
  let scope = scopeManager.acquire(node);
  while (scope) {
    const variable = scope.variables.find((v) => v.name === node.name);
    if (variable && variable.defs.length > 0 && variable.defs[0].node.init) {
      return getType(scopeManager, variable.defs[0].node.init);
    }
    scope = scope.upper;
  }
  return "unknown";
};

const getType = (scopeManager, node) => {
  switch (node.type) {
    case "Literal":
      return getLiteralType(node);
    case "Identifier":
      return getIdentifierType(scopeManager, node);
    default:
      return "unknown";
  }
};

const checkTypes = (context, node, annotations, scopeManager) => {
  const functionName = node.callee.name;
  //   console.log(">O< Checking function: ", functionName);
  const funcAnnotations = annotations[functionName];

  if (funcAnnotations) {
    // console.log("Function annotations:", funcAnnotations);

    funcAnnotations.input.forEach((expectedType, index) => {
      const arg = node.arguments[index];
      let actualType = getType(scopeManager, arg);

      //   console.log(`Argument at position ${index}:`, {
      //     expectedType,
      //     actualType,
      //     arg,
      //   });

      if (actualType !== expectedType && actualType !== "unknown") {
        context.report({
          node: arg,
          message: `>O< ${functionName}: Argument at position ${index} should be of type ${expectedType}, but got ${actualType}`,
        });
      }
    });
  }
};

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Type checking based on typefighter annotations",
      category: "Possible Errors",
    },
    schema: [], // no options
  },
  create: function (context) {
    let annotations = {};
    let scopeManager;

    return {
      Program: (node) => {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        annotations = extractAnnotations(comments);
        scopeManager = eslintScope.analyze(sourceCode.ast, {
          ecmaVersion: 2020,
          sourceType: "module",
        });
      },
      CallExpression: (node) => {
        checkTypes(context, node, annotations, scopeManager);
      },
    };
  },
};
