(function () {
  'use strict';
	var app = angular.module('MyApp');

	app.controller('mockGeneratorController', function ($scope, $timeout, $modal, $log, $http) {
		// http://nodejs.org/api.html#_child_processes
		// var sys = require('sys')
		var exec = require('child_process').exec,
			myCmd = 'grunt '
		;

		$scope.commandSelected = null;
		$scope.mockName;
		$scope.writtenCommand;
		$scope.finalCommand;

		$scope.commandList = [
			{
				name: 'mock Basic Information',
				command: 'mockBasicInfo'
			},
			{
				name: 'mock Customer Service',
				command: 'mockCustomerService'
			},
			{
				name: 'mock Basic Data',
				command: 'mockBasicData'
			},
			{
				name: 'mock Account Service',
				command: 'mockAccountService'
			},
			{
				name: 'mock Inventory NO Reinstate  @Payments Service',
				command: 'mockInventory'
			},
			{
				name: 'mock Inventory with Reinstate  @Payments Service',
				command: 'mockInventoryReinstate'
			},
			{
				name: 'mock User with Reinstate Success',
				command: 'mockReinstateSuccess'
			},
			{
				name: 'mock User with Reinstate Success with AUDIS & ADDACS',
				command: 'mockReinstateSuccess_withAudis'
			},
			{
				name: 'mock Reinstate Inventory',
				command: 'mockReinstate_inventory'
			},
			{
				name: 'mock Reinstate Success Answer',
				command: 'mockReinstate_success'
			},
			{
				name: 'mock Reinstate Success Answer with AUDIS & ADDACS',
				command: 'mockReinstate_success_audis'
			},
			{
				name: 'mock Customer with Reinstate',
				command: 'mockCustomerReinstateSuccess'
			},
			{
				name: 'mock Customer with Reinstate with AUDIS & ADDACS',
				command: 'mockCustomerReinstateSuccess_withAudis'
			},
			{
				name: 'Create Prioritized Mocks',
				command: 'create_prioritized_mocks'
			},
		];

		$scope.$watch('commandSelected', function() {
			if (!!$scope.commandSelected) {
				if (!!$scope.mockName) {
					$scope.finalCommand = 'grunt ' + $scope.commandSelected +  ':' + $scope.mockName;
				} else {
					$scope.finalCommand = 'grunt ' + $scope.commandSelected
				}
			}
		});

		$scope.$watch('mockName', function() {
			if (!!$scope.mockName) {
				if (!!$scope.commandSelected) {
					$scope.finalCommand = 'grunt ' + $scope.commandSelected +  ':' + $scope.mockName;
				} else if(!!$scope.writtenCommand) {
					$scope.finalCommand = 'grunt ' + $scope.writtenCommand + ':' + $scope.mockName;
				} else {
					$scope.finalCommand = ':' + $scope.mockName;
				}
			}
		});

		$scope.$watch('writtenCommand', function() {
			if (!!$scope.writtenCommand) {
				if (!!$scope.mockName) {
					$scope.finalCommand = 'grunt ' + $scope.writtenCommand + ':' + $scope.mockName;
				} else {
					$scope.finalCommand = 'grunt ' + $scope.writtenCommand + ':'
				}
			}
		});

		$scope.runCommand = function() {
			// myCmd += 'mockme:customerService#customerService_success:mock_fromUI';
			if (!!$scope.isROICustomer) {
				$scope.finalCommand += ' --currency=EUR';
			}
			if (!!$scope.finalCommand) {

				$scope.commandResult = {
					msg: '',
					typeOfMsg: ''
				};
				// console.log('Command to run: ', $scope.finalCommand);

				$scope.child = exec($scope.finalCommand,  function (error, stdout, stderr) {
					if (error !== null) {
						// console.error('exec error: ' + error);
						$scope.commandResult.msg = stdout + ' - ' + error.message;
						$scope.commandResult.typeOfMsg = 'danger';
					} else {
						$scope.commandResult.msg = 'Mock generated successfully';
						$scope.commandResult.typeOfMsg = 'success';
						// console.log('stdout: ', stdout);
					}
				});
			}

			$scope.child.on('close', function () {
				// console.log('\n\n');
				// console.log('----------------------------');
				// console.log('Closing child');
				// console.log('msg', $scope.msg);
				// console.log('typeOfMsg', $scope.typeOfMsg);
				$scope.$apply(function () {
					$scope.addMessage($scope.commandResult.msg, $scope.commandResult.typeOfMsg);
				});
			});
		};

		$scope.alerts = [];

		$scope.addMessage = function(msg, type) {
			var type = type || 'info',
				alertNewLength
			;

			$scope.open('lg');

			// alertNewLength = $scope.alerts.push({
			// 	type: type,
			// 	msg: msg
			// });

			// $timeout( function() {
			// 	$scope.closeAlert(alertNewLength - 1);
			// }, 3000);


		};

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		/**
		 * Modals
		 */

		$scope.open = function (size, isInfo) {
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				modalFade: true,
				templateUrl: 'js/mockGenerator/modalInstance.html',
				controller: 'modalInstanceController',
				size: size,
				resolve: {
					optionsModal: function () {
						var optionsModal = {};

						if(!!isInfo) {
							optionsModal.typeOfModal = 'info';
						} else {
							optionsModal.typeOfModal = $scope.commandResult.typeOfMsg;
							optionsModal.consoleMsg = $scope.commandResult.msg;
						}
						return optionsModal;
					},

				}
			});

			modalInstance.result.then(
				function () {

				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				})
			;
		};

	});
})();
