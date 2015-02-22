'use strict';

angular.module('app.user', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider.when('/user/', {
    templateUrl: 'user/user.html',
    controller: 'UserController'
  });
}])

// get the currently logged in user via the /me method
.factory('User', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me', {}, {
			query: {
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					site: 'stackoverflow'
				},
				isArray:false,
				// stackoverflow returns objects in an "items" array
				// with the "me" method, we only need the first item in the response
				transformResponse: function(data){
					if(JSON.parse(data).items){
						return JSON.parse(data).items[0];
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

// get the timeline of the currently logged in user
.factory('Timeline', ['$resource', '$rootScope',
	function($resource, $rootScope){
		return $resource('https://api.stackexchange.com/2.2/me/timeline', {}, {
			query: {
				method:'GET',
				params:{
					access_token: $rootScope.access_token,
					key: '6S9zu7acV8JdHBn473Q6yw((',
					site: 'stackoverflow'
				},
				isArray:true,
				transformResponse: function(data){
					if(JSON.parse(data).items){
						return JSON.parse(data).items;
					} else {
						return JSON.parse(data);
					}
				}
			}
		});
	}
])

.controller('UserController', ['User', 'Timeline', '$scope', '$routeParams', '$rootScope', '$http', '$location',
	function(User, Timeline, $scope, $routeParams, $rootScope, $http, $location) {

	// clear the hash from the oath
	$location.hash('');

	$scope.model = User.query();
	$scope.timeline = Timeline.query();

}]);