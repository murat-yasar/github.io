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
   let allCategoriesUrl = "https://github.com/murat-yasar/restaurant-page/blob/main/data/categories.json";
   let categoriesTitleHtml = "snippets/categories-title-snippet.html";
   let categoryHtml = "snippets/category-snippet.html";

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

   // Return substitute of '{{propName}}' with propValue in given 'string'
   let insertProperty = function (string, propName, propValue) {
      let propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
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

   // Load the menu categories view
   rest.loadMenuCategories = function() {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest( allCategoriesUrl, buildAndShowCategoriesHTML);
   };

   // Build HTML for the categories page based on the data from server
   function buildAndShowCategoriesHTML(categories){
      // Load title snippet of categories page
      $ajaxUtils.sendGetRequest(
         categoriesTitleHtml,
         function(categoriesTitleHtml){
            // Retrieve single category snippet
            $ajaxUtils.sendGetRequest(
               categoryHtml,
               function(categoryHtml){
                  let categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                  insertHtml("#main-content", categoriesViewHtml);
               }, false);
         }, false);
   }

   global.$rest = rest;

})(window);
