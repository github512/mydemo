	$(document).ready(
	function() 
	{
		$(".menuTitle3").click(function(){
			$(this).next("div").slideToggle("slow")
			.siblings(".menuContent3:visible").slideUp("slow");
			$(this).toggleClass("activeTitle3");
			$(this).siblings(".activeTitle3").removeClass("activeTitle3");
		});
	});

