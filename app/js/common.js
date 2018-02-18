$(function() {

  var activeLink = $('header nav .active');
  var latestProductsCarousel = $('#last-products-carousel');

	activeLink.click(function(event) {
    event.preventDefault();
  });

	latestProductsCarousel.owlCarousel({
    center: true,
    loop: true,
    autoWidth: true,
    margin: 20,
    nav: true,
    navText: ["<div class='nav-left carousel-nav'><i class='fa fa-angle-left'></i></div>",
              "<div class='nav-right carousel-nav'><i class='fa fa-angle-right'></i></div>"]
  });

});
