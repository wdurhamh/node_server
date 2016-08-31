angular.module('fishApp').controller('BOWModalController', ['$scope', '$http','$timeout','$uibModalInstance','CONST', function($scope, $http, $timeout, $uibModalInstance, CONST){
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
                	$http.post(CONST.BASEURL + '/loc', $scope.formdata)
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
