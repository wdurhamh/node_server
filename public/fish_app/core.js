//USEFUL CONSTANTS
var baseURL = '/api/fish'
var baseUploadPath = 'public/pics/fishApp/'

var fishApp = angular.module('fishApp', ['ngFileUpload']);

fishApp.controller('recordFishController', ['$scope','$http','Upload',function($scope, $http, Upload){
	//initialize variables
	$scope.formdata = {};
	$http.get(baseURL+'/loc')
	.success(function(data){
		$scope.bows=data;
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
			})
			.error(function(){
				console.log('Eror');
			});
		}
	};
	
}]);

fishApp.controller('newBOWController', ['$scope', '$http','$timeout', function($scope, $http, $timeout){
	$scope.formdata = {};
	$scope.displayPlaceName = function(marker){	
		$scope.formdata.name = marker.title;
		$scope.formdata.lnglt = marker.position;
	};
	$timeout(function(){
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
	});	


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
			console.log('Updated manual marker', $scope.formdata.name);
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
                        	$scope.formdata = {};
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

fishApp.controller('newHoleController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
	$scope.formdata = {};
	//need to get a long/lat from bow, use that to center
	$timeout(function(){
      		$scope.map = new google.maps.Map(document.getElementById('hole-map'), {
          		center: {lat: -34.397, lng: 150.644},
          		zoom: 5
        	});
		$scope.map.addListener('click', function(e){
			//display a new proposed marker
			var marker = new google.maps.Marker({
    				position: e.latLng,
    				map: $scope.map
  			});
  			$scope.map.panTo(e.latLng);
		});
		//place markers of existing Holes
	});	
		
	$scope.clearForm=function(){
		$scope.formdata={};
	};	
	$scope.createHole = function(){
		if($scope.formdata.name){
                	$http.post(baseURL + '/hole', $scope.formdata)
                	.success(function(data){
                        	$scope.formdata = {};
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
