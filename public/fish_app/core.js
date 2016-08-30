//USEFUL CONSTANTS
var baseURL = '/api/fish'
var baseUploadPath = 'public/pics/fishApp/'

var fishApp = angular.module('fishApp', ['ngFileUpload', 'ui.bootstrap']);

fishApp.controller('recordFishController', ['$scope','$http','$uibModal','Upload',function($scope, $http, $uibModal, Upload){
	//initialize variables
	$scope.formdata = {};
	$http.get(baseURL+'/loc')
	.success(function(data){
		$scope.bows=data;
		$scope.formdata.bow = data[0]._id;
		$scope.getHoles();
	})
	.error(function(){
		console.log('Unable to retrieve bodies of water');
	});

	$http.get(baseURL+'/trip')
	.success(function(data){
		$scope.trips = data;
		console.log($scope.trips);
	})
	.error(function(){
		console.log('Unable to retrieve bodies of water');
	});

	

	$scope.sendFish = function(){
		$http.post(baseURL + '/fish', $scope.formdata)
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
            				url: baseURL+'/images',
            				data: {file: files[i]}
        			}).then(function (resp) {
            				console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
					$scope.formdata.images.push(baseUploadPath + resp.config.data.file.name);
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
			$http.get(baseURL+'/loc/'+$scope.formdata.bow+'/holes', {id:$scope.formdata.bow})
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

fishApp.controller('BOWModalController', ['$scope', '$http','$timeout','$uibModalInstance', function($scope, $http, $timeout, $uibModalInstance){
	$scope.formdata = {};
	
	$scope.ok = function () {
    		$uibModalInstance.close($scope.selected.item);
  	};

  	$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
		$scope.formdata = {};
  	};

	$scope.displayPlaceName = function(marker){	
		$scope.formdata.name = marker.title;
		$scope.formdata.lnglt = marker.position;
	};

	$scope.loadMap = function(){
		//------------------------------------------------------------------------------------------------
		//initialize google map (javascript)
		$scope.map = new google.maps.Map(document.getElementById('bow-map'), {
          		center: {lat: -33.8688, lng: 151.2195},//TODO - make this initialize to current location
          		zoom: 13,
          		mapTypeId: 'roadmap'
        	});

		//Create search box associated with HTML element
		var input = document.getElementById('map-pac-input');
        	var searchBox = new google.maps.places.SearchBox(input);
        	$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		//LISTENERS

		//Bias search by current location
		$scope.map.addListener('bounds_changed', function() {
          		searchBox.setBounds($scope.map.getBounds());
        	});

		$scope.markers = [];
		searchBox.addListener('places_changed', function() {
          		var places = searchBox.getPlaces();

          		if (places.length == 0) {
            			return;
          		}

			//Clear markers from old search
			$scope.markers.forEach(function(marker) {
            			marker.setMap(null);
          		});
          		$scope.markers = [];

			//place new icons
			var bounds = new google.maps.LatLngBounds();
          		places.forEach(function(place) {
            			if (!place.geometry) {
              				console.log("Returned place contains no geometry");
              				return;
            			}
            			var icon = {
              				url: place.icon,
              				size: new google.maps.Size(71, 71),
              				origin: new google.maps.Point(0, 0),
              				anchor: new google.maps.Point(17, 34),
              				scaledSize: new google.maps.Size(25, 25)
            			};

				//create a marker for each new place
				var marker = new google.maps.Marker({
              				map: $scope.map,
              				icon: icon,
              				title: place.name,
              				position: place.geometry.location
            			});
				marker.addListener('click', function(){
					$scope.$apply($scope.displayPlaceName(marker));
				});
				$scope.markers.push(marker);

				if (place.geometry.viewport) {
              				// Only geocodes have viewport.
              				bounds.union(place.geometry.viewport);
                          	} else {
              	 	                bounds.extend(place.geometry.location);
                                }
                     	});
                        $scope.map.fitBounds(bounds);
          	});
		//Allow for custom click, in the event google maps doesn't have the place
		//Need way to add a name
		$scope.clickedMarker;
		$scope.map.addListener('click', function(e){
			$scope.$apply(function(){
			//display a new proposed marker
				if($scope.clickedMarker){
					$scope.clickedMarker.setMap(null);
				}
				//marker needs an on click which lets you add a name
				var name = "Unlabeled";
				if($scope.formdata.name){
					name = $scope.formdata.name;
				}
				$scope.clickedMarker = new google.maps.Marker({
					title: name,
    					position: e.latLng,
    					map: $scope.map
  				});
				$scope.clickedMarker.addListener('click', function(){
					$scope.$apply($scope.displayPlaceName($scope.clickedMarker));
				});
  				$scope.map.panTo(e.latLng);
			});
		});
		//------------------------------------------------------------------------------------------------
	};	


	$scope.clearForm=function(){
		$scope.formdata={};
	};
	
	$scope.clearLnglt = function(){
		delete $scope.formdata.lnglt;
	};

	$scope.updateManualMarkerName = function(){
		if($scope.clickedMarker && $scope.formdata.name){
			$scope.clickedMarker.title = $scope.formdata.name;
			$scope.clickedMarker.setMap(null);
			$scope.clickedMarker.setMap($scope.map);
		}
	}

	
	$scope.createBOW = function(){
		//TODO - grab long and lat
		if($scope.formdata.name){
			if(!$scope.formdata.lnglt){
				$scope.formdata.lnglt = {};
			}
                	$http.post(baseURL + '/loc', $scope.formdata)
                	.success(function(data){
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

fishApp.controller('holeModalController', ['$scope', '$http', '$uibModalInstance','holes','bow', function($scope, $http, $uibModalInstance, holes, bow){
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
                	$http.post(baseURL + '/hole', $scope.formdata)
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

fishApp.controller('tripModalController', ['$scope','$http','$uibModalInstance', function($scope,$http,$uibModalInstance){
	$scope.formdata = {};
	
  	$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
		$scope.formdata = {};
  	};

	$scope.createTrip = function(){	
		if($scope.formdata.name){
			console.log('Sending trip');
                	$http.post(baseURL + '/trip', $scope.formdata)
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

fishApp.directive("fishMenu", function(){
	return {
		templateUrl: "../fish_app/fish_menu.html"
	}
});

