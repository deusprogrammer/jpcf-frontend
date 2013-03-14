var jpcfUrl = "http://jpcf-church.no-ip.org:8080";
var testUrl = "http://localhost:8080";
var blogUser = "deusprogrammer";
var events = new Array();
var blogs  = new Array();
var eventIndex = 0;
var currentPage;
var lastActive;
var cache = [];

function preloadImages(arguments) {
 var args_len = arguments.length;
 for (var i = args_len; i--;) {
   console.log("ARGUMENT: " + jpcfUrl + arguments[i]);
   var cacheImage = document.createElement('img');
   cacheImage.src = jpcfUrl + arguments[i];
   cache.push(cacheImage);
   
   $("ul#js-slideshow").append(cacheImage);
 }
}

function loadPage(page) {
   $("article#js-content").hide().load("stubs/" + page + "_stub.html", function() {
      $(this).fadeIn("slow");
      if (page == "media") {
         console.log("LOADING PODCASTS!");
         loadPodcasts();
         
         $("table.podcast-table").attr("style", "position: relative; left: 10px;");
         $("table.podcast-table td, th").attr("style", "border: 1px solid black; background-color: lightblue; margin: 10px; padding: 10px; font-size: 20px;");
         $("table.podcast-table td.podcast-name").css("width", "200px");
         $("table.podcast-table td.podcast-description").css("width", "400px");
         $("table.podcast-table th").css("color", "white").css("font-size: 25px;");
      } else if (page == "main") {
         writeEvents();
         writeBlogs();
      }
   });
   
   $.cookie("currentPage", page);
}

function setBannerEvent(event) {
   console.log("Changing event to: " + event.name);
   var eventHtml = "<div class='event-name'><a href='#' id='event-link'>" + event.name + "</a></div><div class='event-description'>" + event.description + "</div><div class='event-time'>" + event.startDate + " to " + event.endDate + "</div>";
   $("div#js-banner-text").hide().html(eventHtml).delay(1000).fadeIn("slow");
}

function addImageToSlideShow(image) {
   console.log("APPENDING: " + image);
   $("ul#js-slideshow").append("<li><img src='" + image + "' alt='' /></li>");
}

function loadSlideShowImages() {
   console.log("In loadSlideShowImages()");
   
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      jpcfUrl + "/jpcf/JS/listImageUrls.json",
      "",
      function(data) {
         console.log("Call successful!");
         console.log("DATA " + data);
         preloadImages(data);
      },
      "json"
   );
   jQuery.ajaxSetup({async:true});
}

function loadLatestBlogs(user, limit) {
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      testUrl + "/Clogger/js/" + user + "/summary",
      {limit: limit},
      function(data) {
         console.log("Call successful!");
         for (var i in data) {
            console.log("BLOG: " + data[i].title + ": " + data[i].content + "(" + data[i].dateCreated + ")");
            var blog = {title: data[i].title, content: data[i].content, dateCreated: data[i].dateCreated, link: data[i].link};
            blogs.push(blog);
         }
      },
      "json"
   );
   jQuery.ajaxSetup({async:true});
}

function loadEvents() {
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      jpcfUrl + "/jpcf/JS/listEvents.json",
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

function loadPodcasts() {
   jQuery.ajaxSetup({async:false});
   jQuery.get(
      jpcfUrl + "/jpcf/JS/listPodcasts.json",
      "",
      function(data) {
         console.log("Call successful!");
         for (var i in data) {
            $("tbody#podcast-list").append("<tr><td class='podcast-name'><a href='" + jpcfUrl + data[i].url + "'>" + data[i].name + "</a></td><td class='podcast-description'>" + data[i].description + "</td></tr>");
         }
      },
      "json"
   );
   jQuery.ajaxSetup({async:true});
}

function writeEvents() {
    console.log("IN WRITE EVENTS()");
    
    if (events.length == 0) {
        $('div#upcoming-events').html("None");        
    } else {
        $('div#upcoming-events').html("<ul>");
        for (var i in events) {
            console.log("WRITING EVENT: " + events[i].name);
            $('div#upcoming-events').append("<li><b>" + events[i].startDate + "</b>- " + events[i].name + "</li>");
        }
        $('div#upcoming-events').append("</ul>");
    }
}

function writeBlogs() {
    console.log("IN WRITE BLOGS()");
    if (blogs.length == 0) {
        $('div#latest-blogs').html("None");       
    } else {
        $('div#latest-blogs').html("<ul>");
        for (var i in blogs) {
            console.log("WRITING BLOG: " + blogs[i].title);
            $('div#latest-blogs').append("<li><a class='blog-link' href='" + blogs[i].link + "'><b>" + blogs[i].title + "</b></a> (" + blogs[i].dateCreated + ")</li>");
        }
        $('div#latest-blogs').append("</ul>");
        $('div#latest-blogs').append("<a class='blog-link' href='" + testUrl + "/Clogger/user/" + blogUser + "/blogs'>See All Blog Posts</a>");
    }
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
   loadEvents();
   loadLatestBlogs(blogUser, 3);
   loadPage(currentPage);
   
   if (currentPage === "main") {

   }

   if (events.length != 0) {
      setBannerEvent(events[eventIndex]);
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
            setBannerEvent(events[eventIndex]);
         }
      },
      10000);
      
   $("body").on("click", "a.a-link", function () {
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
