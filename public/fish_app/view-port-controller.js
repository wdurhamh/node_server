angular.module('fishApp').controller('viewController', ['$scope', '$http', 'CONST', function($scope,$http, CONST){
	$http.get(CONST.BASEURL+'/fish')
	.success(function(data){
		$scope.fishes = data;
		//need to sort, need to make cool sorting functions	
	})
	.error(function(){
		console.log('unable to retreive fish');
	});
}]);
