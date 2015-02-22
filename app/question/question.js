'use strict';

angular.module('app.question', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/question/:question_id', {
    templateUrl: 'question/question.html',
    controller: 'QuestionController'
  });
}])

// get a question by id. the method returns a list, but since we will only submit one, we just want the first back
.factory('Question', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/questions/' + $routeParams.question_id, {}, {
			query: {
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: "!tRhd)msKfDI_kdNs2zdw2HVvoAIWUBj",
					site: 'stackoverflow'
				},
				isArray:false,
				// stackoverflow returns objects in an "items" array
				// with the "me" method, we only need the first item in the response
				transformResponse: function(data){
					if(JSON.parse(data).items){
						var question = JSON.parse(data).items[0];
						// we need angular to allow these strings to be read as html
						question.body = $sce.trustAsHtml(question.body);
						question.answers.forEach(function(answer){
							answer.body = $sce.trustAsHtml(answer.body);
						});
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

.controller('QuestionController', ['Question', '$scope', '$routeParams', '$rootScope', '$http', '$sce', function(Question, $scope, $routeParams, $rootScope, $http, $sce) {

	// fetch the the current user and set it as the model
	$scope.model = Question.query();

}]);