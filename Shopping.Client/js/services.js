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

(function servicesInit(WinJS, WL) {
    "use strict";
    
   var apiUrl = 'http://localhost:2139/api';
   //var apiUrl = 'http://ecommerce13.cloudapp.net:2139/api';

    var liveIdInfo;
    
    function get(url) {
        /// <summary>
        /// Gets a JSON parsed result from WinJS.xhr request.
        /// </summary>
        return WinJS.xhr({
            url: url
        }).then(function(data) {
            return JSON.parse(data.responseText);
        });
    }
    
    function getLiveIdAsync() {
        /// <summary>
        /// Gets the liveId information for a currently logged in user.  
        /// </summary>
        
        if (liveIdInfo) {
            return WinJS.Promise.as(liveIdInfo);
        }

        var completed;
        var promise = new WinJS.Promise(function (c) { completed = c; });

        WL.Event.subscribe("auth.login", function onLoginComplete() {
            var session = WL.getSession();
            if (!session.error) {
                WL.api({
                    path: "/me",
                    method: "get"
                }).then(function (result) {
                    liveIdInfo = result;
                    completed(result);

                });
            }
        });

        WL.init();
        WL.login({
            scope: ["wl.signin", "wl.basic", "wl.emails"],
        });

        return promise;
    }

    function getCatalogVersionAsync() {
        /// <summary>
        /// Gets the current version of a catalog.  This is used to determine whether the offline cache is stale and needs to be udated.
        /// </summary>
        return get(apiUri + '/catalog/version');
    }

    function getCatalogAsync() {
        /// <summary>
        /// Gets the entire catalog.  This is used for all offline area and category navigation.  It contains MiniProducts which contain only a subset of information.
        /// </summary>
        return get(apiUri + '/catalog');
    }

    function getProductAsync(id) {
        /// <summary>
        /// Gets the full product information for a specified product id.
        /// </summary>
        return get(apiUri + '/product/' + id);
    }

    function getCartAsync(id) {
        /// <summary>
        /// Gets a promise for the cart with the specified Id.  This is used for loading a saved cart if the app is terminated or loading a remote cart from an alternative storage location.
        /// </summary>
        return get(apiUri + '/cart/' + id);
    }

    function createCartAsync() {
        /// <summary>
        /// Gets a promise for creating a new cart.  This will be used when a user adds an item to a cart and no cart exists.
        /// </summary>
        return getLiveIdAsync().then(function (liveIdInfo) {
            var cart = {
                Email: liveIdInfo.emails.preferred,
                BillingAddress: {
                    FirstName: liveIdInfo.first_name,
                    LastName: liveIdInfo.last_name
                }
            };

            return WinJS.xhr({
                type: 'post',
                url: apiUri + '/cart',
                headers: { "Content-type": "application/json" },
                data: JSON.stringify(cart)
            }).then(function(data) {
                return JSON.parse(data.responseText);
            });
        });
    }

    function updateCartAsync(cart) {
        /// <summary>
        /// Gets a promise for updating a cart.  This method accepts a cart and returns a cart with the updated cart from the result.  If the update fails the app ignores it and just returns the original cart.
        /// </summary>
        return WinJS.xhr({
                type: 'put',
                url: apiUri + '/cart/' + cart.Id,
                headers: { "Content-type": "application/json" },
                data: JSON.stringify(cart)
            }).then(function (data) {
                return JSON.parse(data.responseText);
            }, function (error) {
                WinJS.log(error.detail.message);
                return cart;
            });
    }

    var apiUri = 'http://localhost:2139/api';

    var services =
    {
        getCatalogVersionAsync: getCatalogVersionAsync,
        getCatalogAsync: getCatalogAsync,

        getProductAsync: getProductAsync,

        getLiveIdAsync: getLiveIdAsync,
        
        getCartAsync: getCartAsync,
        createCartAsync: createCartAsync,
        updateCartAsync: updateCartAsync
    };

    WinJS.Namespace.define("Shopping.Services", services);
})(WinJS, WL);