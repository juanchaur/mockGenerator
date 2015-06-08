
'use strict'

module.exports = function(grunt) {

	var qaResources = 'TO-BE-CHANGE';

	//Variables needed for the generators
	var	utils = utils || {};

	utils.generatorMapper = {};
	utils.mockCommands = {};

	utils.paths = {
		targetFolder: qaResources + 'wireMock', //'../wireMock',
		templatesFolder: qaResources + 'templates',
		files: '__files',
		mappings: 'mappings'
	};


	utils.fixMappingsRoute = function (baseRoute) {
		var toBeRepalce = utils.paths.targetFolder + '/'+ utils.paths.mappings + '/';
		return baseRoute.replace(toBeRepalce, '');
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


	//Template options
	grunt.template.addDelimiters('config', '{{', '}}');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		utils: utils,

		folder_list: {
			options: {
				files: true,
				folders: false
			},
			files: {
				src: [ utils.paths.templatesFolder + '/__files/**/*'],//['templates/__files/**/*'],
				dest: '.tmp/folderlist.json'
			}

		},

		clean: {
			folderList: [
				'.tmp'
			]
		},

		// nodewebkit: {
		// 	options: {
		// 		platforms: ['linux64'], //['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'
		// 		buildDir: 'out/', // Where the build version of my node-webkit app is saved
		// 		cacheDir: 'out/',
		// 		buildType: 'timestamped'
		// 	},
		// 	src: [''] // Your node-webkit app
		// },

		/**
		 * Generate task in order to create the mocks
		 */
		generate: {
			options: {
				src: utils.paths.templatesFolder, //'templates',
				dest: utils.paths.targetFolder,
				map: utils.generatorMapper,
				prompt: false
			}
		}
	});


	//**********************************************************************************************
	//									TASKS
	//**********************************************************************************************

	//Loading tasks
	grunt.loadNpmTasks('grunt-generate');
	grunt.loadNpmTasks('grunt-folder-list');
	grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-node-webkit-builder');


	grunt.registerTask('cleanFolderList', [
		'clean:folderList'
	]);

	grunt.registerTask('appBuild', [
		'nodewebkit'
	]);


	/**
	 * Parse the folders and gets the info needed for the generatos
	 */
	grunt.registerTask('parseFolder', 'Parsing the generated folder list!', function () {
		var folderJSON = grunt.file.readJSON('.tmp/folderlist.json');

		var generatorFiles = 'generate:' + utils.paths.files + '/',
			generatorMappings = 'generate:' + utils.paths.mappings + '/'
		;

		for (var i = 0, total = folderJSON.length; i < total; i++) {
			var rootDir,
				dir,
				fileName,
				_files,
				mappings,
				commands
			;

			if (folderJSON[i].filename.indexOf('template') !== -1) {

				fileName = folderJSON[i].filename.replace('.json', '');
				rootDir = (folderJSON[i].location.replace('.json', ''))
						.replace(utils.paths.templatesFolder + '/' + utils.paths.files + '/', '')
				;

				dir = rootDir.replace('/' + fileName, '');

				_files = utils.paths.files + '/' + dir;
				mappings = utils.paths.mappings + '/' + dir;

				//adding the mappers
				commands = dir.split('/');

				var command = commands.shift(),
					templateName = (commands.length > 0 ? commands.join('_') + '_' : '') + fileName.replace('_template', '')
				;

				utils.generatorMapper[ _files ] = _files;
				utils.generatorMapper[ mappings ] = mappings;

				if(!!command){
					if ( !utils.mockCommands.hasOwnProperty(command) ) {
						utils.mockCommands[command] = {};
					}

					utils.mockCommands[command][templateName] = {
						_files: generatorFiles + rootDir + ':',
						mappings: generatorMappings  + rootDir + ':'
					};
				} else {

					throw new Error('Not command found in "' + dir + '"');

				}

			}
		}
		// console.log(utils.mockCommands);
	});

	grunt.registerTask('setEnvironment', 'Parse the folders and sets the variables we need', function () {
		grunt.task.run('folder_list');
		grunt.task.run('parseFolder');
		grunt.task.run('clean:folderList');
	});


	grunt.registerTask('mockService', function (service, fileName) {
		var serviceName,
			innerService
		;

		if( !service || !fileName ) {
			grunt.fail.fatal('you need to pass the service name and file name as arguments:\ne.g: mockme:serviceName:fileName', [3]);
		}

		if(service.indexOf('#') !== -1) {
			serviceName = service.split('#')[0];
			innerService = service.split('#')[1];
			if ( !utils.mockCommands.hasOwnProperty(serviceName)
				|| !utils.mockCommands[serviceName].hasOwnProperty(innerService)) {
				grunt.fail.fatal( 'Service or innver Service not defined in templates', [3] );
			}
		} else {
			grunt.fail.fatal( 'Service not defined in templates', [3] );
		}


		var serviceMock = utils.getMockCommand(serviceName, innerService, fileName);

		if (utils.isLogEnable) {
			grunt.log.writeln( '\nGenerating ' + serviceName );
			grunt.log.writeln( '\tMock name: ->\t' + fileName );
			grunt.log.writeln( '\tCommand _file ->\t' + serviceMock.file );
			grunt.log.writeln( '\tCommand mappings ->\t' + serviceMock.map );
		}

		grunt.task.run( serviceMock.file );
		grunt.task.run( serviceMock.map );
	});

	/**
	 * Creates the service mocks: the _file and the mapping
	 * @command grunt mockme:serviceName#customerService2:fileName
	 * @command with logs mockme:serviceName#customerService2:fileName --logme=true
	 * @command  mockme:serviceName#customerService2:fileName --currency=
	 */

	grunt.registerTask('mockme', function (serviceName, fileName) {
		utils.isLogEnable = grunt.option('logme') || false;
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';


		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:'+ serviceName + ':' + fileName);
	});

	//**********************************************************************************************
	//									PREDIFINED TASKS
	//**********************************************************************************************

	// **************  CUSTOMER SERVICE  **************
	grunt.registerTask('mockCustomerService', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:customerService#customerInformation_customerService:' + mockName);
	});


	// **************  BASIC DATA  **************
	grunt.registerTask('mockBasicData', function (mockName) {
		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:basicData#basicData:' + mockName);
	});




	// **************  ACCOUNTS SERVICE  **************
	/**
	 * Creates the accountsService for a given customer
	 * @command grunt mockAccountService:mockName --currency=EUR (default is GBP)
	 */
	grunt.registerTask('mockAccountService', function (mockName) {

		utils.mockOptions.info.currency = !!grunt.option('currency') ? grunt.option('currency') : 'GBP';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:accountsService#accounts_accounts:' + mockName);
	});

	grunt.registerTask('mockUpdateAccountBillPreferences', function (mockName) {
		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:accountsService#updateAccountBillPreferences_update:' + mockName);
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

	// **************  PAYMENT SERVICE **************
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
		grunt.task.run('mockService:paymentService#paymentMethods_currentPaymentMethod_paymentMethodPrioritized:' + mockName);
	});

	// ****** previousPaymentMethods
	grunt.registerTask('create_paymentsService_previousPaymentMethods_Prioritized', function () {
		var mockName = 'previousPaymentMethodsPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#paymentMethods_previousPaymentMethods_previousPaymentMethodsPrioritized:' + mockName);
	});

	// **************  REINSTATE **************
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


	//**********************************************************************************************
	//									MULTI MOCKS TASKS
	//**********************************************************************************************

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

	grunt.registerTask('mockRestrictedScenarios', function (mockName) {
		utils.isLogEnable = grunt.option('logme') || false;

		grunt.task.run([
			'setEnvironment:',
			'mockCustomerService:' + mockName,
			'mockBasicData:' + mockName,

			'mockService:restricted#GET_ToBeSet_paymentInventory_initial_initial:' + mockName,
			'mockService:restricted#GET_ToBeSet_paymentInventory_afterPost_afterPost:' + mockName,
			'mockService:restricted#GET_ToBeSet_paymentRestricted_initial_initial:' + mockName,
			'mockService:restricted#GET_ToBeSet_paymentRestricted_afterPost_afterPost:' + mockName,

			'mockService:restricted#POST_post:' + mockName,

		]);
	});


};//End Gruntfile.js
