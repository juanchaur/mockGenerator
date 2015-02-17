
// **************  CUSTOMER SERVICE  **************

module.exports = function (grunt) {
	grunt.registerTask('mockCustomerService', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:customerService#customerInformation_customerService:' + mockName);
	});
};