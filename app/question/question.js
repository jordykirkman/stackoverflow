'use strict';

angular.module('app.question', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/question/:question_id', {
    templateUrl: 'question/question.html',
    controller: 'QuestionController'
  });
}])

// get a question by id. the method returns a list, but since we will only submit one, we just want the first back
.factory('Question', ['$resource', '$rootScope', '$sce',
	function($resource, $rootScope, $sce){
		return $resource('https://api.stackexchange.com/2.2/questions/:question_id', {}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: "!7nKVHb)f*..yPcnXlQ8UL(pqZL)4vOU-Sf",
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
						if(question.answers){
							question.answers.forEach(function(answer){
								answer.body = $sce.trustAsHtml(answer.body);
							});
						}
						if(question.comments){
							question.comments.forEach(function(comment){
								comment.body = $sce.trustAsHtml(comment.body);
							});
						}
						return question;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

.controller('QuestionController', ['Question', '$scope', '$routeParams', '$rootScope', '$http', '$q', function(Question, $scope, $routeParams, $rootScope, $http, $q) {

	$scope.model = Question.query({question_id: $routeParams.question_id});

}]);