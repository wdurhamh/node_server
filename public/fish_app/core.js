var fishApp = angular.module('fishApp', ['ngFileUpload', 'ui.bootstrap']);

fishApp.directive("fishMenu", function(){
	return {
		templateUrl: "../fish_app/fish_menu.html"
	}
});

fishApp.constant('CONST',{	
	BASEURL : '/api/fish',
	PICUPLOADPATH : 'public/pics/fishApp/'
});

