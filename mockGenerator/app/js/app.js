var app = angular.module('MyApp', ['ngRoute', 'ui.codemirror', 'ui.bootstrap']);

(function () {
	'use strict';

	app.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'js/initialScreen/initialScreen.html',
				controller: 'initialScreenController'
			})
			.when('/templateCreator', {
				templateUrl: 'js/templateCreator/templateCreator.html',
				controller: 'templateCreatorController'
			})
			.when('/mockGenerator', {
				templateUrl: 'js/mockGenerator/mockGenerator.html',
				controller: 'mockGeneratorController'
			})
			.otherwise({
				// redirectTo: '/templateCreator'
				// redirectTo: '/mockGenerator'
				redirectTo: '/'
			});
	});

	app.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
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
