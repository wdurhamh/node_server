angular.module('fishApp').controller('tripModalController', ['$scope','$http','$uibModalInstance', 'CONST', function($scope,$http,$uibModalInstance, CONST){
	$scope.formdata = {};
	
  	$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
		$scope.formdata = {};
  	};

	$scope.createTrip = function(){	
		if($scope.formdata.name){
			console.log('Sending trip');
                	$http.post(CONST.BASEURL + '/trip', $scope.formdata)
                	.success(function(data){
				console.log(data);
                        	$scope.formdata = {};
    				$uibModalInstance.close(data);
                	})
                	.error(function(){
                        	console.log('Error');
                	});
		}
		else{
			$scope.error_message = 'Name is required';
		}
	}
	
}]);
