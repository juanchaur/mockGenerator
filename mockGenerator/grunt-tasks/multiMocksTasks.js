
//**********************************************************************************************
//									MULTI MOCKS TASKS
//**********************************************************************************************


module.exports = function (grunt) {
	/**
	 * Creates the prioritized mocks
	 * @command grunt create_prioritized_mocks
	 */
	grunt.registerTask('create_prioritized_mocks', function () {

		grunt.task.run( 'setEnvironment' );

		grunt.task.run([
			'create_AccountsService_Prioritized',
			'create_billsBackendService_Prioritized',
			'create_financialHistory_Prioritized',
			'create_paymentMethodHistory_Prioritized',
			'create_paymentsService_balance_Prioritized',
			'create_paymentsService_inventory_Prioritized',
			'create_paymentsService_currentPaymentMethod_Prioritized',
			'create_paymentsService_previousPaymentMethods_Prioritized'
		]);
	});

	/**
	 * Creates the customerService & basicData for a given customer
	 * @command grunt mockBasicInfo:mock_userJuan (--currency=EUR)
	 */
	grunt.registerTask('mockBasicInfo', function (mockName) {
		utils.isLogEnable = grunt.option('logme') || false;
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run([
			'setEnvironment:',
			'mockCustomerService:' + mockName,
			'mockBasicData:' + mockName
		]);
	});

	grunt.registerTask('mockCustomerReinstateSuccess', function (mockName) {
		utils.isLogEnable = grunt.option('logme') || false;
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run([
			'setEnvironment:',
			'mockCustomerService:' + mockName,
			'mockAccountService:' + mockName,
			'mockBasicData:' + mockName,
			'mockInventoryReinstate:' + mockName,
			'mockReinstate_inventory:' + mockName,
			'mockReinstate_success:' + mockName
			//'mockInventory:' + mockName
		]);
	});

	grunt.registerTask('mockCustomerReinstateSuccess_withAudis', function (mockName) {
		utils.isLogEnable = grunt.option('logme') || false;
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run([
			'setEnvironment:',
			'mockCustomerService:' + mockName,
			'mockAccountService:' + mockName,
			'mockBasicData:' + mockName,
			'mockInventoryReinstate:' + mockName,
			'mockReinstate_inventory:' + mockName,
			'mockReinstate_success_audis:' + mockName,
			//'mockInventory:' + mockName
		]);
	});


};