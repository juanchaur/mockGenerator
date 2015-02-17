
// **************  ACCOUNTS SERVICE  **************

module.exports = function (grunt) {
	/**
	 * Creates the accountsService for a given customer
	 * @command grunt mockAccountService:mockName --currency=EUR (default is GBP)
	 */
	grunt.registerTask('mockAccountService', function (mockName) {

		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:accountsService#accounts_accounts:' + mockName);
	});


	grunt.registerTask('accountsService_Prioritized', function (mockName, currency) {
		grunt.task.run( 'setEnvironment' );

		utils.mockOptions.info.currency = currency;
		grunt.task.run('mockService:accountsService#accounts_accountsPrioritized:' + mockName);
	});

	grunt.registerTask('create_AccountsService_Prioritized', function () {
		var mockName = 'accountsPrioritized';


		grunt.task.run([
			'accountsService_Prioritized:' + mockName + ':GBP',
			'accountsService_Prioritized:' + mockName +'_ROI' + ':EUR'
		]);
		// grunt.task.run('accountsService_Prioritized:' + mockName + ':EUR');
	});

};