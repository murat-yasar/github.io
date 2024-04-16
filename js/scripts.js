$(function(){
   $("#navbarToggle").blur(function(event){
      let screenWidth = window.innerWidth;
      if(screenWidth<768){
         $("#collapsable-nav").collapse('hide');
      };
   });
});

(function (global){
   let rest = {};
   let homeHtml = "snippets/home-snippet.html";

   // Convinience function to insert innerHTML for 'select'
   let insertHtml = function (selector, html){
      let targetElement = document.querySelector(selector);
      targetElement.innerHTML = html;
   };

   // Loading icon
   let showLoading = function (selector) {
      let html = "<div class='text-center'>";
      html += "<img src='assets/images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
   }

   // On page load
   document.addEventListener("DOMContentLoaded", function(event){
      // show home on first load
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
         homeHtml,
         function(responseText){
            document.querySelector("#main-content")
            .innerHTML = responseText;
         }, false);
   });

   global.$rest = rest;

})(window);