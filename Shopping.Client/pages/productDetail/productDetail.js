//*************************************************************************
//
//    Copyright (c) 2013 Tallan Inc.  All rights reserved. 
//
//    Use of this sample source code is subject to the terms of the Microsoft Limited Public License
//    at http://msdn.microsoft.com/en-us/cc300389.aspx#P and is provided AS-IS. 
//
//    For more information about Tallan, visit our website, http://tallan.com/.     
//
//    To see the topic that inspired this sample app, go to http://msdn.microsoft.com/en-us/library/windows/apps/jj635241. 
//
//*************************************************************************


/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/ui.js" />

(function () {
    "use strict";
    
    var nav = WinJS.Navigation;
    var vm = new Shopping.ViewModel.ProductDetailViewModel();
    var quantityText;
    var sizeSelector;
    var colorSelector;

    WinJS.UI.Pages.define("/pages/productDetail/productDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var product = options ? options.item : designModeProduct;

            vm.loadAsync(product).then(function () {
                WinJS.Binding.processAll(element, vm);

                var rating = element.querySelector("#ratingStars").winControl;
                rating.averageRating = vm.fullProduct.Rating;

                var reviewsList = element.querySelector('.reviewsList').winControl;
                reviewsList.itemTemplate = element.querySelector('.itemReviewTemplate');
                reviewsList.itemDataSource = vm.fullProduct.Reviews;
            });

            quantityText = element.querySelector(".quantity");
            sizeSelector = element.querySelector("#sltSize");
            colorSelector = element.querySelector("#sltColor");
            element.querySelector(".addToCart").addEventListener('click', addToCartClicked);

            var thumbs = WinJS.Utilities.query('.thumbsList img', element);
            thumbs.forEach(function (t) {
                t.addEventListener('click', function () {
                    // In this demo we are just changing the background image.  Other apps can change the image src to update the larger image as needed.
                    element.querySelector('.itemZoom img').style.backgroundColor = window.getComputedStyle(t)['background-color'];
                }, false);
            });
        }
    });
    
    function addToCartClicked(e) {
        var addProductCommand = {
            action: 'add',
            productId: vm.product.ProductId,
            productName: vm.product.Name,
            productMainImage: vm.product.Image,
            price: vm.product.Price,
            quantity: +quantityText.value, // '+' converts to int
            size: sltSize.value,
            color: sltColor.value
        };

        nav.navigate("/pages/cart/cart.html", { command: addProductCommand });
    }
})();
