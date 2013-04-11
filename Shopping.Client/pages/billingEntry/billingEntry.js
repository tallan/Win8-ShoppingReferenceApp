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
/// <reference path="billingViewModel.js" />

(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var api = Shopping.Api;
    var vm = new Shopping.ViewModel.BillingViewModel();

    ui.Pages.define("/pages/billingEntry/billingEntry.html", {
        
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var self = this;
            WinJS.Binding.processAll(element, api.cart.cart);
            self._enableDisableShipping(api.cart.cart.SameAddresses);

            var continueButton = element.querySelector('.continue');
            continueButton.addEventListener('click', function () {
                self._updateCartFromForm(element, api.cart.cart);

                nav.navigate('/pages/cart/cart.html', { view: 'confirmation' });
            });
            
            var demoButton = element.querySelector('.demo');
            demoButton.addEventListener('click', function() {
                var demoFirstName = api.cart.cart.BillingAddress.FirstName;
                if ((demoFirstName == null) || (demoFirstName == "")) {
                    demoFirstName = "Jane"
                }
                var demoLastName = api.cart.cart.BillingAddress.LastName;
                if ((demoLastName == null) || (demoLastName == "")) {
                    demoLastName = "Doe"
                }

                var demoCart = {
                    BillingAddress: {
                        FirstName: demoFirstName,
                        LastName: demoLastName,
                        Line1: "62 West 45th Street",
                        Line2: "5th Floor",
                        City: "New York",
                        State: "NY",
                        Zip: "10036"
                    },
                    ShippingAddress: {
                        FirstName: "John",
                        LastName: "Doe",
                        Line1: "175 Capital Boulevard",
                        Line2: "Suite 401",
                        City: "Rocky Hill",
                        State: "CT",
                        Zip: "06067"
                    },
                    PaymentInfo: {
                        CardType: "Visa",
                        CardNumber: "4444-4444-4444-4448",
                        CvvCode: 432,
                        ExpirationMonth: 6,
                        ExpirationYear: 2015
                    },
                    SameAddresses: false,
                    Terms: true
                };

                WinJS.Binding.processAll(element, demoCart);
                self._enableDisableShipping(demoCart.SameAddresses);
            });

            var sameAddressesCheck = element.querySelector('#same_addresses');
            sameAddressesCheck.addEventListener('change', function (e) {
                if (e.currentTarget.checked) {
                    var copy = function(srcSelector, destSelector) {
                        var src = element.querySelector(srcSelector);
                        var dest = element.querySelector(destSelector);
                        if (src && dest) {
                            if (src.tagName == "SELECT") {
                                dest.selectedIndex = src.selectedIndex;
                            } else {
                                dest.value = src.value;
                            }
                        }
                    };

                    copy("#billing_first_name", "#shipping_first_name");
                    copy("#billing_last_name", "#shipping_last_name");
                    copy("#billing_line1", "#shipping_line1");
                    copy("#billing_line2", "#shipping_line2");
                    copy("#billing_city", "#shipping_city");
                    copy("#billing_state", "#shipping_state");
                    copy("#billing_zip", "#shipping_zip");
                }

                self._enableDisableShipping(e.currentTarget.checked);
            });

        },

        _enableDisableShipping: function(disabled) {
            WinJS.Utilities.query(".shippingAddress input[type=text], .shippingAddress select").forEach(function (el) {
                el.disabled = disabled;
            });
        },
        
        _updateCartFromForm: function (element, cart) {
            // this is just a local helper function to quickly map the object 
            // setting the identical properties with the values from the element with the id.
            var mapObjectFromInputIds = function (address, maps) {
                for (var prop in maps) {
                    address[prop] = element.querySelector(maps[prop]).value;
                }
            };
            
            var billingMap = {
                FirstName: '#billing_first_name',
                LastName: '#billing_last_name',
                Line1: '#billing_line1',
                Line2: '#billing_line2',
                City: '#billing_city',
                State: '#billing_state',
                Zip: '#billing_zip',
            };
            
            mapObjectFromInputIds(cart.BillingAddress, billingMap);
            
            var shippingMap = {
                FirstName: '#shipping_first_name',
                LastName: '#shipping_last_name',
                Line1: '#shipping_line1',
                Line2: '#shipping_line2',
                City: '#shipping_city',
                State: '#shipping_state',
                Zip: '#shipping_zip',
            };

            mapObjectFromInputIds(cart.ShippingAddress, shippingMap);

            var paymentMap = {
                CardNumber: '#card_number',
                CardType: '#card_type',
                ExpirationMonth: '#card_month',
                ExpirationYear: '#card_year',
                CvvCode: '#card_cvv'
            };
            
            mapObjectFromInputIds(cart.PaymentInfo, paymentMap);

            cart.SameAddresses = element.querySelector("#same_addresses").checked;
            cart.Terms = element.querySelector("#terms").checked;
        }
    });
})();
