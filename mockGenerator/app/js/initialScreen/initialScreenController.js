(function () {
  'use strict';
	var app = angular.module('MyApp');

	app.controller('initialScreenController', ['$scope', '$location', function($scope, $location) {
		$scope.items = [
			{
				path: '/templateCreator',
				title: 'Create Templates'
			},
			{
				path: '/mockGenerator',
				title: 'Generate Mock'
			}
		];

		$scope.isActive = function (item) {
			if (item.path === $location.path()) {
				return true;
			}
			return false;
		};

	}]);

})();





