function changeBannerText(text) {
   $("div#js-banner-text").html(text);
}

function addImageToSlideShow(image) {
   $("ul#js-slideshow").html("<li><img src='" + image + "' alt='' /></li>");
}

$(function () {
   //Get current events from server as a JSON list
   changeBannerText("I Might Have Farted");
   addImageToSlideShow("images/miku.jpg");
});