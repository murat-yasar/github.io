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
   let menuItemsUrl = "https://github.com/murat-yasar/restaurant-page/blob/main/data/menu_items.json?category=";
   let menuItemsTitleHtml = "snippets/menu-items-title.html";
   let menuItemnsHtml = "snippets/menu-item.html";

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

   // Build categories view HTML using data and snippets HTML
   function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
      let finalHtml = categoriesTitleHtml;
      finalHtml += "<section class='row'>";

      for (let i=0; i<categories.length; i++){
         let html = categoryHtml;
         let name = "" + categories[i].name;
         let short_name = categories[i].short_name;

         html = insertProperty(html, "name", name);
         html = insertProperty(html, "short_name", short_name);
         finalHtml += html;
      }

      return finalHtml;
   }

   // Load the menu items view
   rest.loadMenuItems = function(categoryShort) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest( menuItemsUrl + categoryShort, buildAndShowCategoriesHTML);
   };

   // Build HTML for a single category page based on the data from server
   function buildAndShowMenuItemsHTML(categoryMenuItems){
      // Load title snippet of menu items page
      $ajaxUtils.sendGetRequest(
         menuItemsTitleHtml,
         function(menuItemsTitleHtml){
            // Retrieve single menu item snippet
            $ajaxUtils.sendGetRequest(
               menuItemHtml,
               function(menuItemHtml){
                  let menuItemsViewHtml = buildCategoriesViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
                  insertHtml("#main-content", menuItemsViewHtml);
               }, false);
         }, false);
   }

   // Build menu items view HTML using data and snippets HTML
   function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml){
      menuItemsTitleHtml = insertProperty(menuItemnsHtml, "name", categoryMenuItems.category.name);
      menuItemsTitleHtml = insertProperty(menuItemnsHtml, "special_instructions", categoryMenuItems.category.special_instructions);

      let finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";

      let menuItems = categoryMenuItems.menu_items;
      let catShortName = categoryMenuItems.category.short_name;

      for (let i=0; i<menuItems.length; i++){
         let html = menuItemHtml;
         html = insertProperty(html, "short_name", menuItems[i].short_name);
         html = insertProperty(html, "catShortName", menuItems[i].catShortName);
         html = insertItemPrice(html, "price_small", menuItems[i].price_small);
         html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
         html = insertItemPrice(html, "price_large", menuItems[i].price_large);
         html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
         html = insertProperty(html, "name", menuItems[i].name);
         html = insertProperty(html, "description", menuItems[i].description);

         // Add clearfix after every second menu item
         if(i%2!=0){html += "<div class='clearfix visible-lg-block visible-md-block'></div>"}

         finalHtml += html;
      }

      finalHtml += "</section>";
      return finalHtml;
   }

   // Append price with € sign
   function insertItemPrice(html, pricePropName, priceValue){
      if(!priceValue) return insertProperty(html, pricePropName, "");   // If price not defined return empty string
      priceValue = priceValue.toFixed(2) + " €";
      html = insertProperty(html, pricePropName, priceValue);
      return html;
   }

   // Append portion name
   function insertItemPortionName(html, portionPropName, portionValue){
      if(!portionValue) return insertProperty(html, portionPropName, "");   // If portion name not defined return empty string
      html = insertProperty(html, portionPropName, portionValue);
      return html;
   }


   global.$rest = rest;

})(window);
