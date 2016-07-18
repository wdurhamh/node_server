function appendLocation(element, index, array){
	var el = '<option value="'+ element.id +'">'+element.name+'</option>'; 
	$('#loc').append(el);
}




$(function(){
	$.get('http://winstondhurst.me/api/fish/loc',
		function(data){
		data.foreach()		
		$('#loc').append();
	});
});
