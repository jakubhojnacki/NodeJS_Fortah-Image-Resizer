/**
 * @module "StringMatcher" class
 * @description Matches string to a filter
 * @version 0.0.1 (2021-03-22)
 */

class StringMatcher {
	constructor(pPattern) {
		this.pattern = this.convertPattern(pPattern);
		this.regex = new RegExp(this.pattern);
	}

	convertPattern(pPattern) {
		let convertedPattern = pPattern;
		const specialCharacters = [".", ",", "*", "+", "!", "?", "^", "$", "\\", "=", "<", ">", "|", "(", ")", "[", "]", "{", "}"];
		for (const specialCharacter of specialCharacters)
			convertedPattern = convertedPattern.replace(specialCharacter, "\\" + specialCharacter);
		return convertedPattern;
	}

	matches(pName) {
		return this.regex.test(pName);
	}
}

module.exports = StringMatcher;