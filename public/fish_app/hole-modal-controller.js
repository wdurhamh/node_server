angular.module('fishApp').controller('holeModalController', ['$scope', '$http', '$uibModalInstance','holes','bow','CONST', function($scope, $http, $uibModalInstance, holes, bow, CONST){
	$scope.formdata = {};
	$scope.formdata.bow = bow;
  	$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
		$scope.formdata = {};
  	};

	$scope.displayPlaceName = function(marker){	
		$scope.formdata.name = marker.title;
		$scope.formdata.lnglt = marker.position;
	};

	$scope.clearLnglt = function(){
		delete $scope.formdata.lnglt;
	};

	$scope.loadMap = function(){
		console.log("initializing map");
      		$scope.map = new google.maps.Map(document.getElementById('hole-map'), {
          		center: holes[0].lnglt,
          		zoom: 10
        	});
		$scope.clickedMarker;
		$scope.map.addListener('click', function(e){
			$scope.$apply(function(){
			//display a new proposed marker
				if($scope.clickedMarker){
					$scope.clickedMarker.setMap(null);
				}
				var name = "Unlabeled";
                        	if($scope.formdata.name){
                        		name = $scope.formdata.name;
                 		}
				$scope.clickedMarker = new google.maps.Marker({
    					position: e.latLng,
    					map: $scope.map,
					title:name
  				});
				$scope.$apply($scope.displayPlaceName($scope.clickedMarker));
			});
		});

		//place markers of existing Holes
          	holes.forEach(function(hole) {
			//create a marker for each new place
			var marker = new google.maps.Marker({
              			map: $scope.map,
              			title: hole.name,
              			position: hole.lnglt
            		});
		});
	};	
		
	$scope.createHole = function(){
		if($scope.formdata.name){
                	$http.post(CONST.BASEURL + '/hole', $scope.formdata)
                	.success(function(data){
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
        };
}]);
