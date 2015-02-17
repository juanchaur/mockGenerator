
// **************  BASIC DATA  **************

module.exports = function (grunt) {

	grunt.registerTask('mockBasicData', function (mockName) {
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:basicData#basicData:' + mockName);
	});
};