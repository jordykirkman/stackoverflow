'use strict';

angular.module('app.question', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/question/:question_id', {
    templateUrl: 'scripts/question/question.html',
    controller: 'QuestionController'
  });
}])

// get a question by id. the method returns a list, but since we will only submit one, we just want the first back
.factory('Question', ['$resource', '$rootScope', '$sce', '$http',
	function($resource, $rootScope, $sce, $http){
		return $resource('https://api.stackexchange.com/2.2/questions/:question_id', {question_id: '@question_id', undo: '@undo'}, {
			query: {
				cache: true,
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					filter: "!*da(x.F_qTZ.tR-BMlqkdVklQpJvnP8*ftjUY",
					site: 'stackoverflow'
				},
				isArray:false,
				// stackoverflow returns objects in an "items" array
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
			},
		});
	}
])

.controller('QuestionController', ['Question', '$scope', '$routeParams', '$rootScope', '$http', '$timeout', function(Question, $scope, $routeParams, $rootScope, $http, $timeout) {

	$scope.model = Question.query({question_id: $routeParams.question_id});

	// undo param toggles the endpoint to have "undo" at the end,
	//this is how stackoverflow undoes simple actions
	$scope.favorite = function(undo){
		undo = undo === true ? '/undo' : '';
		// Angular really doesnt seem to like some of the non-standard quirks of the stackoverflow api
		// to favorite a question, it requires params to be passed as form data in place of any real data
		// using $http here because $resource norms dont work with the api
		$http({
		    url: 'https://api.stackexchange.com/2.2/questions/' + $routeParams.question_id + '/favorite' + undo,
		    data: $.param({
				access_token: $rootScope.access_token,
				key: '6S9zu7acV8JdHBn473Q6yw((',
				filter: '!9YdnS9*GS',
				site: 'stackoverflow'
			}),
			method:'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(data){
			if(data.items){
				$scope.model.favorited = data.items[0].favorited;
				$rootScope.alert = { 
					title: data.items[0].favorited ? "Question favorited" : "Question un-favorated",
					text: "It will take a few minutes before showing up on the dashboard.",
					type: "success",
				};
			} else {
				$rootScope.alert = { 
					title: "Problem",
					text: "I wasnt able to favorite your question. Try again later.",
					type: "error",
				};
			}

			$timeout(function(){
				$rootScope.alert = null;
			}, 10000);
		});
	}


}]);