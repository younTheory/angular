var tweb = angular.module('tweb', ['ngRoute', 'chart.js']);

tweb.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'res/partials/main.html',
                    controller: 'main'
                }).
                when('/Admin', {
                    templateUrl: 'res/partials/Admin.html',
                    controller: 'login'
                }).
				when('/polls', {
                    templateUrl: 'res/partials/polls.html',
                    controller: 'polls'
                }).
				when('/join', {
                    templateUrl: 'res/partials/join.html',
                    controller: 'join'
                }).
                otherwise({
                    redirectTo: '/login'
                });
        }]);

tweb.controller('main', function($scope) {
	$scope.message = 'Page: main';
	$scope.labels = ["yoooo", "nooooo", "fuuuuu"];
	$scope.data = [0,0,0];
	
	var mysocketIO = io.connect();
	mysocketIO.on("currentVote", function(answers){
		console.log(answers);
		var data = [];
		var labels = [];
		for (var i = 0; i < answers.length; i++){
			var currentElement = answers[i];
			labels.push(currentElement.option);
			data.push(currentElement.value);
		}
		console.log(labels);
		$scope.labels = labels;
		$scope.data = data;
		
		$scope.$apply();
		
	});
	
	$scope.reset = function(){
		
		mysocketIO.emit("reset");
	};
	
	$scope.answer = function(index){
		mysocketIO.emit("answer", index);
	};
	
	$scope.getResult = function(){
		mysocketIO.emit("getResult");
	};
	
});

tweb.controller('login', function($scope) {
	$scope.message = 'Page: login';
});

tweb.controller('polls', function($scope) {
	$scope.message = 'Page: polls';
});

tweb.controller('join', function($scope) {
	$scope.message = 'Page: join';
});
