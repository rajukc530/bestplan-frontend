// testimonial owl

$('.testimonial00owl').owlCarousel({
    loop:false,
    margin:30,
    dots:true,
    navigation : false,
      slideSpeed : 500,
   		paginationSpeed : 800,
    	rewindSpeed : 1000,
      singleItem: true,
			autoPlay : true,
    	stopOnHover : true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:2
        }
    }
})

// 
$("document").ready(function(){
  $(".tab-slider--body").hide();
  $(".tab-slider--body:first").show();
});

$(".tab-slider--nav li").click(function() {
  $(".tab-slider--body").hide();
  var activeTab = $(this).attr("rel");
  $("#"+activeTab).fadeIn();
	if($(this).attr("rel") == "tab2"){
		$('.tab-slider--tabs').addClass('slide');
	}else{
		$('.tab-slider--tabs').removeClass('slide');
	}
  $(".tab-slider--nav li").removeClass("active");
  $(this).addClass("active");
});


AOS.init({
    duration: 1200,
  })

//   nav

$('.menu-toggle').click(function() {
  
    $('.site-nav').toggleClass('site-nav--open', 992);
    $(this).toggleClass('open');
    
  })

//   modal
var elements = $('.modal-overlay, .modal');

$('.bt-modal').click(function(){
    elements.addClass('active');
});

$('.close-modal').click(function(){
    elements.removeClass('active');
});