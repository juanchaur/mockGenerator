
// **************  REINSTATE **************

module.exports = function (grunt) {

	// ********** Inventory **********
	grunt.registerTask('mockReinstate_inventory', function (mockName) {

		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:reinstate#inventory_inventory:' + mockName);
	});

	// ********** success **********
	grunt.registerTask('mockReinstate_success', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:reinstate#success_success:' + mockName);
	});

	// ********** success with AUDIS AND ADDACS**********
	grunt.registerTask('mockReinstate_success_audis', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:reinstate#success_successAudisAndAdd:' + mockName);
	});

};