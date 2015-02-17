


//
module.exports = function (grunt) {

	// **************  BILLS BACKEND SERVICE  **************
	grunt.registerTask('create_billsBackendService_Prioritized', function () {
		var mockName = 'BillPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run([
			'mockService:billsBackendServices#currentPrioritized:current' + mockName,
			'mockService:billsBackendServices#futurePrioritized:future' + mockName,
			'mockService:billsBackendServices#nextPrioritized:next' + mockName,
			'mockService:billsBackendServices#noCurrentPrioritized:noCurrent' + mockName,
			'mockService:billsBackendServices#noFuturePrioritized:noFuture' + mockName,
			'mockService:billsBackendServices#noNextPrioritized:noNext' + mockName
		]);
	});

	// **************  FINANCIAL HISTORY  **************
	grunt.registerTask('create_financialHistory_Prioritized', function () {
		var mockName = 'financialHistoryPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:financialHistory#financialHistoryPrioritized:' + mockName);
	});

	// **************  PAYMENT METHOD HISTORY  **************
	grunt.registerTask('create_paymentMethodHistory_Prioritized', function () {
		var mockName = 'paymentMethodHistoryPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentMethodHistory#paymentMethodHistorySuccessPrioritized:' + mockName);
	});


};