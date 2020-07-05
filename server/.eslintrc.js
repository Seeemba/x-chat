module.exports = {
		root: true,
		parser: "@typescript-eslint/parser",
		parserOptions: {
				tsconfigRootDir: ".",
				project: "./tsconfig.json",
		},
		plugins: [
				"@typescript-eslint",
		],
		"rules": {
			"no-console": "error",
			"indent": [2, "tab"],
			"no-tabs": 0,
			"import/prefer-default-export": "off",
		},
		extends: [
			"airbnb-typescript/base",
			"eslint:recommended",
			"plugin:@typescript-eslint/eslint-recommended",
			"plugin:@typescript-eslint/recommended",
			"plugin:@typescript-eslint/recommended-requiring-type-checking",
			"plugin:eslint-comments/recommended",
			"plugin:promise/recommended",
			"prettier",
			"prettier/@typescript-eslint",
		],
};