$(function(){

	$(".search-btn").on("click", function(){
      $(".search_sec").addClass("active");
      return false;
    });
    $(".close-search").on("click", function(){
      $(".search_sec").removeClass("active");
      return false;
    });
	
	
	
})