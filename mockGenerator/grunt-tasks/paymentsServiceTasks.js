
// **************  PAYMENT SERVICE **************

module.exports = function (grunt) {

	// ********** Balance **********
	grunt.registerTask('create_paymentsService_balance_Prioritized', function () {
		var mockName = 'balancePrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#balance_balancePrioritized:' + mockName);
	});

	// ********** Inventory **********
	grunt.registerTask('create_paymentsService_inventory_Prioritized', function () {
		var mockName = 'inventoryPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#inventory_inventoryPrioritized:' + mockName);
	});

	grunt.registerTask('mockInventory', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#inventory_inventoryWithoutReinstate:' + mockName);
	});

	grunt.registerTask('mockInventoryReinstate', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#inventory_inventorySystemCancellation:' + mockName);
	});


	// ********** paymentMethods **********
	// ****** currentPaymentMethod
	grunt.registerTask('create_paymentsService_currentPaymentMethod_Prioritized', function () {
		var mockName = 'currentPaymentMethodPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#paymentMethods_paymentMethodPrioritized:' + mockName);
	});

	// ****** previousPaymentMethods
	grunt.registerTask('create_paymentsService_previousPaymentMethods_Prioritized', function () {
		var mockName = 'previousPaymentMethodsPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#paymentMethods_previousPaymentMethodsPrioritized:' + mockName);
	});

	// ********** END paymentMethods **********
};