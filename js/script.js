var jpcfUrl = "http://localhost:8080";
//var jpcfUrl = "http://deusprogrammer.no-ip.org:8080";
var events = new Array();
var eventIndex = 0;
var currentPage;
var lastActive;

function loadPage(page) {
   $("article#js-content").hide().load("stubs/" + page + "_stub.html", function() {
      $(this).fadeIn("slow");
   });
   
   $.cookie("currentPage", page);
}

function setBannerText(text) {
   console.log("Changing event to: " + text);
   $("div#js-banner-text").hide().html(text).delay(1000).fadeIn("slow");
}

function addImageToSlideShow(image) {
   console.log("APPENDING: " + image);
   $("ul#js-slideshow").append("<li><img src='" + image + "' alt='' /></li>");
}

function loadSlideShowImages() {
   console.log("In loadSlideShowImages()");
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      jpcfUrl + "/jpcf/JS/listImageUrlsJs",
      "",
      function(data) {
         console.log("Call successful!");
         console.log("DATA " + data);
         for (var i in data) {
            console.log("IMAGE: " + jpcfUrl + data[i]);
            addImageToSlideShow(jpcfUrl + data[i]);
         }
      },
      "json"
   );
   jQuery.ajaxSetup({async:true});
}

function loadBannerTexts() {
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      jpcfUrl + "/jpcf/JS/listEventsJs",
      "",
      function(data) {
         console.log("Call successful!");
         for (var i in data) {
            console.log("EVENT: " + data[i].name + ": " + data[i].description + " [" + data[i].startDate + " to " + data[i].endDate + "] ");
            var event = {name: data[i].name, description: data[i].description, startDate: data[i].startDate, endDate: data[i].endDate};
            events.push(event);
         }
      },
      "json"
   );
   jQuery.ajaxSetup({async:true});
}

$(function(){
   console.log("Starting!");
   if ($.cookie("currentPage")) {
      currentPage = $.cookie("currentPage");
   }
   else {
      currentPage = "main";
      $.cookie("currentPage", "main");
   }
   loadSlideShowImages();
   loadBannerTexts();
   loadPage(currentPage);

   if (events.length != 0) {
      setBannerText(events[eventIndex].name);
   }
   setInterval(
      function() {
         var nEvents = events.length;
         
         console.log("Changing event!");
         
         if (eventIndex < nEvents - 1) {
            eventIndex++;
         }
         else if (eventIndex == nEvents - 1) {
            eventIndex = 0;
         }
         
         if (events.length != 0) {
            setBannerText(events[eventIndex].name);
         }
         },
      10000);
      
   $("a.a-link").click(function () {
      var link = $(this).attr("data-link");
      if (lastActive) {
         lastActive.removeClass("active");
      }
      lastActive = $(this).parent();
      lastActive.addClass("active");
      loadPage(link);
   });

	var slider=$('.slider');
	slider.tms({
			 //nameMask:'images/image*.jpg,1-21',
			 playBu:'.play',
			 slideShow:20000,
			 duration:1000,
			 interval:50,
			 progressBar:'.progbar',
			 pagination:true,
			 banners:false,
			 preload:false,
			 blocksX:1,
			 blocksY:10,
			 way:'lines',/*lines, spiral, vSnake, gSnake, diagonal, chess, randomly */
			 anim:'gSlideOdd', /* fade, expand, slideDown, slideLeft, slideUp, slideRight, slideFromTop, slideFromDown, slideFromLeft, slideFromRight, gSlider, vSlider, vSlideOdd, gSlideOdd */
			 easing:''
	});
})