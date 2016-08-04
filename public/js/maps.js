$(function(){
	var first_search = true;
	$("#search-button").click(function(){
		var search = encodeURIComponent($('#loc_name').val());
		if (first_search){
			first_search = false;
			var html_block = '<div class="form-group"><label for="elevation">Elevation</label><input type="text" name="elevation" id="elevation" class="form-control"></div>'
				+'<div class="form-group"><label for="depth">Depth</label><input type="text" name="depth" id="depth" class="form-control"></div>'
				+'<div class="form-group"><label for="loc_description">Description<input type="text" name="loc_description" id="loc_description" class="form-control"></label></div>'
				+'<div class="form-group"><iframe id="google-map-iframe"  width="550" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBLRoAMLBXxLs3gP-CosNGq784ul46zL64&amp;q='+search +'" allowfullscreen></iframe></div>';
			$(html_block).insertAfter("#loc-name-div");
		}
		else{
			$("#google-map-iframe").attr("src", 'https://www.google.com/maps/embed/v1/search?key=AIzaSyBLRoAMLBXxLs3gP-CosNGq784ul46zL64&amp;q='+search);
		}
	});	
});
