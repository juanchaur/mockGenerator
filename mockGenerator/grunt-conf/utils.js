//TODO > Finish refactor of the tasks
// **************  ACCOUNTS SERVICE  **************

module.exports = function (grunt) {
	//Variables needed for the generators
	var	utils = utils || {};

	utils.generatorMapper = {};
	utils.mockCommands = {};

	utils.paths = {
		target: 'wireMock',
		targetFolder: '../wireMock',
		files: '__files',
		mappings: 'mappings'
	};

	utils.fixMappingsRoute = function (baseRoute) {
		var toBeRepalce = utils.paths.targetFolder + '/'+ utils.paths.mappings + '/';
		// var toBeRepalce = utils.paths.target + '/'+ utils.paths.mappings + '/';
		return baseRoute.replace(toBeRepalce, ''); //'wiremock/mappings/' > ''
	};


	utils.getMockCommand = function (mockName, innerService, fileName) {
		var commands = {
			file: utils.mockCommands[mockName][innerService]._files + fileName,
			map: utils.mockCommands[mockName][innerService].mappings + fileName
		}

		return commands;
	};

	//Setting mocks default values
	utils.mockOptions = {
		info : {
			currency: 'GBP'
		}
	};

	grunt.initConfig('utils', utils);
};
