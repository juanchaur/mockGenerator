
'use strict'

module.exports = function(grunt) {

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
				src: ['templates/__files/**/*'],
				dest: '.tmp/folderlist.json'
			}

		},

		clean: {
			folderList: [
				'.tmp'
			]
		},

		// copy: {
		// 	main: {
		// 		files: [
		// 			{expand: true, src: ['templates/mappings/**/{proxy}*.json', 'templates/mappings/globals/**/*'], dest: 'wireMock/mappings', filter: 'isFile'}
		// 		]
		// 	}
		// },
		nodewebkit: {
			options: {
				platforms: ['linux64'], //['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'
				buildDir: 'out/', // Where the build version of my node-webkit app is saved
				cacheDir: 'out/',
				buildType: 'timestamped'
			},
			src: ['/home/dev/workspaces/workspace-kepler/cbs-payments-web-parent/cbs-payments-web-qa-test/src/test/resources/mockGenerator/**/*'] // Your node-webkit app
		},

		/**
		 * Generate task in order to create the mocks
		 */
		generate: {
			options: {
				src: 'templates',
				dest: utils.paths.targetFolder,
				//dest: '../wireMock',
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
	grunt.loadNpmTasks('grunt-node-webkit-builder');
	// grunt.loadNpmTasks('grunt-contrib-copy');


	grunt.registerTask('cleanFolderList', [
		'clean:folderList'
	]);

	grunt.registerTask('appBuild', [
		'nodewebkit'
	]);

	// grunt.registerTask('myCopy', [
	// 	'copy:main'
	// ]);
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
							.replace('templates/' + utils.paths.files + '/', '')
				;
				// rootDir = (folderJSON[i].location.replace('.json', '')).replace('templates/_files/', '');
				dir = rootDir.replace('/' + fileName, '');

				_files = utils.paths.files + '/' + dir; //'_files/' + dir;
				mappings = utils.paths.mappings + '/' + dir;//'mappings/' + dir;

				//adding the mappers
				commands = dir.split('/');

				utils.generatorMapper[ _files ] = _files;
				utils.generatorMapper[ mappings ] = mappings;

				if(commands.length === 1 ){
					if ( utils.mockCommands.hasOwnProperty(commands[0]) ) {
						utils.mockCommands[commands[0]][fileName.replace('_template', '')] = {
							_files: generatorFiles + rootDir + ':',		//'generate:_files/' + rootDir + ':',
							mappings: generatorMappings  + rootDir + ':'//'generate:mappings/' + rootDir + ':'
						};
					} else {
						utils.mockCommands[commands[0]] = {};
						utils.mockCommands[commands[0]][fileName.replace('_template', '')] = {
							_files: generatorFiles + rootDir + ':',		//'generate:_files/' + rootDir + ':',
							mappings: generatorMappings  + rootDir + ':'//'generate:mappings/' + rootDir + ':'
						};
					}
				} else {
					if ( utils.mockCommands.hasOwnProperty(commands[0]) ) {
						utils.mockCommands[commands[0]][commands[1] + '_' +fileName.replace('_template', '')] = {
							_files: generatorFiles + rootDir + ':',		//'generate:_files/' + rootDir + ':',
							mappings: generatorMappings  + rootDir + ':'//'generate:mappings/' + rootDir + ':'
						};
					} else {
						utils.mockCommands[commands[0]] = {};
						utils.mockCommands[commands[0]][commands[1] + '_' +fileName.replace('_template', '')] = {
							_files: generatorFiles + rootDir + ':',		//'generate:_files/' + rootDir + ':',
							mappings: generatorMappings  + rootDir + ':'//'generate:mappings/' + rootDir + ':'
						};
					}
				}

			}

		}

		// grunt.log.writeln( '[OK] Parser done');
		// console.log(folderJSON);
		// console.log('------');
		// console.log(utils.generatorMapper);
		// console.log('------');
		//console.log(utils.mockCommands);
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

		//console.log(utils.mockCommands);

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
			// serviceName = service;
			// if ( !utils.mockCommands.hasOwnProperty(serviceName)) {
				grunt.fail.fatal( 'Service not defined in templates', [3] );

			// }
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
		//info for mocks
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
		grunt.task.run('mockService:paymentService#paymentMethods_paymentMethodPrioritized:' + mockName);
	});

	// ****** previousPaymentMethods
	grunt.registerTask('create_paymentsService_previousPaymentMethods_Prioritized', function () {
		var mockName = 'previousPaymentMethodsPrioritized';

		grunt.task.run( 'setEnvironment' );
		grunt.task.run('mockService:paymentService#paymentMethods_previousPaymentMethodsPrioritized:' + mockName);
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


};//End Gruntfile.js
