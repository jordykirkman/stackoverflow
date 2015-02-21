'use strict';

angular.module('myApp.question', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/question/:question_id', {
    templateUrl: 'question/question.html',
    controller: 'QuestionController'
  });
}])

.controller('QuestionController', ['$scope', '$routeParams', '$rootScope', '$http', '$sce', function($scope, $routeParams, $rootScope, $http, $sce) {

	// fetch the the current user and set it as the model
	$http({
		url: 'https://api.stackexchange.com/2.2/questions/' + $routeParams.question_id,
		method: "GET",
		params: {
			access_token: $rootScope.access_token,
			key: '6S9zu7acV8JdHBn473Q6yw((',
			filter: "!FnCncR1q_)Ax*SjT0)pznvQ.H6",
			site: 'stackoverflow'
		}
	}).success(function(data, status, headers, config) {
		// convert the body strings to html
		data.items[0].body = $sce.trustAsHtml(data.items[0].body);
		data.items[0].answers.forEach(function(answer){
			answer.body = $sce.trustAsHtml(answer.body);
		});
		$scope.model = data.items[0];
	}).error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log('error ' + data.error_message);
		$scope.error = data;
	});

}]);