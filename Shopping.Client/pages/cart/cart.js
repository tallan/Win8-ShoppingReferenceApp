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
/// <reference path="cartViewModel.js" />

(function () {
    "use strict";

    function OneItemPerColumnLayoutManager() {
        this.index = 1;

        this.layout = function (el) {
            el.style["-ms-grid-column"] = this.index++;
        };
    };

    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var api = Shopping.Api;
    var vm = new Shopping.ViewModel.CartViewModel();

    ui.Pages.define("/pages/cart/cart.html", {
        
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var self = this;
            var options = this.options = options || {};
            this.element = element;

            if (this.options.command) {
                WinJS.UI.processAll(element).then(function() {
                    return api.cart.processCommandAsync(options.command).then(function() {
                        // changed command action to processed so it doesn't get re-processed by navigation via the backStack
                        nav.state.command.prevAction = nav.state.command.action;
                        nav.state.command.action = "processed";
                    });
                }).then(function () { self.initialize(); });
            }
            else {
                WinJS.UI.processAll(element).then(function () { self.initialize(); });
            }
        },

        initialize: function () {
            var self = this;
            var element = this.element;

            vm.initAsync().then(function (vm) {
                element.querySelector('.cartLoading').style.display = "none";

                if (vm.HasPayment) {
                    WinJS.Utilities.addClass(element, "orderConfirmation");
                }

                WinJS.Binding.processAll(element, vm);

                var cartItems = element.querySelector(".items").winControl;
                cartItems.itemTemplate = element.querySelector('.itemTemplate');
                cartItems.layoutManager = new OneItemPerColumnLayoutManager();
                cartItems.itemDataSource = vm.items;

                var checkout = element.querySelector('.checkout');
                checkout.addEventListener('click', function() {
                    nav.navigate('/pages/billingEntry/billingEntry.html');
                });

                var continueShopping = element.querySelector('.continue');
                continueShopping.addEventListener('click', function () {
                    nav.navigate('/pages/home/home.html');
                });

                var submitOrder = element.querySelector('.submitOrder');
                submitOrder.addEventListener('click', function () {
                    api.cart.submitOrder();
                    nav.navigate('/pages/thankYou/thankYou.html');
                });

                self.setupQuantityListener(element);
            });
        },

        setupQuantityListener: function(element) {
            var currentQuantity;
            var self = this;

            element.attachEvent("onfocusin", function (e) {
                var isQuantity = WinJS.Utilities.hasClass(e.srcElement, "quantity");
                if (isQuantity) {
                    currentQuantity = +e.srcElement.value;
                }
            });

            var focusOut = function (e) {
                var isQuantity = WinJS.Utilities.hasClass(e.srcElement, "quantity");
                if (isQuantity) {
                    var quantity = +e.srcElement.value;
                    if (quantity != currentQuantity) {
                        element.detachEvent("onfocusout", focusOut);
                        var allQuantities = WinJS.Utilities.query(".quantity", element);
                        var index = allQuantities.indexOf(e.srcElement);
                        self.processQuantityChanged(index, quantity);
                    }
                }
            };
            element.attachEvent("onfocusout", focusOut);
        },

        processQuantityChanged: function (index, quantity) {
            var self = this;
            if (index >= 0 && index < api.cart.items().length) {
                var item = api.cart.items()[index];
                var action = quantity <= 0 ? 'remove' : 'updateQuantity';

                var command = {
                    action: action,
                    item: item,
                    index: index,
                    newQuantity: quantity
                };

                api.cart.processCommandAsync(command).then(function () {
                    // reload the cart
                    self.initialize();
                });
            }
        }

    });
})();
