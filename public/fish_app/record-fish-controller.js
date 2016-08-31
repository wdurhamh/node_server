angular.module('fishApp').controller('recordFishController', ['$scope','$http','$uibModal','Upload','CONST',function($scope, $http, $uibModal, Upload, CONST){
	//initialize variables
	$scope.formdata = {};
	$http.get(CONST.BASEURL+'/loc')
	.success(function(data){
		$scope.bows=data;
		$scope.formdata.bow = data[0]._id;
		$scope.getHoles();
	})
	.error(function(){
		console.log('Unable to retrieve bodies of water');
	});

	$http.get(CONST.BASEURL+'/trip')
	.success(function(data){
		$scope.trips = data;
		console.log($scope.trips);
	})
	.error(function(){
		console.log('Unable to retrieve bodies of water');
	});

	

	$scope.sendFish = function(){
		$http.post(CONST.BASEURL + '/fish', $scope.formdata)
		.success(function(data){
			$scope.formdata = {};
		})
		.error(function(){
			console.log('Error');
		});
	};

	$scope.createFish = function(){
		var files = $scope.files; 
		$scope.formdata.images = [];
		if (files && files.length) {
			var successes = 0;
        		for (var i = 0; i < files.length; i++) {
          			Upload.upload({
            				url: CONST.BASEURL+'/images',
            				data: {file: files[i]}
        			}).then(function (resp) {
            				console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
					$scope.formdata.images.push(CONST.PICUPLOADPATH + resp.config.data.file.name);
					successes +=1;
					if (successes==files.length){
						$scope.sendFish();
					}	
        			}, function (resp) {
			        	console.log('Error status: ' + resp.status);
        			}, function (evt) {
            				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            				console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        			});
        		}
		}
		else{
			$scope.sendFish();
		}
	};
	
	$scope.getHoles = function(){
		if($scope.formdata.bow){
			$http.get(CONST.BASEURL+'/loc/'+$scope.formdata.bow+'/holes', {id:$scope.formdata.bow})
			.success(function(data){
				console.log(data);
				$scope.holes = data;
				$scope.formdata.hole = data[0]._id;
			})
			.error(function(){
				console.log('Eror');
			});
		}
	};

	$scope.loadTrip = function(){
		console.log("Loading trip. uh hu, yeah I'm sure");
	};
	
	//---------------BOW Modal Setup-----------------
	$scope.openBOWModal = function (size) {

    		var modalInstance = $uibModal.open({
      			templateUrl: '../fish_app/bow_modal.html',
			windowTemplateUrl:'../fish_app/window.html',
      			controller: 'BOWModalController',
      			size: size,
      			resolve: {
        			bows: function () {
          				return $scope.bows;
        			}
      			}
    		});

    		modalInstance.result.then(function (selectedBOW) {
      			$scope.bows.push(selectedBOW);
			console.log(selectedBOW);
			$scope.formdata.bow = selectedBOW._id;
			$scope.getHoles();
    		}, function () {
      			console.log('Modal dismissed at: ' + new Date());
    		});

  	};

	//---------------Hole Modal Setup-----------------
	$scope.openHoleModal = function (size) {
		if($scope.formdata.bow){
    			var modalInstance = $uibModal.open({
      				templateUrl: '../fish_app/hole_modal.html',
				windowTemplateUrl:'../fish_app/window.html',
      				controller: 'holeModalController',
      				size: size,
      				resolve: {
        				holes: function () {
          					return $scope.holes;
        				},
					bow: function(){
						return $scope.formdata.bow;
					}
      				}
    			});
	
    			modalInstance.result.then(function (selectedHole) {
      				$scope.holes.push(hole);
    			}, function () {
      				console.log('Modal dismissed at: ' + new Date());
    			});
		}
  	};

	//---------------Trip Modal Setup-----------------
	$scope.openTripModal = function(size) {
		var modalInstance = $uibModal.open({
			templateUrl:'../fish_app/trip_modal.html',
			windowTemplateUrl:'../fish_app/window.html',
			controller:'tripModalController',
			size:size,
		});

		modalInstance.result.then(function(trip){
			if(!$scope.trips){
				$scope.trips = [];
			}
			$scope.trips.push(trip);
			$scope.formdata.trip=trip._id;
		}, function(){
			console.log("Trip modal dismissed");
		});
	};
}]);
