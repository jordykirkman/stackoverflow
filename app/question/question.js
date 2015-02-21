'use strict';

angular.module('myApp.question', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/question/:question_id', {
    templateUrl: 'question/question.html',
    controller: 'QuestionController'
  });
}])

.controller('QuestionController', ['$scope', '$routeParams', '$rootScope', '$http', function($scope, $routeParams, $rootScope, $http) {

	// fetch the the current user and set it as the model
	$http({
		url: 'https://api.stackexchange.com/2.2/questions/' + $routeParams.question_id,
		method: "GET",
		params: {
			access_token: $rootScope.access_token,
			key: '6S9zu7acV8JdHBn473Q6yw((',
			site: 'stackoverflow'
		}
	}).success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		$scope.model = data.items[0];
	}).error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log('error ' + data.error_message);
		$scope.error = data;
	});

}]);